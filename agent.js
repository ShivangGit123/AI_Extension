import { documents } from "./data.js";

function embed(text) {
    const words = text.toLowerCase().split(/\W+/).filter(w => w);
    const vec = {};
    words.forEach(w => vec[w] = 1);
    return vec;
}

function cosineSim(a, b) {
    const common = Object.keys(a).filter(w => b[w]).length;
    const magA = Math.sqrt(Object.keys(a).length);
    const magB = Math.sqrt(Object.keys(b).length);
    return magA * magB ? common / (magA * magB) : 0;
}


function semanticSearch(query) {
    const qvec = embed(query);

    return documents
        .map(text => ({
            text,
            score: cosineSim(qvec, embed(text)),
            source: "local"
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
}


function keywordSearch(query) {
    const qWords = query.toLowerCase().split(/\W+/).filter(w => w);

    return documents
        .map(text => {
            let count = 0;
            qWords.forEach(w => {
                if (text.toLowerCase().includes(w)) count++;
            });
            const score = qWords.length ? count / qWords.length : 0;

            return { text, score, source: "local" };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
}


function pineconeFallback(query) {
    return {
        text: "Pinecone fallback result for: " + query,
        score: 0.80,
        source: "pinecone"
    };
}


function planner(query) {
    const words = query.split(" ").length;
    const exactHit = documents.some(d =>
        query.toLowerCase().split(" ").some(q =>
            d.toLowerCase().includes(q)
        )
    );

    if (words > 5 && exactHit) return "hybrid";
    if (words > 5) return "semantic_search";
    if (exactHit) return "keyword_search";

    return "semantic_search";
}


export async function runAgent(query) {
    const start = performance.now();

    const decision = planner(query);

    let semanticResults = [];
    let keywordResults = [];

    if (decision === "semantic_search" || decision === "hybrid")
        semanticResults = semanticSearch(query);

    if (decision === "keyword_search" || decision === "hybrid")
        keywordResults = keywordSearch(query);

    // merge results
    const combined = [...semanticResults, ...keywordResults]
        .sort((a, b) => b.score - a.score);

    let best = combined[0];
    let usedFallback = false;

    // fallback condition
    if (!best || best.score < 0.75) {
        best = pineconeFallback(query);
        usedFallback = true;
    }

    const latency = Math.round(performance.now() - start);

    return {
        planner_decision: decision,
        used_fallback_tool: usedFallback,
        best_match: best,
        trace: {
            reasoning: `Planner decided: ${decision}`,
            semantic_top_k_scores: semanticResults.map(r => r.score),
            keyword_top_k_scores: keywordResults.map(r => r.score),
            latency_ms: latency
        }
    };
}
