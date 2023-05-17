const params = new URLSearchParams(window.location.search);
export const OPENAI_API_KEY = params.get('k');
