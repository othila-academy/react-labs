import { useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import CoachForm from './components/CoachForm.jsx';
import SuggestionsList from './components/SuggestionsList.jsx';
import SavedList from './components/SavedList.jsx';
import { fetchSuggestions } from './api/coach.js';

const KEY = 'ai-coach:favoris';

// Les favoris gardés par le navigateur ; un contenu illisible repart d'une liste vide.
function readSaved() {
  try {
    const value = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [request, setRequest] = useState(null);
  const [saved, setSaved] = useState(readSaved);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(saved));
  }, [saved]);

  useEffect(() => {
    if (!request) return;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        setSuggestions(await fetchSuggestions(request));
      } catch (failure) {
        setError(failure.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [request]);

  function changeCategory(category) {
    setRequest((current) => (current ? { ...current, category } : current));
  }

  function save(suggestion) {
    setSaved((current) =>
      current.some((s) => s.id === suggestion.id) ? current : [...current, suggestion]
    );
  }

  function remove(id) {
    setSaved((current) => current.filter((s) => s.id !== id));
  }

  return (
    <main className="app">
      <Header />
      <CoachForm onGenerate={setRequest} onCategoryChange={changeCategory} loading={loading} />
      {loading && <p role="status">Le coach réfléchit…</p>}
      {error && (
        <div role="alert">
          <p>{error}</p>
          <button type="button" onClick={() => setRequest({ ...request })}>
            Réessayer
          </button>
        </div>
      )}
      <SuggestionsList suggestions={suggestions} savedIds={saved.map((s) => s.id)} onSave={save} />
      <SavedList saved={saved} onRemove={remove} />
    </main>
  );
}
