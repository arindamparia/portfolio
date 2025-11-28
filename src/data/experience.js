/**
 * Professional Experience Data
 *
 * Contains work experience history including:
 * - Company information
 * - Role and time period
 * - Projects worked on with focus areas and achievements
 *
 * Used to populate Experience section in both Modern and IDE views
 */

export const experienceData = [
    {
        "company": "Publicis Sapient",
        "role": "Associate SDE 2",
        "period": "Nov 2023 - Present",
        "projects": [
            {
                "name": "Hire Buddy",
                "role": "ASDE 1",
                "focus": "Java, Spring Boot, Spring AI",
                "details": "Built microservices for candidate management using Spring Boot. Integrated Spring AI for resume parsing. Achieved 95% SonarQube coverage."
            },
            {
                "name": "LLOYDS Credit System",
                "focus": "nCino, Agentforce, Salesforce",
                "details": "Automated commercial credit processes using nCino. Explored Agentforce for intelligent automation. Optimized Jenkins pipeline (40m -> 15m)."
            },
            {
                "name": "Tapestry Buy Team",
                "focus": "SFCC, SFRA",
                "details": "Led backend development for checkout/cart. Implemented server-side logic & API integrations."
            }
        ]
    }
];
