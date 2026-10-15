export const title = 'Annuler la requête périmée';
export const steps = ['signal', 'annuler'];
export const duration = '25 min';
export const summary = `Une réponse périmée est ignorée, mais sa requête court jusqu'au bout : une vraie API travaille pour rien.
Un AbortController l'arrête vraiment ; l'API annulée rompt sa promesse avec une AbortError.`;
export const objectives = [
  "faire accepter un signal d'annulation à une fonction asynchrone",
  "annuler une requête dans le nettoyage d'un effet (AbortController)",
  'ne pas présenter une annulation comme une erreur'
];
