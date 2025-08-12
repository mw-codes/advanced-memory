import { useState } from "react";

function Footer({ onCheckPair }) {
  const [position1, setPosition1] = useState(1);
  const [position2, setPosition2] = useState(2);

  const handlePairSubmit = () => {
    if (position1 === position2) return;
    const pairString = `${position1}-${position2}`;
    onCheckPair(pairString);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-base-300 border-t border-base-300 p-4 z-50">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {/* Position 1 Picker */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPosition1(Math.max(1, position1 - 1))}
            className="btn btn-circle btn-sm btn-primary"
            disabled={position1 <= 1}
          >
            -
          </button>
          <div className="badge badge-primary font-bold text-lg w-8">
            {position1}
          </div>
          <button
            onClick={() => setPosition1(Math.min(6, position1 + 1))}
            className="btn btn-circle btn-sm btn-primary"
            disabled={position1 >= 6}
          >
            +
          </button>
        </div>

        {/* Check Button */}
        <button
          onClick={handlePairSubmit}
          className="btn btn-success btn-circle"
          disabled={position1 === position2}
        >
          ✓
        </button>

        {/* Position 2 Picker */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPosition2(Math.max(1, position2 - 1))}
            className="btn btn-circle btn-sm btn-primary"
            disabled={position2 <= 1}
          >
            -
          </button>
          <div className="badge badge-primary font-bold text-lg w-8">
            {position2}
          </div>
          <button
            onClick={() => setPosition2(Math.min(6, position2 + 1))}
            className="btn btn-circle btn-sm btn-primary"
            disabled={position2 >= 6}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

export default Footer;
