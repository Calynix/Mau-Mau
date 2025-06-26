import { useEffect, useState } from "react";

interface Card {
  code: string;
  image: string;
  value: string;
  suit: string;
}

export default function App() {
  const [deckId, setDeckId] = useState("");
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [topCard, setTopCard] = useState<Card | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = async () => {
    const deck = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1").then(res => res.json());
    setDeckId(deck.deck_id);

    const hand = await fetch(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=6`).then(res => res.json());
    setPlayerHand(hand.cards);

    const top = await fetch(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=1`).then(res => res.json());
    setTopCard(top.cards[0]);

    setGameStarted(true);
  };

  const playCard = (card: Card) => {
    if (
      card.suit === topCard?.suit ||
      card.value === topCard?.value ||
      card.value === "8"
    ) {
      setTopCard(card);
      setPlayerHand(playerHand.filter(c => c.code !== card.code));
    } else {
      alert("You can't play that card!");
    }
  };

  const drawCard = async () => {
    const newCard = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`).then(res => res.json());
    setPlayerHand([...playerHand, ...newCard.cards]);
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">Mau Mau</h1>
      {!gameStarted ? (
        <button onClick={startGame} className="bg-blue-500 text-white px-4 py-2 rounded">Start Game</button>
      ) : (
        <>
          <div>
            <h2 className="text-xl font-semibold">Top Card</h2>
            {topCard && <img src={topCard.image} alt={topCard.code} className="w-24" />}
          </div>
          <div>
            <h2 className="text-xl font-semibold">Your Hand</h2>
            <div className="flex flex-wrap gap-2">
              {playerHand.map(card => (
                <img
                  key={card.code}
                  src={card.image}
                  alt={card.code}
                  className="w-24 cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => playCard(card)}
                />
              ))}
            </div>
          </div>
          <button onClick={drawCard} className="bg-green-500 text-white px-4 py-2 rounded">Draw Card</button>
        </>
      )}
    </div>
  );
}
