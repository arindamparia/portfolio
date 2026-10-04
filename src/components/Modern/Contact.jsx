import React, { useEffect, useMemo } from 'react';
import ChartTitle from './ChartTitle';
import { FaLinkedin, FaGithub, FaProjectDiagram } from 'react-icons/fa';
import { SiLeetcode } from 'react-icons/si';
import { personalInfo, socialLinks } from '../../constants/personalInfo';
import { vibrateLight } from '../../utils/vibration';
import ToastContainer from './Toast';
import ContactForm from './ContactForm';
import { useContactForm } from '../../hooks/useContactForm';
import { buildCareerGraph } from '../../sky/algorithms/careerGraph';
import { useSky } from '../../sky/react/SkyContext';
import { useSkyDemo } from '../../sky/react/useSkyDemo';
import { DemoCaption, DemoStage } from '../../sky/react/DemoUI';
import { labelAnchor } from '../../sky/react/labelAnchor';
import { useSideSpace } from '../../sky/react/useSideSpace';
import { randomSeed } from '../../sky/algorithms/random';

const loadContactRoute = () => import('../../sky/demos/contactRoute');

const ROUTE_PAD = 22;

const routeCaption = (state) => {
    if (!state || state.phase === 'idle') {
        return 'When you send a message, Dijkstra\'s algorithm routes it through this network of stars to me.';
    }
    if (state.phase === 'sending') return `Sending: hop ${state.hop} of ${state.hops} on the shortest route.`;
    if (state.phase === 'delivered') return `Delivered. Your message took the shortest route, ${state.hops} hops.`;
    return `Not delivered. Try again, or email ${personalInfo.email} directly.`;
};

const Contact = () => {
    const form = useContactForm();
    const { toasts, removeToast, lastResult } = form;

    // The routing animation follows the real outcome of each send
    const { status } = useSky();
    const sideSpace = useSideSpace();
    const routeGraph = useMemo(() => buildCareerGraph(
        [{ id: 'you', label: 'You' }, { id: 'me', label: personalInfo.name.first }],
        { seed: randomSeed(), waypoints: 24, neighbours: 3 }
    ), []);
    const { ref: routeRef, state: routeState, call: sendPacket, failed: routeFailed } = useSkyDemo(loadContactRoute, { graph: routeGraph });
    const routeLive = status !== 'fallback' && !routeFailed && sideSpace;

    useEffect(() => {
        if (lastResult) sendPacket('send', lastResult.status);
    }, [lastResult, sendPacket]);

    return (
        <section id="contact">
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            <div className="container">
                <ChartTitle algorithm="Dijkstra's routing">Contact</ChartTitle>
                <p className="chart-intro">Write to me about a role, a project, or anything you saw on this page.</p>

                <div className="chart-grid">
                <div>

                <div className="contact-direct">
                    <a href={`mailto:${personalInfo.email}`} className="contact-email" onClick={vibrateLight}>
                        {personalInfo.email}
                    </a>
                </div>

                <ul className="contact-socials">
                    <li>
                        <a href={socialLinks.github.url} target="_blank" rel="noopener noreferrer" onClick={vibrateLight}>
                            <FaGithub aria-hidden="true" /> {socialLinks.github.label}
                        </a>
                    </li>
                    <li>
                        <a href={socialLinks.linkedin.url} target="_blank" rel="noopener noreferrer" onClick={vibrateLight}>
                            <FaLinkedin aria-hidden="true" /> {socialLinks.linkedin.label}
                        </a>
                    </li>
                    <li>
                        <a href={socialLinks.leetcode.url} target="_blank" rel="noopener noreferrer" onClick={vibrateLight}>
                            <SiLeetcode aria-hidden="true" /> {socialLinks.leetcode.label}
                        </a>
                    </li>
                    <li>
                        <a href={socialLinks.algotracker.url} target="_blank" rel="noopener noreferrer" onClick={vibrateLight}>
                            <FaProjectDiagram aria-hidden="true" /> {socialLinks.algotracker.label}
                        </a>
                    </li>
                </ul>

                <ContactForm form={form} />
                </div>

                {routeLive && (
                    <div className="chart-stage-col">
                        <DemoStage
                            ref={routeRef}
                            className="route-stage"
                            label="A network of stars that your message travels through, along the shortest route found by Dijkstra's algorithm"
                        >
                            {routeGraph.nodes.slice(0, 2).map((node) => (
                                <span
                                    key={node.id}
                                    className={`stage-label ${routeState?.phase === 'delivered' && node.id === 'me' ? 'stage-label-selected' : ''}`}
                                    style={{
                                        left: `calc(${ROUTE_PAD}px + ${node.x} * (100% - ${ROUTE_PAD * 2}px))`,
                                        top: `calc(${ROUTE_PAD}px + ${node.y} * (100% - ${ROUTE_PAD * 2}px) + 14px)`,
                                        ...labelAnchor(node.x),
                                    }}
                                >
                                    {node.label}
                                </span>
                            ))}
                        </DemoStage>
                        <DemoCaption>{routeCaption(routeState)}</DemoCaption>
                        {routeState && routeState.phase !== 'sending' && (
                            <button type="button" className="demo-button" onClick={() => sendPacket('send', 'success')}>
                                Preview the route
                            </button>
                        )}
                    </div>
                )}
                </div>
            </div>
        </section>
    );
};

export default Contact;
