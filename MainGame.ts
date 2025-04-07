import { Card } from './Card';

class MauMauGame {
    deckId: string;
    currentCard: Card;
    players: string[] = [];
    playerHands: { [key: string]: Card[] } = {}; // cards specific to player

    // Initialize the game: shuffle deck and prepare game

    async initializeGame() {
        // Shuffle deck (API call)
        // Draw first card
        // use await as async
    }

    async drawCard(): Promise<Card[]> {
        // API call to draw cards
    }

    // Deal cards to players
    async dealCards(numPlayers: number = 2, cardsPerPlayer: number = 5) {
        // Draw cards and dstribute them
    }

    // Start the round: draw the first card
    async startRound() {
        const card = await this.drawCard();
        this.currentCard = card[0];
        console.log("First card on pile:", this.currentCard);
    }

    canPlayCard(card: Card): boolean {
        if (!this.currentCard) return false;
        return card.suit === this.currentCard.suit || card.value === this.currentCard.value;
    }

    playCard(player: string, card: Card) {
       //play card
    }


    showStatus() {
        //show Game Status
    }
}