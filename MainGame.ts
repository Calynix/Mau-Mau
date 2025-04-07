import axios from 'axios';
import { Card } from './Card';

class MauMauGame {
    deckId: string | null = null;
    currentCard: Card | null = null;
    players: string[] = [];
    playerHands: { [key: string]: Card[] } = {};

    //defines base url of api
    constructor(private API_URL: string = "https://deckofcardsapi.com/api/deck") {}

    async initializeGame() {
        const shuffleResponse = await axios.get(`${this.API_URL}/new/shuffle/?deck_count=1`);
        this.deckId = shuffleResponse.data.deck_id;
        console.log("Deck shuffled!");

        await this.drawCard();
    }

    async drawCard(count: number = 1): Promise<Card[]> {
        const drawResponse = await axios.get(`https://deckofcardsapi.com/api/deck/<<deck_id>>/draw/?count=2`);
        //Map api response to card interface
        const cards = drawResponse.data.cards.map((card: any) => ({
            suit: card.suit,
            value: card.value,
            image: card.image,
        }));

        return cards;
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