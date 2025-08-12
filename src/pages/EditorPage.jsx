import { useState } from "react";
import { createSet } from "../utils/localStorage";
import { useNavigate } from "react-router-dom";

function EditorPage() {
  const navigate = useNavigate();

  // Set Info
  const [setName, setSetName] = useState("");
  const [setDescription, setSetDescription] = useState("");

  // Current Pair Input
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  // Pairs Array
  const [pairs, setPairs] = useState([]);

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Paar hinzufügen
  const handleAddPair = (e) => {
    e.preventDefault();

    if (!question.trim() || !answer.trim()) return;

    const newPair = {
      question: question.trim(),
      answer: answer.trim(),
    };

    setPairs([...pairs, newPair]);
    setQuestion("");
    setAnswer("");
  };

  // Paar entfernen
  const handleRemovePair = (index) => {
    setPairs(pairs.filter((_, i) => i !== index));
  };

  // Set speichern
  const handleSaveSet = async () => {
    if (!setName.trim() || pairs.length < 3) return;

    setIsLoading(true);

    try {
      const newSet = createSet(setName, setDescription, pairs);

      setShowSuccess(true);
      setTimeout(() => {
        navigate("/library");
      }, 1500);
    } catch (error) {
      console.error("Fehler beim Speichern:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Form Reset
  const handleReset = () => {
    setSetName("");
    setSetDescription("");
    setQuestion("");
    setAnswer("");
    setPairs([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 p-4">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-6">
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
          Learning Set Editor
        </h1>
        <p className="text-center text-base-content/70">
          Erstelle dein eigenes Lernset mit Fragen und Antworten
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Set Info Card */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-primary">Set Information</h2>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">Set Name *</span>
              </label>
              <input
                type="text"
                placeholder="z.B. Englisch Vokabeln Level 1"
                className="input input-bordered w-full"
                value={setName}
                onChange={(e) => setSetName(e.target.value)}
                maxLength={50}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">Beschreibung</span>
              </label>
              <textarea
                placeholder="Kurze Beschreibung des Sets..."
                className="textarea textarea-bordered"
                value={setDescription}
                onChange={(e) => setSetDescription(e.target.value)}
                maxLength={200}
              />
            </div>
          </div>
        </div>

        {/* Pair Input Card */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-secondary">Neues Paar hinzufügen</h2>

            <form onSubmit={handleAddPair} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold">Frage</span>
                  </label>
                  <input
                    type="text"
                    placeholder="z.B. Hello"
                    className="input input-bordered"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold">Antwort</span>
                  </label>
                  <input
                    type="text"
                    placeholder="z.B. Hallo"
                    className="input input-bordered"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-secondary"
                disabled={!question.trim() || !answer.trim()}
              >
                Paar hinzufügen
              </button>
            </form>
          </div>
        </div>

        {/* Pairs List */}
        {pairs.length > 0 && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-accent">
                Paare ({pairs.length})
                <div className="badge badge-accent">
                  {pairs.length >= 3 ? "Bereit!" : `${3 - pairs.length} fehlen`}
                </div>
              </h2>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {pairs.map((pair, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-base-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <span className="font-bold text-primary">
                        {pair.question}
                      </span>
                      <span className="mx-2 text-base-content/50">→</span>
                      <span className="text-secondary">{pair.answer}</span>
                    </div>
                    <button
                      onClick={() => handleRemovePair(index)}
                      className="btn btn-ghost btn-sm btn-circle text-error"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleReset}
                className="btn btn-outline"
                disabled={isLoading}
              >
                Zurücksetzen
              </button>

              <button
                onClick={handleSaveSet}
                className="btn btn-primary"
                disabled={!setName.trim() || pairs.length < 3 || isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Speichern...
                  </>
                ) : (
                  "Set Speichern"
                )}
              </button>
            </div>

            <p className="text-center text-sm text-base-content/60 mt-2">
              Minimum 3 Paare erforderlich
            </p>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="modal modal-open">
          <div className="modal-box text-center">
            <h3 className="font-bold text-lg text-success mb-4">
              Set erfolgreich erstellt! 🎉
            </h3>
            <p>Du wirst zur Bibliothek weitergeleitet...</p>
            <div className="loading loading-spinner loading-lg text-primary mt-4"></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditorPage;
