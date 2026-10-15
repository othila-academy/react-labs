import { useState } from 'react';
import Header from './components/Header.jsx';
import CoachForm from './components/CoachForm.jsx';
import SuggestionsList from './components/SuggestionsList.jsx';
import { generateSuggestions } from './api/coach.js';

export default function App() {
  const [suggestions, setSuggestions] = useState([]);

  return (
    <main className="app">
      <Header />
      <CoachForm onGenerate={(request) => setSuggestions(generateSuggestions(request))} />
      <SuggestionsList suggestions={suggestions} />
    </main>
  );
}
