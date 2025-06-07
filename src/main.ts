import { DinnerGame } from './game/dinnerGame'

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new DinnerGame()
    game.init()
})