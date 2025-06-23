import React, { useEffect, useState } from 'react';
import './App.css';
import { Card } from './MMG-Backend/Card';
import MauMauGame from './MMG-Backend/MainGame';

const game = new MauMauGame();

function App() {
    const [players, setPlayers] = useState(['Alice', 'Bob']);
    const [playerHands, setPlayerHands] = useState<{ [key: string]: Card[] }>({});
    const [currentCard, setCurrentCard] = useState<Card | null>(null);

    useEffect(() => {
        const startGame = async () => {
            game.players = players;
            await game.initializeGame();
            await game.dealCards(players.length, 5);
            await game.startRound();

            setPlayerHands({ ...game.playerHands });
            setCurrentCard(game.currentCard);
        };

        startGame();
    }, []);

    return (
        <div>
            <h1>Mau Mau Game</h1>
            <div>
                <h2>Current Card</h2>
                {currentCard && (
                    <img src={currentCard.image} alt={`${currentCard.value} of ${currentCard.suit}`} />
                )}
            </div>
            <div>
                {players.map((player) => (
                    <div key={player}>
                        <h3>{player}'s Hand</h3>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {playerHands[player]?.map((card, index) => (
                                <img key={index} src={card.image} alt={`${card.value} of ${card.suit}`} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
