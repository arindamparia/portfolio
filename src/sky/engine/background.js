import {
    AdditiveBlending,
    HalfFloatType,
    InstancedBufferAttribute,
    LinearFilter,
    Mesh,
    MeshBasicNodeMaterial,
    PlaneGeometry,
    PointsNodeMaterial,
    QuadMesh,
    RenderTarget,
    Sprite,
} from 'three/webgpu';
import {
    PI,
    abs,
    atan,
    float,
    instancedBufferAttribute,
    mix,
    mod,
    mx_fractal_noise_float,
    mx_fractal_noise_vec2,
    screenSize,
    screenUV,
    sin,
    smoothstep,
    texture,
    time,
    uv,
    vec2,
    vec3,
    vec4,
} from 'three/tsl';

/**
 * Background sky: the star field and the baked nebula.
 *
 * Stars live in a fixed depth band and wrap around as the page scrolls (uniforms.travel),
 * so scrolling flies forward through an endless field. Everything per-star happens on the GPU;
 * the CPU only updates a handful of uniforms per frame.
 */

// Depth band the stars recycle through, in front of the nebula plane
const FIELD = { x: 46, y: 30, near: -2, depth: 34 };

/**
 * data = (size, twinkle speed, twinkle phase, tint amount)
 */
export const createStars = ({ count, palette, uniforms }) => {
    const positions = new Float32Array(count * 3);
    const data = new Float32Array(count * 4);

    for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * FIELD.x;
        positions[i * 3 + 1] = (Math.random() - 0.5) * FIELD.y;
        positions[i * 3 + 2] = Math.random() * FIELD.depth;

        // Bias towards small stars, with a few bright ones
        data[i * 4] = 0.06 + Math.pow(Math.random(), 3) * 0.24;
        data[i * 4 + 1] = 0.4 + Math.random() * 1.6;
        data[i * 4 + 2] = Math.random() * Math.PI * 2;
        data[i * 4 + 3] = Math.random();
    }

    const aPosition = instancedBufferAttribute(new InstancedBufferAttribute(positions, 3));
    const aData = instancedBufferAttribute(new InstancedBufferAttribute(data, 4));

    const material = new PointsNodeMaterial({
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        sizeAttenuation: true,
    });

    // Wrap depth with scroll travel: z runs from (near - depth) up to near, then starts again far away
    const z = mod(aPosition.z.add(uniforms.travel), FIELD.depth).add(FIELD.near - FIELD.depth);
    material.positionNode = vec3(aPosition.x, aPosition.y, z);
    material.sizeNode = aData.x;

    // Streaks while scrolling fast: stretch each star along the direction away from the view centre
    const fromCentre = vec2(aPosition.x.sub(uniforms.camera.x), aPosition.y.sub(uniforms.camera.y));
    material.rotationNode = atan(fromCentre.y, fromCentre.x).sub(PI.mul(0.5));
    material.scaleNode = vec2(1, uniforms.streak.mul(0.7).add(1));

    // Mostly white stars, tinted towards the current time-of-day colours
    const tint = mix(palette.light, palette.accent, aData.w);
    material.colorNode = mix(vec3(1), tint, aData.w.mul(0.85));

    // Bright core with a faint halo, and a slow twinkle
    const falloff = float(1).sub(uv().sub(0.5).length().mul(2)).saturate();
    const glow = falloff.pow(6).add(falloff.pow(2).mul(0.12));
    const twinkle = sin(time.mul(aData.y).add(aData.z)).mul(0.35).add(0.65);

    // Fade in far away, fade out just before a star passes the camera
    const depthFade = smoothstep(FIELD.near - FIELD.depth, FIELD.near - FIELD.depth + 6, z)
        .mul(smoothstep(FIELD.near + 0.5, FIELD.near - 4, z));

    // Cursor torch: stars near the pointer brighten, as if lit by a torch
    const aspect = screenSize.x.div(screenSize.y);
    const toPointer = screenUV.sub(uniforms.pointer).mul(vec2(aspect, 1)).length();
    const torch = float(1).sub(smoothstep(0, 0.24, toPointer)).mul(uniforms.torch);

    material.opacityNode = glow.mul(twinkle).mul(depthFade).mul(uniforms.starOpacity).mul(torch.mul(1.8).add(1));

    const sprite = new Sprite(material);
    sprite.count = count;
    sprite.frustumCulled = false;

    return { sprite, material, maxCount: count };
};

/**
 * Bakes a nebula into a texture once: domain-warped fBm for soft gas clouds, ridged noise for
 * thin filaments, masked to a diagonal band like the Milky Way.
 * Channels: r = cloud density, g = colour mix, b = filament brightness.
 */
const bakeNebula = (renderer, small) => {
    // Soft clouds don't need detail: phones bake a quarter of the pixels
    const target = new RenderTarget(small ? 512 : 1024, small ? 256 : 512, { type: HalfFloatType, minFilter: LinearFilter, magFilter: LinearFilter, depthBuffer: false });
    const seed = float(Math.random() * 100);

    const coords = uv();
    const p = coords.mul(vec2(3.4, 1.7)).add(seed);
    const warp = mx_fractal_noise_vec2(vec3(p.mul(0.6), seed), 3);
    const q = p.add(warp.mul(1.4));

    const clouds = mx_fractal_noise_float(vec3(q, seed.mul(0.5)), 5).mul(0.5).add(0.5);
    const ridges = float(1).sub(abs(mx_fractal_noise_float(vec3(q.mul(1.8), seed.add(7)), 4)));

    // Diagonal band that bends slightly, fading out towards the band edges and the texture borders
    const bandCenter = float(0.5).add(coords.x.sub(0.5).mul(0.35)).add(sin(coords.x.mul(4).add(seed)).mul(0.06));
    const band = float(1).sub(smoothstep(0.02, 0.24, abs(coords.y.sub(bandCenter))));
    const border = smoothstep(0, 0.18, coords.x).mul(smoothstep(1, 0.82, coords.x));
    const mask = band.mul(border);

    const density = smoothstep(0.5, 0.95, clouds).mul(mask);
    const filaments = ridges.pow(12).mul(smoothstep(0.55, 0.85, clouds)).mul(mask);

    const material = new MeshBasicNodeMaterial();
    material.colorNode = vec4(density, warp.x.mul(0.5).add(0.5).saturate(), filaments, 1);

    const quad = new QuadMesh(material);
    renderer.setRenderTarget(target);
    quad.render(renderer);
    renderer.setRenderTarget(null);
    material.dispose();

    return target;
};

/**
 * Large plane far behind the stars showing the baked nebula, tinted with the time-of-day colours.
 */
export const createNebula = ({ renderer, palette, uniforms, small = false }) => {
    const target = bakeNebula(renderer, small);
    const sample = texture(target.texture, uv());

    const material = new MeshBasicNodeMaterial({
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
    });

    const gas = mix(palette.primary, palette.accent, sample.g);
    const glow = mix(gas, palette.light, sample.r.mul(sample.r).mul(0.6));
    material.colorNode = glow.add(vec3(sample.b).mul(0.5));
    material.opacityNode = sample.r.mul(0.16).add(sample.b.mul(0.07)).mul(uniforms.nebulaOpacity);

    const mesh = new Mesh(new PlaneGeometry(96, 48), material);
    mesh.position.z = -22;
    mesh.rotation.z = -0.12;
    mesh.renderOrder = -1;

    return {
        mesh,
        dispose: () => {
            material.dispose();
            mesh.geometry.dispose();
            target.dispose();
        },
    };
};
