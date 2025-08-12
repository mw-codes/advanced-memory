import { useState } from "react";

function Navbar({ score, onCheckPair, onReset, foundPairs }) {
  const [position1, setPosition1] = useState(1);
  const [position2, setPosition2] = useState(2);

  const handlePairSubmit = (e) => {
    e.preventDefault();

    // Verhindere gleiche Positionen
    if (position1 === position2) return;

    // Game-Logic aufrufen mit Slider-Werten
    const pairString = `${position1}-${position2}`;
    const success = onCheckPair(pairString);
  };

  return (
    <div className="navbar bg-base-300 sticky top-0 z-50 shadow-lg border-b border-base-300">
      {/* Logo/Title */}
      <div className="flex-1">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Advanced Memory
        </h1>
      </div>

      {/* Score & Input */}
      <div className="flex-none gap-4">
        {/* Score Badge */}
        <div className="badge badge-primary badge-lg font-bold">
          Score: {score}
        </div>

        {/* Reset Button */}
        <button onClick={onReset} className="btn btn-outline btn-sm">
          Reset
        </button>

        {/* Number Picker Controls - Mittig */}
        <div className="flex items-center gap-6">
          {/* Position 1 Number Picker */}
          <div className="flex flex-col items-center gap-2">
            <label className="text-xs text-base-content/70 font-bold">
              Position 1
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPosition1(Math.max(1, position1 - 1))}
                className="btn btn-circle btn-sm btn-primary"
                disabled={position1 <= 1}
              >
                -
              </button>
              <div className="badge badge-primary badge-lg font-bold text-lg min-w-12">
                {position1}
              </div>
              <button
                type="button"
                onClick={() => setPosition1(Math.min(6, position1 + 1))}
                className="btn btn-circle btn-sm btn-primary"
                disabled={position1 >= 6}
              >
                +
              </button>
            </div>
          </div>

          {/* VS Divider */}
          <div className="text-2xl font-bold text-primary">VS</div>

          {/* Position 2 Number Picker */}
          <div className="flex flex-col items-center gap-2">
            <label className="text-xs text-base-content/70 font-bold">
              Position 2
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPosition2(Math.max(1, position2 - 1))}
                className="btn btn-circle btn-sm btn-primary"
                disabled={position2 <= 1}
              >
                -
              </button>
              <div className="badge badge-primary badge-lg font-bold text-lg min-w-12">
                {position2}
              </div>
              <button
                type="button"
                onClick={() => setPosition2(Math.min(6, position2 + 1))}
                className="btn btn-circle btn-sm btn-primary"
                disabled={position2 >= 6}
              >
                +
              </button>
            </div>
          </div>

          {/* Check Button */}
          <button
            onClick={handlePairSubmit}
            className="btn btn-success btn-sm"
            disabled={position1 === position2}
          >
            Check
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
