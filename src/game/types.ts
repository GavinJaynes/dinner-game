export type DinnerOption = string

export interface Player {
    selectedCard: DinnerOption | null
    lastCard: DinnerOption | null
    cards: DinnerOption[]
}

export interface GameState {
    round: number
    attempts: number
    dinnerOptions: DinnerOption[]
    player1: Player
    player2: Player
}

export type PlayerNumber = 1 | 2

export interface RevealResult {
    player1Choice: DinnerOption
    player2Choice: DinnerOption
    isMatch: boolean
    attempts: number
}

export type AnimationCallback = () => void