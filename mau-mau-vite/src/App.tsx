import { useEffect, useState } from "react";

interface Card {
  code: string;
  image: string;
  value: string;
  suit: string;
}

type Player = "Player 1" | "Player 2";

export default function App() {
  const [deckId, setDeckId] = useState("");
  const [hands, setHands] = useState<{ [key in Player]: Card[] }>({
    "Player 1": [],
    "Player 2": [],
  });
  const [topCard, setTopCard] = useState<Card | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Player>("Player 1");
  const [winner, setWinner] = useState<Player | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  const initializeGame = async () => {
    const newDeck = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1").then(res => res.json());
    setDeckId(newDeck.deck_id);

    const hand1 = await fetch(`https://deckofcardsapi.com/api/deck/${newDeck.deck_id}/draw/?count=6`).then(res => res.json());
    const hand2 = await fetch(`https://deckofcardsapi.com/api/deck/${newDeck.deck_id}/draw/?count=6`).then(res => res.json());
    const top = await fetch(`https://deckofcardsapi.com/api/deck/${newDeck.deck_id}/draw/?count=1`).then(res => res.json());

    setHands({
      "Player 1": hand1.cards,
      "Player 2": hand2.cards,
    });

    setTopCard(top.cards[0]);
    setCurrentPlayer("Player 1");
    setWinner(null);
    setGameStarted(true);
  };

  const shuffleDeck = async () => {
    await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`);
  };

  const isPlayable = (card: Card): boolean => {
    return card.suit === topCard?.suit || card.value === topCard?.value || card.value === "8";
  };

  const playCard = (card: Card) => {
    if (!isPlayable(card) || winner) return;

    const newHand = hands[currentPlayer].filter(c => c.code !== card.code);
    const updatedHands = { ...hands, [currentPlayer]: newHand };
    setHands(updatedHands);
    setTopCard(card);

    if (newHand.length === 0) {
      setWinner(currentPlayer);
    } else {
      switchTurn();
    }
  };

  const drawCard = async () => {
    if (!deckId || winner) return;

    const draw = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`).then(res => res.json());
    const updatedHands = {
      ...hands,
      [currentPlayer]: [...hands[currentPlayer], ...draw.cards],
    };
    setHands(updatedHands);
    switchTurn();
  };

  const switchTurn = () => {
    setCurrentPlayer(prev => (prev === "Player 1" ? "Player 2" : "Player 1"));
  };

  return (
    <div className="p-6 space-y-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center">🃏 Mau Mau - 2 Player</h1>

      {!gameStarted ? (
        <div className="text-center">
          <button onClick={initializeGame} className="bg-blue-500 text-white px-4 py-2 rounded">Start Game</button>
        </div>
      ) : (
        <>
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Top Card</h2>
            {topCard && <img src={topCard.image} alt={topCard.code} className="mx-auto w-24" />}
          </div>

          <div className="text-center mb-4">
            {winner ? (
              <>
                <h2 className="text-2xl font-bold text-green-600">{winner} Wins! 🎉</h2>
                <button onClick={initializeGame} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">Play Again</button>
              </>
            ) : (
              <>
                <h2 className="text-lg">Current Turn: <span className="font-bold">{currentPlayer}</span></h2>
                <button onClick={drawCard} className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded">Draw Card</button>
                <button onClick={shuffleDeck} className="ml-2 bg-gray-600 text-white px-4 py-2 rounded">Shuffle Deck</button>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(["Player 1", "Player 2"] as Player[]).map(player => (
              <div key={player}>
                <h3 className="text-lg font-semibold text-center">{player} {currentPlayer === player && !winner && "← Your Turn"}</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {hands[player].map(card => (
                    <img
                      key={card.code}
                      src={card.image}
                      alt={card.code}
                      className={`w-20 cursor-pointer transition-transform ${
                        currentPlayer === player && isPlayable(card) && !winner
                          ? "hover:scale-105"
                          : "opacity-50"
                      }`}
                      onClick={() => currentPlayer === player && isPlayable(card) ? playCard(card) : null}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
