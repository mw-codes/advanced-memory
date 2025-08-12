import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getActiveSet, clearActiveSet } from "../utils/localStorage";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function GamePage() {
  const navigate = useNavigate();

  const [activeSet, setActiveSet] = useState(null);
  const [isLoadingSet, setIsLoadingSet] = useState(true);

  const positions = [1, 2, 3, 4, 5, 6];

  // Demo-Fallback für wenn kein Set aktiv
  const defaultImages = ["🐱", "🐶", "🐦", "🐱", "🐶", "🐦"];

  const [cards, setCards] = useState([]);
  const [score, setScore] = useState(0);
  const [foundPairs, setFoundPairs] = useState([]); // Gefundene Paare

  // Aktives Set laden
  useEffect(() => {
    setIsLoadingSet(true);
    const currentSet = getActiveSet();
    setActiveSet(currentSet);
    setIsLoadingSet(false);
  }, []);

  // Spiel initialisieren wenn Set geladen
  useEffect(() => {
    if (!isLoadingSet) {
      initializeGame();
    }
  }, [activeSet, isLoadingSet]);

  // Spiel initialisieren
  const initializeGame = () => {
    let gameData = [];
    let pairMapping = [];

    if (activeSet && activeSet.pairs.length >= 3) {
      // Lernset verwenden - erste 3 Paare
      const usedPairs = activeSet.pairs.slice(0, 3);

      // Erstelle Karten-Array mit Paar-Zuordnung
      usedPairs.forEach((pair, pairIndex) => {
        gameData.push({
          content: pair.question,
          pairId: pairIndex,
          type: "question",
        });
        gameData.push({
          content: pair.answer,
          pairId: pairIndex,
          type: "answer",
        });
      });
    } else {
      // Fallback zu Demo-Emojis
      const demoData = ["🐱", "🐶", "🐦", "🐱", "🐶", "🐦"];
      demoData.forEach((emoji, index) => {
        gameData.push({
          content: emoji,
          pairId: Math.floor(index / 2), // 0,0,1,1,2,2
          type: "emoji",
        });
      });
    }

    // Mischen und Positionen zuweisen
    const shuffled = [...gameData].sort(() => Math.random() - 0.5);
    const mapped = positions.map((pos, i) => ({
      pos,
      content: shuffled[i].content,
      pairId: shuffled[i].pairId,
      type: shuffled[i].type,
    }));

    setCards(mapped);
    setScore(0);
    setFoundPairs([]);
  };

  // Game Logic - Paar prüfen (gefixt für Lernsets)
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

    // Prüfe ob es das gleiche Paar ist (gleiche pairId)
    const isCorrectPair = card1.pairId === card2.pairId;

    if (isCorrectPair) {
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
    initializeGame();
  };

  // Set wechseln
  const handleChangeSet = () => {
    clearActiveSet();
    navigate("/library");
  };

  // Prüfe ob Karte gefunden wurde
  const isCardFound = (pos) => {
    return foundPairs.some((pair) => pair.includes(pos));
  };

  if (isLoadingSet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4 text-base-content/70">Lade Lernset...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
      {/* Navbar - Title, Reset & Score */}
      <Navbar foundPairs={foundPairs} score={score} onReset={resetGame} />

      {/* Main Content */}
      <div className="p-6">
        {/* Header */}
        <div className="text-center mb-8">
          {/* Aktives Set Info */}
          {activeSet ? (
            <div className="mb-4">
              <div className="badge badge-primary badge-lg mb-2">
                Aktives Set: {activeSet.name}
              </div>
              <p className="text-sm text-base-content/60">
                {activeSet.description}
              </p>
            </div>
          ) : (
            <div className="mb-4">
              <div className="badge badge-outline badge-lg mb-2">
                Demo-Modus
              </div>
              <p className="text-sm text-base-content/60">
                Erstelle ein Lernset für echte Fragen & Antworten
              </p>
            </div>
          )}

          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Advanced Memory
          </h1>
          <p className="text-base-content/70 text-lg">
            {activeSet
              ? "Finde die passenden Frage-Antwort-Paare!"
              : "Finde die passenden Paare!"}
          </p>

          {/* Navigation Buttons */}
          <div className="flex gap-4 justify-center mt-4">
            {activeSet ? (
              <button
                onClick={handleChangeSet}
                className="btn btn-outline btn-secondary"
              >
                Set wechseln
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate("/editor")}
                  className="btn btn-outline btn-primary"
                >
                  Neues Set erstellen
                </button>
                <button
                  onClick={() => navigate("/library")}
                  className="btn btn-outline btn-secondary"
                >
                  Meine Sets
                </button>
              </>
            )}
          </div>
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

                  {/* Content Display - je nach Typ */}
                  <div
                    className={`text-4xl mb-4 filter transition-all duration-300 ${
                      isCardFound(card.pos)
                        ? "grayscale opacity-50"
                        : "drop-shadow-lg"
                    }`}
                  >
                    {activeSet ? (
                      <div className="text-center">
                        <div className="text-lg font-medium mb-2">
                          {card.content}
                        </div>
                      </div>
                    ) : (
                      <div className="text-8xl">{card.content}</div>
                    )}
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
        <div className="text-center mt-12 mb-20">
          <div className="badge badge-outline badge-lg">
            {foundPairs.length}/3 Paare gefunden
          </div>
        </div>
      </div>

      {/* Footer - nur Position Picker */}
      <Footer onCheckPair={checkPair} />
    </div>
  );
}

export default GamePage;
