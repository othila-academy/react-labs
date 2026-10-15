import Header from './components/Header.jsx';
import CoachForm from './components/CoachForm.jsx';
import SuggestionsList from './components/SuggestionsList.jsx';
import { generateSuggestions } from './api/coach.js';

const examples = generateSuggestions({ goal: 'mieux dormir', category: 'bien-etre' });

export default function App() {
  return (
    <main className="app">
      <Header />
      <CoachForm onGenerate={(request) => console.log('demande', request)} />
      <SuggestionsList suggestions={examples} />
    </main>
  );
}
