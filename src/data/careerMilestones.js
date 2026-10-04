/**
 * Career milestones in the order they happened: degree first, then work from oldest to newest.
 * Used by the Work section's Dijkstra route and the hacker terminal's `run dijkstra`.
 */
import { experienceData } from './experience';
import { educationData } from './education';

export const slug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const SHORT_LABELS = {
    'LLOYDS Credit System': 'Lloyds Credit System',
    'Cart & Checkout': 'Tapestry Cart & Checkout',
    'UCP (Universal Commerce Protocol)': 'Tapestry UCP',
};

export const careerMilestones = () => {
    const degree = educationData[0];
    const milestones = [{ id: 'nit-durgapur', label: degree.institution }];
    experienceData.slice().reverse().forEach((job) => {
        job.projects.slice().reverse().forEach((project) => {
            if (project.workstreams) {
                project.workstreams.slice().reverse().forEach((stream) => milestones.push({ id: slug(`${project.name}-${stream.name}`), label: SHORT_LABELS[stream.name] ?? stream.name }));
            } else {
                milestones.push({ id: slug(project.name), label: SHORT_LABELS[project.name] ?? project.name });
            }
        });
    });
    return milestones;
};
