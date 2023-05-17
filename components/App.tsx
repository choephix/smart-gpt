import * as React from 'react';
import { useState, useEffect, Fragment } from 'react';
import { SmartTaskCard } from './SmartTaskCard';
import { useSmartGPT } from '../lib/useSmartGPT';

interface ConversationBeat {
  question: string;
  answers: string[];
}

const savedHistory2 = localStorage.getItem('history2');

export default function App() {
  const [question, setQuestion] = useState('');

  const smartGPT = useSmartGPT();
  const [history, setHistory] = useState(
    (JSON.parse(savedHistory2) ?? []) as ReturnType<
      typeof smartGPT.askQuestion
    >[]
  );

  useEffect(() => {
    localStorage.setItem('history2', JSON.stringify(history));
  }, [history]);

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
        <hr />

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
