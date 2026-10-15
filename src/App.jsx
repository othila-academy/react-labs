import Header from './components/Header.jsx';
import SuggestionsList from './components/SuggestionsList.jsx';
import { generateSuggestions } from './api/coach.js';

const examples = generateSuggestions({ goal: 'mieux dormir', category: 'bien-etre' });

export default function App() {
  return (
    <main className="app">
      <Header />
      <SuggestionsList suggestions={examples} />
    </main>
  );
}
