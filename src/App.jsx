import Header from './components/Header.jsx';
import SuggestionCard from './components/SuggestionCard.jsx';
import { generateSuggestions } from './api/coach.js';

const example = generateSuggestions({ goal: 'mieux dormir', category: 'bien-etre' })[0];

export default function App() {
  return (
    <main className="app">
      <Header />
      <SuggestionCard suggestion={example} />
    </main>
  );
}
