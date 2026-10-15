import { useState } from 'react';
import { CATEGORIES } from '../api/coach.js';

const MIN = 10;
const MAX = 140;

export default function CoachForm({ onGenerate }) {
  const [goal, setGoal] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].value);
  const valid = goal.trim().length >= MIN;

  function handleSubmit(event) {
    event.preventDefault();
    onGenerate({ goal: goal.trim(), category });
  }

  return (
    <form className="coach-form" onSubmit={handleSubmit}>
      <label>
        Objectif
        <input value={goal} maxLength={MAX} onChange={(event) => setGoal(event.target.value)} />
      </label>
      <p className="counter">{MAX - goal.length} caractères restants</p>
      <label>
        Catégorie
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </label>
      <button type="submit" disabled={!valid}>
        Générer
      </button>
    </form>
  );
}
