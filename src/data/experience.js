/**
 * Professional Experience Data
 *
 * Contains work experience history including:
 * - Company information
 * - Role and time period
 * - Projects worked on with focus areas and achievements
 * - Optional workstreams for a client with several distinct pieces of work
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
                "name": "Tapestry (Coach & Coach Outlet)",
                "focus": "SFCC, Go, GraphQL, Spring Boot, Gemini AI Agents, Adyen",
                "details": "Backend engineer on Tapestry's commerce platform, from the storefront cart and checkout to an AI shopping agent pilot.",
                "workstreams": [
                    {
                        "name": "Cart & Checkout",
                        "focus": "SFCC (SFRA, SCAPI, OCAPI, SLAS), Go, GraphQL, Adyen",
                        "details": "Led backend development of the new cart and checkout on SFRA: controllers, server-side logic and data management. Built a headless SCAPI cart in Go and GraphQL, integrated OCAPI/SCAPI and Adyen payment flows, worked on basket and order lifecycle with the AP2 protocol, and added code-coverage tooling across cartridges."
                    },
                    {
                        "name": "UCP (Universal Commerce Protocol)",
                        "focus": "Spring Boot, Gemini AI Agents, UCP, MCP, A2A, SCAPI/SLAS, Adyen",
                        "details": "Built Spring Boot middleware connecting a Gemini AI shopping agent to SFCC and Adyen over the UCP, MCP and A2A protocols. Implemented SCAPI/SLAS authentication flows, idempotent transaction handling and a state-machine payment workflow."
                    }
                ]
            },
            {
                "name": "LLOYDS Credit System",
                "focus": "nCino, Agentforce, Salesforce, Jenkins",
                "details": "Automated commercial credit processes using nCino: dynamic document links, fulfillment-flow improvements, grouped request handling and defect fixes. Explored Agentforce for intelligent automation."
            },
            {
                "name": "Hire Buddy",
                "role": "ASDE 1",
                "focus": "Java, Spring Boot, REST APIs",
                "details": "Onboarding project: a hiring platform where HR receives applications, creates candidate profiles and assigns each candidate to a dedicated interviewer. Built Spring Boot REST APIs for candidate search and filtering with log tracing."
            }
        ]
    }
];
