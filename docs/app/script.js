// SOC Multi-Agent Investigation UI
// Frontend interaction layer
// Backend / agent integration will be added later.

document.addEventListener("DOMContentLoaded", () => {

    console.log("SOC Investigation Platform loaded.");

    // Simulated system status
    const statusDot = document.querySelector(".status-dot");

    if (statusDot) {
        statusDot.style.backgroundColor = "#22c55e";
    }

    // Simulated investigation state
    const resultText = document.querySelector(".result-card p");

    if (resultText) {
        resultText.textContent =
            "Investigation ready. Awaiting agent analysis...";
    }

});
