// Local runner for the Chrome extension AI agent
import { runAgent } from "./agent.js";

async function testAgent() {
    const queries = [
        "What is semantic search?",
        "Explain keyword match",
        "How does Chrome extension manifest work?",
        "Tell me about AI agents and planning"
    ];

    for (const q of queries) {
        console.log("\n===============================");
        console.log("Query:", q);
        console.log("===============================\n");

        const result = await runAgent(q);

        console.log(JSON.stringify(result, null, 2));
    }
}

testAgent();
