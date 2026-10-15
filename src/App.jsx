import { useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import CoachForm from './components/CoachForm.jsx';
import SuggestionsList from './components/SuggestionsList.jsx';
import SavedList from './components/SavedList.jsx';
import { fetchSuggestions } from './api/coach.js';
import { useFavorites } from './context/FavoritesContext.jsx';

export default function App() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [request, setRequest] = useState(null);
  const { saved, remove, clear } = useFavorites();

  useEffect(() => {
    if (!request) return;
    const controller = new AbortController();
    let active = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const next = await fetchSuggestions(request, { signal: controller.signal });
        if (active) setSuggestions(next);
      } catch (failure) {
        if (active) setError(failure.message);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
      controller.abort();
    };
  }, [request]);

  function changeCategory(category) {
    setRequest((current) => (current ? { ...current, category } : current));
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
      <SuggestionsList suggestions={suggestions} />
      <SavedList saved={saved} onRemove={remove} onClear={clear} />
    </main>
  );
}
