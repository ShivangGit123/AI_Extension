import { runAgent } from "./agent.js";

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.mode === "auto") {
        runAgent(msg.query).then(result => sendResponse(result));
        return true; // allow async response
    }
});
