import * as React from 'react';
import { useState, useEffect, Fragment } from 'react';
import { SimpleGPT } from '../lib/researchAndAnswerQuestion';

interface ConversationBeat {
  question: string;
  answers: string[];
}

const savedHistory = localStorage.getItem('history_simple');

const simpleGPT = new SimpleGPT();

export default function App() {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<ConversationBeat[]>(
    JSON.parse(savedHistory) ?? []
  );

  useEffect(() => {
    localStorage.setItem('history_simple', JSON.stringify(history));
  }, [history]);

  const askQuestionTheRegularWay = async () => {
    setIsLoading(true);
    const answers = await simpleGPT.researchAndAnswerQuestion(question);
    setHistory((prevHistory) => [{ question, answers }, ...prevHistory]);
    setIsLoading(false);
    setQuestion(''); // Reset the question input field
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
          disabled={isLoading}
        />

        <button
          className="with-border"
          onClick={askQuestionTheRegularWay}
          disabled={isLoading}
        >
          Ask daVinci
        </button>

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
