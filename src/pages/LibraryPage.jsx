import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  loadSets,
  deleteSet,
  createDemoSet,
  setActiveSet,
  markSetAsPlayed,
} from "../utils/localStorage";

function LibraryPage() {
  const navigate = useNavigate();

  const [sets, setSets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(null); // Set-ID für Delete-Modal

  // Sets laden beim Component-Mount
  useEffect(() => {
    loadSetsFromStorage();
  }, []);

  const loadSetsFromStorage = () => {
    setIsLoading(true);
    try {
      const loadedSets = loadSets();
      setSets(loadedSets);
    } catch (error) {
      console.error("Fehler beim Laden der Sets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Set löschen
  const handleDeleteSet = (setId) => {
    deleteSet(setId);
    setSets(sets.filter((set) => set.id !== setId));
    setDeleteModal(null);
  };

  // Demo-Set erstellen
  const handleCreateDemo = () => {
    const demoSet = createDemoSet();
    setSets([...sets, demoSet]);
  };

  // Set für Spiel auswählen
  const handlePlaySet = (set) => {
    // Set als aktiv setzen
    setActiveSet(set.id);
    // Als gespielt markieren
    markSetAsPlayed(set.id);
    // Zu Game navigieren
    navigate("/game");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4 text-base-content/70">Lade deine Sets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Meine Lernsets
          </h1>
          <button
            onClick={() => navigate("/editor")}
            className="btn btn-primary"
          >
            Neues Set erstellen
          </button>
        </div>
        <p className="text-base-content/70 text-center">
          Verwalte deine Lernsets und starte das Memory-Spiel
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Kein Sets Zustand */}
        {sets.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold text-base-content/70 mb-4">
              Noch keine Sets erstellt
            </h2>
            <p className="text-base-content/60 mb-6">
              Erstelle dein erstes Lernset oder probiere das Demo aus!
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate("/editor")}
                className="btn btn-primary"
              >
                Erstes Set erstellen
              </button>
              <button onClick={handleCreateDemo} className="btn btn-outline">
                Demo-Set erstellen
              </button>
            </div>
          </div>
        )}

        {/* Sets Grid */}
        {sets.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sets.map((set) => (
              <div
                key={set.id}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="card-body">
                  {/* Set Header */}
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="card-title text-primary line-clamp-2">
                      {set.name}
                    </h2>
                    <div className="badge badge-outline">
                      {set.pairs.length} Paare
                    </div>
                  </div>

                  {/* Beschreibung */}
                  {set.description && (
                    <p className="text-sm text-base-content/70 mb-4 line-clamp-2">
                      {set.description}
                    </p>
                  )}

                  {/* Sample Pairs Preview */}
                  <div className="bg-base-200 rounded-lg p-3 mb-4">
                    <p className="text-xs text-base-content/60 mb-2 font-bold">
                      Beispiel-Paare:
                    </p>
                    <div className="space-y-1">
                      {set.pairs.slice(0, 2).map((pair, index) => (
                        <div key={index} className="text-xs flex items-center">
                          <span className="text-primary font-medium">
                            {pair.question}
                          </span>
                          <span className="mx-2 text-base-content/50">→</span>
                          <span className="text-secondary">{pair.answer}</span>
                        </div>
                      ))}
                      {set.pairs.length > 2 && (
                        <div className="text-xs text-base-content/50">
                          ... und {set.pairs.length - 2} weitere
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="text-xs text-base-content/50 mb-4">
                    <div>Erstellt: {set.createdAt}</div>
                    {set.lastPlayed && (
                      <div>Zuletzt gespielt: {set.lastPlayed}</div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="card-actions justify-end gap-2">
                    <button
                      onClick={() => setDeleteModal(set.id)}
                      className="btn btn-ghost btn-sm text-error"
                    >
                      Löschen
                    </button>
                    <button
                      onClick={() => navigate(`/editor/${set.id}`)}
                      className="btn btn-outline btn-sm"
                    >
                      Bearbeiten
                    </button>
                    <button
                      onClick={() => handlePlaySet(set)}
                      className="btn btn-primary btn-sm"
                      disabled={set.pairs.length < 3}
                    >
                      Spielen
                    </button>
                  </div>

                  {/* Warning für wenig Paare */}
                  {set.pairs.length < 3 && (
                    <div className="alert alert-warning mt-2">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      <span className="text-xs">
                        Mindestens 3 Paare für Memory nötig
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back to Game Button */}
        {sets.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={() => navigate("/game")}
              className="btn btn-outline"
            >
              Zurück zum Spiel
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Set löschen?</h3>
            <p className="mb-4">
              Möchtest du das Set "
              {sets.find((s) => s.id === deleteModal)?.name}" wirklich löschen?
              Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
            <div className="modal-action">
              <button
                onClick={() => setDeleteModal(null)}
                className="btn btn-ghost"
              >
                Abbrechen
              </button>
              <button
                onClick={() => handleDeleteSet(deleteModal)}
                className="btn btn-error"
              >
                Löschen
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => setDeleteModal(null)}
          ></div>
        </div>
      )}
    </div>
  );
}

export default LibraryPage;
