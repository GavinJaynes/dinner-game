import { gameState, resetGameState } from './gameState'
import { startCountdown, showDramaticResults, cleanupAnimations } from './animations'
import type { GameState, PlayerNumber, DinnerOption, Player } from './types'

export class DinnerGame {
    private state: GameState

    constructor() {
        this.state = gameState
        this.setupEventListeners()
    }

    public init(): void {
        this.showCurrentPlayerTurn()
        this.updateUI()
    }

    private setupEventListeners(): void {
        const confirmBtn = document.getElementById('confirmBtn') as HTMLButtonElement
        const revealBtn = document.getElementById('revealBtn') as HTMLButtonElement
        const resetBtn = document.getElementById('resetBtn') as HTMLButtonElement
        
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => this.confirmSelection())
        }
        if (revealBtn) {
            revealBtn.addEventListener('click', () => this.revealCards())
        }
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetGame())
        }
    }

    private showCurrentPlayerTurn(): void {
        const turnSection = document.querySelector('.turn-section')
        const waitingSection = document.getElementById('waitingSection')
        const currentPlayerTitle = document.getElementById('currentPlayerTitle')
        const currentPlayerInstructions = document.getElementById('currentPlayerInstructions')
        
        if (!turnSection || !waitingSection || !currentPlayerTitle || !currentPlayerInstructions) {
            console.error('Required DOM elements not found')
            return
        }

        if (this.state.bothPlayersReady) {
            // Both players have selected, hide turn section and show reveal button
            turnSection.style.display = 'none'
            waitingSection.style.display = 'none'
            return
        }

        const currentPlayer = this.state.currentPlayer
        const otherPlayer = currentPlayer === 1 ? 2 : 1
        
        // Show current player's turn interface
        turnSection.style.display = 'block'
        waitingSection.style.display = 'none'
        turnSection.classList.add('active')
        
        currentPlayerTitle.textContent = `Player ${currentPlayer}'s Turn`
        currentPlayerInstructions.textContent = `Choose your dinner option (Player ${otherPlayer} look away! 👀)`
        
        this.createCardGrid()
    }

    private createCardGrid(): void {
        const cardGrid = document.getElementById('currentPlayerCards')
        
        if (!cardGrid) {
            console.error('Card grid not found')
            return
        }
        
        cardGrid.innerHTML = ''
        
        this.state.dinnerOptions.forEach(option => {
            const card = this.createCard(option)
            cardGrid.appendChild(card)
        })
        
        this.updateCardSelection()
        this.updateSelectedDisplay()
        this.checkConfirmButton() // Make sure button state is correct for new player
    }

    private createCard(option: DinnerOption): HTMLDivElement {
        const card = document.createElement('div')
        card.className = 'dinner-card'
        card.textContent = option
        card.addEventListener('click', () => this.selectCard(option))
        return card
    }

    private selectCard(option: DinnerOption): void {
        const currentPlayer: Player = this.state[`player${this.state.currentPlayer}`]
        
        // Check if this card was used last round
        if (currentPlayer.lastCard === option) {
            return // Can't select the same card twice in a row
        }
        
        // Update selection
        currentPlayer.selectedCard = option
        
        // Update UI
        this.updateCardSelection()
        this.updateSelectedDisplay()
        this.checkConfirmButton()
    }

    private updateCardSelection(): void {
        const cards = document.querySelectorAll('#currentPlayerCards .dinner-card') as NodeListOf<HTMLDivElement>
        const currentPlayer: Player = this.state[`player${this.state.currentPlayer}`]
        
        cards.forEach(card => {
            card.classList.remove('selected', 'disabled')
            
            if (card.textContent === currentPlayer.selectedCard) {
                card.classList.add('selected')
            } else if (card.textContent === currentPlayer.lastCard) {
                card.classList.add('disabled')
            }
        })
    }

    private updateSelectedDisplay(): void {
        const display = document.getElementById('currentPlayerSelected')
        const selected = this.state[`player${this.state.currentPlayer}`].selectedCard
        
        if (!display) return
        
        if (selected) {
            display.textContent = `Selected: ${selected}`
            display.style.background = '#d1ecf1'
            display.style.color = '#0c5460'
        } else {
            display.textContent = 'Choose your dinner option'
            display.style.background = '#e9ecef'
            display.style.color = '#495057'
        }
    }

    private checkConfirmButton(): void {
        const confirmBtn = document.getElementById('confirmBtn') as HTMLButtonElement
        if (!confirmBtn) return
        
        const hasSelection = this.state[`player${this.state.currentPlayer}`].selectedCard !== null
        
        confirmBtn.disabled = !hasSelection
        if (hasSelection) {
            confirmBtn.style.background = 'linear-gradient(145deg, #007bff, #0056b3)'
        } else {
            confirmBtn.style.background = '#6c757d'
        }
    }

    private confirmSelection(): void {
        const currentPlayer = this.state.currentPlayer
        const otherPlayer = currentPlayer === 1 ? 2 : 1
        
        // Check if both players have now made selections
        if (this.state[`player${otherPlayer}`].selectedCard) {
            // Both players ready!
            this.state.bothPlayersReady = true
            this.showBothPlayersReady()
        } else {
            // Switch to other player's turn
            this.state.currentPlayer = otherPlayer
            this.showCurrentPlayerTurn()
        }
    }

    private showBothPlayersReady(): void {
        const turnSection = document.querySelector('.turn-section') as HTMLElement
        const waitingSection = document.getElementById('waitingSection')
        
        if (turnSection) turnSection.style.display = 'none'
        if (waitingSection) {
            waitingSection.style.display = 'block'
            waitingSection.innerHTML = `
                <h3>🎉 Both Players Ready!</h3>
                <p>Time for the big reveal! Click the button below when you're both ready...</p>
            `
        }
        
        this.checkRevealButton()
    }

    private checkRevealButton(): void {
        const revealBtn = document.getElementById('revealBtn') as HTMLButtonElement
        if (!revealBtn) return
        
        const bothSelected = this.state.bothPlayersReady
        
        revealBtn.disabled = !bothSelected
        if (bothSelected) {
            revealBtn.style.background = 'linear-gradient(145deg, #28a745, #20c997)'
        } else {
            revealBtn.style.background = '#6c757d'
        }
    }

    private revealCards(): void {
        const revealBtn = document.getElementById('revealBtn') as HTMLButtonElement
        if (!revealBtn) return
        
        revealBtn.disabled = true
        revealBtn.textContent = 'Get Ready...'
        
        const gameContainer = document.querySelector('.game-container')
        gameContainer?.classList.add('shake-animation')
        
        startCountdown(() => this.handleRevealResults())
    }

    private handleRevealResults(): void {
        const player1Choice = this.state.player1.selectedCard
        const player2Choice = this.state.player2.selectedCard
        
        if (!player1Choice || !player2Choice) {
            console.error('Player choices not found')
            return
        }
        
        this.state.attempts++
        
        const isMatch = player1Choice === player2Choice
        
        showDramaticResults(player1Choice, player2Choice, isMatch, this.state.attempts)
        
        if (isMatch) {
            // Game won! Keep result displayed
        } else {
            // Set last cards for next round restriction
            this.state.player1.lastCard = player1Choice
            this.state.player2.lastCard = player2Choice
            
            setTimeout(() => {
                this.nextRound()
            }, 4000)
        }
        
        this.updateUI()
    }

    private nextRound(): void {
        this.state.round++
        this.state.currentPlayer = 1
        this.state.bothPlayersReady = false
        this.state.player1.selectedCard = null
        this.state.player2.selectedCard = null
        
        cleanupAnimations()
        
        const revealBtn = document.getElementById('revealBtn') as HTMLButtonElement
        if (revealBtn) {
            revealBtn.textContent = '🎭 Reveal Cards!'
            revealBtn.disabled = true
        }
        
        this.showCurrentPlayerTurn()
        this.checkConfirmButton()
        this.checkRevealButton()
        this.updateUI()
    }

    private resetGame(): void {
        resetGameState()
        
        cleanupAnimations(true)
        
        const revealBtn = document.getElementById('revealBtn') as HTMLButtonElement
        if (revealBtn) {
            revealBtn.textContent = '🎭 Reveal Cards!'
        }
        
        this.showCurrentPlayerTurn()
        this.checkConfirmButton()
        this.checkRevealButton()
        this.updateUI()
    }

    private updateUI(): void {
        const roundElement = document.getElementById('roundNumber')
        const attemptsElement = document.getElementById('matchAttempts')
        
        if (roundElement) roundElement.textContent = this.state.round.toString()
        if (attemptsElement) attemptsElement.textContent = this.state.attempts.toString()
    }
}