import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";

export default function App() {
  const positions = [1, 2, 3, 4, 5, 6];
  const images = ["🐱", "🐶", "🐦", "🐱", "🐶", "🐦"]; // Paare

  const [cards, setCards] = useState([]);
  const [score, setScore] = useState(0);
  const [foundPairs, setFoundPairs] = useState([]); // Gefundene Paare

  // Mische Bilder einmal beim Start
  useEffect(() => {
    const shuffled = [...images].sort(() => Math.random() - 0.5);
    const mapped = positions.map((pos, i) => ({
      pos,
      image: shuffled[i],
    }));
    setCards(mapped);
  }, []);

  // Game Logic - Paar prüfen
  const checkPair = (pairInput) => {
    const [pos1, pos2] = pairInput.split("-").map(Number);

    // Finde die Karten
    const card1 = cards.find((card) => card.pos === pos1);
    const card2 = cards.find((card) => card.pos === pos2);

    // Prüfe ob Eingabe gültig
    if (!card1 || !card2) {
      console.log("Ungültige Position!");
      return false;
    }

    // Prüfe ob schon gefunden
    const alreadyFound = foundPairs.some(
      (pair) => pair.includes(pos1) && pair.includes(pos2)
    );

    if (alreadyFound) {
      console.log("Paar bereits gefunden!");
      return false;
    }

    // Prüfe ob sie das gleiche Bild haben
    if (card1.image === card2.image) {
      setScore(score + 1);
      setFoundPairs([...foundPairs, [pos1, pos2]]);
      console.log("Richtig! +1 Punkt");
      return true;
    } else {
      console.log("Falsch!");
      return false;
    }
  };

  // Reset Game
  const resetGame = () => {
    const shuffled = [...images].sort(() => Math.random() - 0.5);
    const mapped = positions.map((pos, i) => ({
      pos,
      image: shuffled[i],
    }));
    setCards(mapped);
    setScore(0);
    setFoundPairs([]);
  };

  // Prüfe ob Karte gefunden wurde
  const isCardFound = (pos) => {
    return foundPairs.some((pair) => pair.includes(pos));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
      {/* Navbar mit Props */}
      <Navbar
        score={score}
        onCheckPair={checkPair}
        onReset={resetGame}
        foundPairs={foundPairs}
      />

      {/* Main Content */}
      <div className="p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Advanced Memory
          </h1>
          <p className="text-base-content/70 text-lg">
            Finde die passenden Paare!
          </p>
        </div>

        {/* Cards Grid */}
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cards.map((card) => (
              <div
                key={card.pos}
                className={`card shadow-xl transition-all duration-300 border ${
                  isCardFound(card.pos)
                    ? "bg-success/20 border-success scale-95 opacity-75"
                    : "bg-base-100 border-base-300 hover:shadow-2xl hover:scale-105"
                }`}
              >
                <div className="card-body items-center text-center p-8">
                  {/* Position Badge */}
                  <div
                    className={`badge badge-lg mb-4 font-bold ${
                      isCardFound(card.pos) ? "badge-success" : "badge-primary"
                    }`}
                  >
                    Position {card.pos}
                  </div>

                  {/* Emoji Display */}
                  <div
                    className={`text-8xl mb-4 filter transition-all duration-300 ${
                      isCardFound(card.pos)
                        ? "grayscale opacity-50"
                        : "drop-shadow-lg"
                    }`}
                  >
                    {card.image}
                  </div>

                  {/* Status Indicator */}
                  {isCardFound(card.pos) && (
                    <div className="badge badge-success gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      Gefunden
                    </div>
                  )}

                  {/* Decorative Element */}
                  <div className="w-full h-2 bg-gradient-to-r from-primary/20 via-secondary/40 to-accent/20 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Win Message */}
        {foundPairs.length === 3 && (
          <div className="text-center mt-8">
            <div className="alert alert-success max-w-md mx-auto">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="font-bold">
                Gewonnen! Alle Paare gefunden! 🎉
              </span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12">
          <div className="badge badge-outline badge-lg">
            {foundPairs.length}/3 Paare gefunden
          </div>
        </div>
      </div>
    </div>
  );
}
