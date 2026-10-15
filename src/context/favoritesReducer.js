// favoritesReducer(state, action) : la liste des favoris après une action. Une fonction pure : elle rend un nouveau
// tableau, sans toucher à celui qu'elle reçoit.
export default function favoritesReducer(state, action) {
  switch (action.type) {
    case 'save':
      return state.some((s) => s.id === action.suggestion.id)
        ? state
        : [...state, action.suggestion];
    case 'remove':
      return state.filter((s) => s.id !== action.id);
    case 'clear':
      return [];
    default:
      throw new Error(`Action inconnue : ${action.type}`);
  }
}
