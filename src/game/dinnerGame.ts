import { gameState, resetGameState } from "./gameState";
import {
  startCountdown,
  showDramaticResults,
  cleanupAnimations,
} from "./animations";
import type { GameState, PlayerNumber, DinnerOption, Player } from "./types";

export class DinnerGame {
  private state: GameState;

  constructor() {
    this.state = gameState;
    this.setupEventListeners();
  }

  public init(): void {
    this.createCardGrids();
    this.updateUI();
  }

  private setupEventListeners(): void {
    const revealBtn = document.getElementById("revealBtn") as HTMLButtonElement;
    const resetBtn = document.getElementById("resetBtn") as HTMLButtonElement;

    if (revealBtn) {
      revealBtn.addEventListener("click", () => this.revealCards());
    }
    if (resetBtn) {
      resetBtn.addEventListener("click", () => this.resetGame());
    }
  }

  private createCardGrids(): void {
    const player1Grid = document.getElementById("player1Cards");
    const player2Grid = document.getElementById("player2Cards");

    if (!player1Grid || !player2Grid) {
      console.error("Player card grids not found");
      return;
    }

    player1Grid.innerHTML = "";
    player2Grid.innerHTML = "";

    this.state.dinnerOptions.forEach((option) => {
      // Player 1 cards
      const card1 = this.createCard(option, 1);
      player1Grid.appendChild(card1);

      // Player 2 cards
      const card2 = this.createCard(option, 2);
      player2Grid.appendChild(card2);
    });
  }

  private createCard(
    option: DinnerOption,
    playerNum: PlayerNumber
  ): HTMLDivElement {
    const card = document.createElement("div");
    card.className = "dinner-card";
    card.textContent = option;
    card.addEventListener("click", () => this.selectCard(playerNum, option));
    return card;
  }

  private selectCard(playerNum: PlayerNumber, option: DinnerOption): void {
    const player: Player = this.state[`player${playerNum}`];

    // Check if this card was used last round
    if (player.lastCard === option) {
      return; // Can't select the same card twice in a row
    }

    // Update selection
    player.selectedCard = option;

    // Update UI
    this.updateCardSelection(playerNum);
    this.updateSelectedDisplay(playerNum);
    this.checkRevealButton();
  }

  private updateCardSelection(playerNum: PlayerNumber): void {
    const cards = document.querySelectorAll(
      `#player${playerNum}Cards .dinner-card`
    ) as NodeListOf<HTMLDivElement>;
    const player: Player = this.state[`player${playerNum}`];

    cards.forEach((card) => {
      card.classList.remove("selected", "disabled");

      // Only show disabled cards (last round's choice), not current selection
      if (card.textContent === player.lastCard) {
        card.classList.add("disabled");
      }
      // Don't visually show which card is currently selected to keep it secret!
    });
  }

  private updateSelectedDisplay(playerNum: PlayerNumber): void {
    const display = document.getElementById(`player${playerNum}Selected`);
    const selected = this.state[`player${playerNum}`].selectedCard;

    if (!display) return;

    if (selected) {
      display.textContent = `✓ Card Selected (Hidden)`;
      display.style.background = "#d1ecf1";
      display.style.color = "#0c5460";
    } else {
      display.textContent = "Choose your dinner option";
      display.style.background = "#e9ecef";
      display.style.color = "#495057";
    }
  }

  private checkRevealButton(): void {
    const revealBtn = document.getElementById("revealBtn") as HTMLButtonElement;
    if (!revealBtn) return;

    const bothSelected =
      this.state.player1.selectedCard && this.state.player2.selectedCard;

    revealBtn.disabled = !bothSelected;
    if (bothSelected) {
      revealBtn.style.background = "linear-gradient(145deg, #28a745, #20c997)";
    } else {
      revealBtn.style.background = "#6c757d";
    }
  }

  private revealCards(): void {
    // Disable the button immediately
    const revealBtn = document.getElementById("revealBtn") as HTMLButtonElement;
    if (!revealBtn) return;

    revealBtn.disabled = true;
    revealBtn.textContent = "Get Ready...";

    // Add shake animation to the game container
    const gameContainer = document.querySelector(".game-container");
    gameContainer?.classList.add("shake-animation");

    // Start the dramatic countdown
    startCountdown(() => this.handleRevealResults());
  }

  private handleRevealResults(): void {
    const player1Choice = this.state.player1.selectedCard;
    const player2Choice = this.state.player2.selectedCard;

    if (!player1Choice || !player2Choice) {
      console.error("Player choices not found");
      return;
    }

    this.state.attempts++;

    const isMatch = player1Choice === player2Choice;

    showDramaticResults(
      player1Choice,
      player2Choice,
      isMatch,
      this.state.attempts
    );

    if (isMatch) {
      // Game won! Keep result displayed
    } else {
      // Set last cards for next round restriction
      this.state.player1.lastCard = player1Choice;
      this.state.player2.lastCard = player2Choice;

      // Start next round after delay
      setTimeout(() => {
        this.nextRound();
      }, 4000);
    }

    this.updateUI();
  }

  private nextRound(): void {
    this.state.round++;
    this.state.player1.selectedCard = null;
    this.state.player2.selectedCard = null;

    // Clean up animations and reset UI
    cleanupAnimations();

    // Reset reveal button
    const revealBtn = document.getElementById("revealBtn") as HTMLButtonElement;
    if (revealBtn) {
      revealBtn.textContent = "🎭 Reveal Cards!";
      revealBtn.disabled = true;
    }

    // Update card grids to show disabled last choices
    this.updateCardSelection(1);
    this.updateCardSelection(2);
    this.updateSelectedDisplay(1);
    this.updateSelectedDisplay(2);
    this.checkRevealButton();
    this.updateUI();
  }

  private resetGame(): void {
    resetGameState();

    // Clean up any animations and overlays
    cleanupAnimations(true);

    // Reset reveal button
    const revealBtn = document.getElementById("revealBtn") as HTMLButtonElement;
    if (revealBtn) {
      revealBtn.textContent = "🎭 Reveal Cards!";
    }

    this.createCardGrids();
    this.updateSelectedDisplay(1);
    this.updateSelectedDisplay(2);
    this.checkRevealButton();
    this.updateUI();
  }

  private updateUI(): void {
    const roundElement = document.getElementById("roundNumber");
    const attemptsElement = document.getElementById("matchAttempts");

    if (roundElement) roundElement.textContent = this.state.round.toString();
    if (attemptsElement)
      attemptsElement.textContent = this.state.attempts.toString();
  }
}
