// How many stars draw the name in the hero. Shared by the Hero (its note is rendered before the
// 3D code loads, so its space is reserved and nothing shifts) and the heroName demo.
export const heroStarCount = (isSmall) => (isSmall ? 3000 : 6500);
