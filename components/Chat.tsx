import * as React from 'react';
import { useState, useEffect } from 'react';
import { SmartTaskCard } from './SmartTaskCard';
import { useSmartGPT } from '../lib/useSmartGPT';
import useOpenAIKey from '../lib/useApiKey';
import { loadSavedHistory } from '../lib/loadSavedHistory';

const [savedHistory, setSavedHistory] = loadSavedHistory();

export default function Chat() {
  const [question, setQuestion] = useState('');

  const [history, setHistory] = useState(savedHistory);

  const { apiKey } = useOpenAIKey();
  const smartGPT = useSmartGPT(apiKey);

  useEffect(() => setSavedHistory(history), [history]);

  const askQuestionWithSmartGPT = (question: string) => {
    const store = smartGPT.askQuestion(question, 3, (updates) => {
      Object.assign(store, updates);
      setHistory((v) => [...v]);
    });
    setHistory((v) => [store, ...v]);
  };

  return (
    <div className="App pretty-scrollbar">
      <div className="Page">
        <textarea
          className="with-border"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question..."
        />

        <button
          className="with-border"
          onClick={() => askQuestionWithSmartGPT(question)}
        >
          Ask SmartGPT
        </button>
        <hr />

        {history.map((task, i) => (
          <SmartTaskCard key={i} task={task} />
        ))}
      </div>
    </div>
  );
}
