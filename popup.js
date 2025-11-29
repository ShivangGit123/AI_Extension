document.getElementById("run").addEventListener("click", () => {
    const query = document.getElementById("query").value;

    chrome.runtime.sendMessage(
        { query, mode: "auto" },
        (response) => {
            document.getElementById("output").innerText =
                `Best Match: ${response.best_match.text}\n` +
                `Score: ${response.best_match.score.toFixed(2)}\n` +
                `Source: ${response.best_match.source}`;

            document.getElementById("trace").innerText =
                JSON.stringify(response.trace, null, 2);
        }
    );
});

document.getElementById("toggleTrace").onclick = () => {
    const t = document.getElementById("trace");
    t.style.display = t.style.display === "none" ? "block" : "none";
};
