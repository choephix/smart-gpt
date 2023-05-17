import { useState, useEffect } from 'react';

const useOpenAIKey = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);

  const saveApiKey = (key: string) => {
    localStorage.setItem('openaiApiKey', key);
    setApiKey(key);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let key = params.get('k');
    if (!key) {
      key = localStorage.getItem('openaiApiKey');
    }
    setApiKey(key);
  }, []);

  return { apiKey, saveApiKey };
};

export default useOpenAIKey;
