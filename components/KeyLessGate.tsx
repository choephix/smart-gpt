import * as React from 'react';
import { useState } from 'react';
import useOpenAIKey from '../lib/useApiKey';

interface Props {
  saveApiKey: (key: string) => void;
}

export default function KeyLessGate({ saveApiKey }: Props) {
  const { apiKey } = useOpenAIKey();

  const [key, setKey] = useState(apiKey || '');

  const handleSaveClick = () => {
    saveApiKey(key);
  };

  return (
    <div className="App pretty-scrollbar">
      <div className="Page">
        <textarea
          className="with-border"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Enter your OpenAI API key here to get started..."
        />

        <button
          className="with-border"
          onClick={handleSaveClick}
        >
          Save to browser storage
        </button>
        <hr />
      </div>
    </div>
  );
}