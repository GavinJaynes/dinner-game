import type { DinnerOption, AnimationCallback } from "./types";

export function startCountdown(callback: AnimationCallback): void {
  // Create countdown overlay
  const overlay = document.createElement("div");
  overlay.className = "countdown-overlay";
  overlay.id = "countdownOverlay";
  document.body.appendChild(overlay);

  let count = 3;

  function updateCountdown(): void {
    if (count > 0) {
      overlay.innerHTML = `<div class="countdown-number">${count}</div>`;
      count--;
      setTimeout(updateCountdown, 1000);
    } else {
      // Final reveal moment
      overlay.innerHTML = `<div class="final-reveal">🎭 REVEAL! 🎭</div>`;

      setTimeout(() => {
        // Remove overlay and show results
        document.body.removeChild(overlay);
        const gameContainer = document.querySelector(".game-container");
        gameContainer?.classList.remove("shake-animation");
        callback();
      }, 1500);
    }
  }

  updateCountdown();
}

export function showDramaticResults(
  player1Choice: DinnerOption,
  player2Choice: DinnerOption,
  isMatch: boolean,
  attempts: number
): void {
  const resultSection = document.getElementById("resultSection");
  const resultTitle = document.getElementById("resultTitle");
  const resultMessage = document.getElementById("resultMessage");

  if (!resultSection || !resultTitle || !resultMessage) {
    console.error("Required DOM elements not found");
    return;
  }

  // Add dramatic reveal animation
  resultSection.classList.add("dramatic-reveal");
  resultSection.style.display = "block";

  if (isMatch) {
    // WIN!
    resultSection.className = "result-section win dramatic-reveal";
    resultTitle.textContent = "🎉 DINNER DECIDED! 🎉";
    resultMessage.innerHTML = `
            <div style="font-size: 1.5em; margin: 15px 0; color: #28a745;">
                <strong>🍽️ ${player1Choice} 🍽️</strong>
            </div>
            Looks like dinner is sorted! Enjoy your meal!<br>
            <small>Solved in ${attempts} attempt${
      attempts > 1 ? "s" : ""
    } - Great minds think alike! 🧠</small>
        `;

    // Add some celebration effects
    setTimeout(() => {
      resultSection.style.background =
        "linear-gradient(45deg, #d4edda, #c3e6cb, #d4edda)";
      resultSection.style.backgroundSize = "200% 200%";
      resultSection.style.animation = "gradient 2s ease infinite";
    }, 500);
  } else {
    // Continue playing
    resultSection.className = "result-section continue dramatic-reveal";
    resultTitle.textContent = "🤔 No Match - Try Again!";
    resultMessage.innerHTML = `
            <div style="display: flex; justify-content: space-around; margin: 20px 0; font-size: 1.2em;">
                <div><strong>Player 1:</strong><br>🎴 ${player1Choice}</div>
                <div style="font-size: 2em; color: #dc3545;">≠</div>
                <div><strong>Player 2:</strong><br>🎴 ${player2Choice}</div>
            </div>
            <small>Different choices - pick again! (Remember: you can't choose the same option twice in a row)</small>
        `;
  }
}

export function cleanupAnimations(fullReset: boolean = false): void {
  // Remove any existing countdown overlay
  const existingOverlay = document.getElementById("countdownOverlay");
  if (existingOverlay && existingOverlay.parentNode) {
    existingOverlay.parentNode.removeChild(existingOverlay);
  }

  // Remove shake animation
  const gameContainer = document.querySelector(".game-container");
  gameContainer?.classList.remove("shake-animation");

  // Clean up result section
  const resultSection = document.getElementById("resultSection");
  if (resultSection) {
    if (fullReset) {
      resultSection.style.display = "none";
    }
    resultSection.classList.remove("dramatic-reveal");
    resultSection.style.animation = "";
    resultSection.style.background = "";
    resultSection.style.backgroundSize = "";
  }
}
