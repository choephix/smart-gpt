import { useState, useEffect } from 'react';

const useOpenAIKey = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);

  const saveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('OPENAI_API_KEY', key);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let key = params.get('k');
    if (!key) {
      key = localStorage.getItem('OPENAI_API_KEY');
    }
    setApiKey(key);
  }, []);

  return { apiKey, saveApiKey };
};

export default useOpenAIKey;
