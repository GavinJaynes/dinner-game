import type { GameState, DinnerOption } from './types'

const dinnerOptions: DinnerOption[] = [
    "🍔 Burgers", "🥪 Toasted Sandwiches", "🍗 KFC", "🍝 Pasta (home cooked)",
    "🥘 Stir Fry at Home", "🇹🇭 Thai from Our Favorite Place", "🇬🇷 Greek Food",
    "🍕 Pizza Delivery", "🍣 Sushi", "🌯 Mexican/Burritos", "🥡 Chinese Takeout",
    "🍛 Indian Curry", "🐟 Fish and Chips", "🔥 BBQ", "🥗 Healthy Salad",
    "🥣 Cereal for Dinner", "🥞 Breakfast for Dinner", "🍜 Ramen Noodles",
    "🚚 Food Truck Adventure", "🎩 Fancy Restaurant", "🧊 Picnic in the Park",
    "🍦 Ice cream for Dinner", "❓ Mystery Ingredient Challenge", "🥫 Whatever's in the Fridge",
    "🆕 Order from That New Place", "🏠 Homemade Pizza", "🍲 Soup and Bread",
    "🍤 Tapas/Small Plates", "🥐 Brunch Food", "⛽ Gas Station Snacks", "♻️ Yesterday's Leftovers"
]

export const gameState: GameState = {
    round: 1,
    attempts: 0,
    dinnerOptions,
    currentPlayer: 1,
    bothPlayersReady: false,
    player1: {
        selectedCard: null,
        lastCard: null,
        cards: [...dinnerOptions]
    },
    player2: {
        selectedCard: null,
        lastCard: null,
        cards: [...dinnerOptions]
    }
}

export function resetGameState(): void {
    gameState.round = 1
    gameState.attempts = 0
    gameState.currentPlayer = 1
    gameState.bothPlayersReady = false
    gameState.player1 = {
        selectedCard: null,
        lastCard: null,
        cards: [...dinnerOptions]
    }
    gameState.player2 = {
        selectedCard: null,
        lastCard: null,
        cards: [...dinnerOptions]
    }
}