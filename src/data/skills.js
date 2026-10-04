/**
 * Technical Skills Data
 *
 * Categorized list of technical skills and proficiencies:
 * - Languages: Programming languages
 * - Frontend: UI/UX technologies
 * - Backend: Server-side frameworks and tools
 * - Database: Data storage systems
 * - AI: Agents, protocols and retrieval
 * - Enterprise: Commerce, payments and Salesforce platforms
 * - Cloud/DevOps: Cloud services, CI/CD, testing and dev tools
 * - Fundamentals: Core CS concepts
 *
 * Displayed as categorized skill chips in the Skills section
 */

export const skillsData = {
    "languages": ["Java", "Go", "JavaScript", "TypeScript", "Kotlin", "Dart", "C++", "Python"],
    "backend": ["Spring Boot", "Spring Security", "Java Microservices", "Java Reactive", "GraphQL", "REST APIs", "BFF Architecture", "Node.js"],
    "ai": ["Spring AI", "RAG", "MCP", "A2A", "UCP", "Gemini Agents", "OpenAI API", "Qdrant", "PGVector"],
    "enterprise": ["SFCC (SFRA, SCAPI, OCAPI, SLAS)", "Adyen", "nCino", "Agentforce", "Salesforce Sales Cloud"],
    "frontend": ["React", "Astro", "Three.js (WebGPU, TSL)", "Tailwind", "HTML/CSS", "PWA"],
    "database": ["PostgreSQL", "MySQL", "MongoDB", "Cloudflare D1", "Neon"],
    "cloud_devops": ["AWS", "Cloudflare Workers", "Docker", "Jenkins", "Netlify", "Git", "JUnit & Mockito", "SonarQube", "Postman"],
    "fundamentals": ["Data Structures", "Algorithms", "OOPs", "System Design"]
};

// Display names for each category, in sentence case
export const skillCategoryNames = {
    languages: 'Languages',
    backend: 'Backend',
    ai: 'AI and agents',
    enterprise: 'Commerce and enterprise',
    frontend: 'Frontend',
    database: 'Databases',
    cloud_devops: 'Cloud, DevOps and tools',
    fundamentals: 'Fundamentals',
};
