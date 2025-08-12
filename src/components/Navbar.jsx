function Navbar({ foundPairs, score, onReset }) {
  return (
    <div className="navbar bg-base-300 sticky top-0 z-50 shadow-lg border-b border-base-300">
      {/* Reset Button - Links */}
      <div className="flex-1 flex justify-start">
        <button onClick={onReset} className="btn btn-ghost btn-sm">
          Reset
        </button>
      </div>

      {/* Logo/Title - Absolut zentriert */}
      <div className="flex-none">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Advanced Memory
        </h1>
      </div>

      {/* Score - Rechts */}
      <div className="flex-1 flex justify-end">
        <div className="badge badge-primary">Score: {score}</div>
      </div>
    </div>
  );
}

export default Navbar;
