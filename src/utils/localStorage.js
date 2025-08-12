// LocalStorage Utils für Learning Sets
const STORAGE_KEY = "advanced-memory-sets";
const ACTIVE_SET_KEY = "advanced-memory-active-set";

// Generiere eine einfache ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Alle Sets aus LocalStorage laden
export const loadSets = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Fehler beim Laden der Sets:", error);
    return [];
  }
};

// Alle Sets in LocalStorage speichern
export const saveSets = (sets) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sets));
    return true;
  } catch (error) {
    console.error("Fehler beim Speichern der Sets:", error);
    return false;
  }
};

// Neues Set erstellen
export const createSet = (name, description, pairs = []) => {
  const newSet = {
    id: generateId(),
    name: name.trim(),
    description: description.trim(),
    pairs: pairs,
    createdAt: new Date().toISOString().split("T")[0], // YYYY-MM-DD
    lastPlayed: null,
  };

  const sets = loadSets();
  sets.push(newSet);
  saveSets(sets);

  return newSet;
};

// Set aktualisieren
export const updateSet = (setId, updates) => {
  const sets = loadSets();
  const index = sets.findIndex((set) => set.id === setId);

  if (index === -1) {
    console.error("Set nicht gefunden:", setId);
    return null;
  }

  sets[index] = { ...sets[index], ...updates };
  saveSets(sets);

  return sets[index];
};

// Set löschen
export const deleteSet = (setId) => {
  const sets = loadSets();
  const filteredSets = sets.filter((set) => set.id !== setId);
  saveSets(filteredSets);

  return filteredSets.length < sets.length; // true wenn gelöscht
};

// Einzelnes Set finden
export const getSetById = (setId) => {
  const sets = loadSets();
  return sets.find((set) => set.id === setId) || null;
};

// Set als "gespielt" markieren
export const markSetAsPlayed = (setId) => {
  return updateSet(setId, {
    lastPlayed: new Date().toISOString().split("T")[0],
  });
};

// Paar zu Set hinzufügen
export const addPairToSet = (setId, question, answer) => {
  const set = getSetById(setId);
  if (!set) return null;

  const newPair = {
    question: question.trim(),
    answer: answer.trim(),
  };

  const updatedPairs = [...set.pairs, newPair];
  return updateSet(setId, { pairs: updatedPairs });
};

// Paar aus Set entfernen
export const removePairFromSet = (setId, pairIndex) => {
  const set = getSetById(setId);
  if (!set) return null;

  const updatedPairs = set.pairs.filter((_, index) => index !== pairIndex);
  return updateSet(setId, { pairs: updatedPairs });
};

// Demo-Set erstellen (für Testing)
export const createDemoSet = () => {
  const demoSet = createSet(
    "Demo Englisch Vokabeln",
    "Grundwortschatz zum Testen",
    [
      { question: "Hello", answer: "Hallo" },
      { question: "Cat", answer: "Katze" },
      { question: "Dog", answer: "Hund" },
    ]
  );
  return demoSet;
};

// Alle Sets zurücksetzen (für Development)
export const resetAllSets = () => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(ACTIVE_SET_KEY);
  return true;
};

// Aktives Set setzen
export const setActiveSet = (setId) => {
  try {
    localStorage.setItem(ACTIVE_SET_KEY, setId);
    return true;
  } catch (error) {
    console.error("Fehler beim Setzen des aktiven Sets:", error);
    return false;
  }
};

// Aktives Set laden
export const getActiveSet = () => {
  try {
    const activeSetId = localStorage.getItem(ACTIVE_SET_KEY);
    if (!activeSetId) return null;

    return getSetById(activeSetId);
  } catch (error) {
    console.error("Fehler beim Laden des aktiven Sets:", error);
    return null;
  }
};

// Aktives Set löschen
export const clearActiveSet = () => {
  try {
    localStorage.removeItem(ACTIVE_SET_KEY);
    return true;
  } catch (error) {
    console.error("Fehler beim Löschen des aktiven Sets:", error);
    return false;
  }
};
