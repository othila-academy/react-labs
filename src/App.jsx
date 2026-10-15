import { useState } from 'react';
import Header from './components/Header.jsx';
import CoachForm from './components/CoachForm.jsx';
import SuggestionsList from './components/SuggestionsList.jsx';
import SavedList from './components/SavedList.jsx';
import { generateSuggestions } from './api/coach.js';

export default function App() {
  const [suggestions, setSuggestions] = useState([]);
  const [saved, setSaved] = useState([]);

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
      <CoachForm onGenerate={(request) => setSuggestions(generateSuggestions(request))} />
      <SuggestionsList suggestions={suggestions} savedIds={saved.map((s) => s.id)} onSave={save} />
      <SavedList saved={saved} onRemove={remove} />
    </main>
  );
}
