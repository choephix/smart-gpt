import * as React from 'react';
import { useState, useEffect, Fragment } from 'react';
import { SmartTaskCard } from './SmartTaskCard';
import { researchAndAnswerQuestion } from '../lib/researchAndAnswerQuestion';
import { useSmartGPT } from '../lib/useSmartGPT';

interface ConversationBeat {
  question: string;
  answers: string[];
}

const savedHistory = localStorage.getItem('history');
const savedHistory2 = localStorage.getItem('history2');

export default function App() {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<ConversationBeat[]>(
    JSON.parse(savedHistory) ?? []
  );

  const smartGPT = useSmartGPT();
  const [history2, setHistory2] = useState(
    (JSON.parse(savedHistory2) ?? []) as ReturnType<
      typeof smartGPT.askQuestion
    >[]
  );

  useEffect(() => {
    localStorage.setItem('history', JSON.stringify(history));
    localStorage.setItem('history2', JSON.stringify(history2));
  }, [history, history2]);

  const askQuestion = async () => {
    setIsLoading(true);
    const answers = await researchAndAnswerQuestion(question);
    setHistory((prevHistory) => [{ question, answers }, ...prevHistory]);
    setIsLoading(false);
    setQuestion(''); // Reset the question input field
  };

  const testSmartGPT = (question: string) => {
    const store = smartGPT.askQuestion(question, (updates) => {
      Object.assign(store, updates);
      setHistory2((v) => [...v]);
    });
    setHistory2((v) => [store, ...v]);
  };

  return (
    <div className="App">
      <div className="Page">
        <hr />

        <textarea
          className="with-border"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question..."
          disabled={isLoading}
        />

        <button
          className="with-border"
          onClick={() => testSmartGPT(question)}
          disabled={isLoading}
        >
          Ask SmartGPT
        </button>
        <hr />
        <button
          className="with-border"
          onClick={askQuestion}
          disabled={isLoading}
        >
          Ask daVinci
        </button>

        {history2.map((task, i) => (
          <SmartTaskCard key={i} task={task} />
        ))}

        {isLoading && <progress id="working" />}
        {history.map((beat, i) => (
          <div key={i} className="beat with-border">
            <div className="question">{beat.question}</div>
            {beat.answers.map((answer, j) => (
              <Fragment key={j}>
                <hr />
                <div className="answer">{answer}</div>
              </Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
