import * as React from 'react';
import { useState, useEffect } from 'react';
import useOpenAIKey from '../lib/useApiKey';

export default function KeyLessGate() {
  const { apiKey, saveApiKey } = useOpenAIKey();

  const [key, setKey] = useState(apiKey || '');

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
          onClick={() => saveApiKey(key)}
        >
          Save
        </button>
        <hr />
      </div>
    </div>
  );
}
