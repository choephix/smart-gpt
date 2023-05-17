// SmartTaskCard.tsx
import * as React from 'react';
import { TaskStore } from '../lib/useSmartGPT';

export function SmartTaskCard(props: { task: TaskStore }) {
  const { task } = props;

  return (
    <div className="card with-border">
      <div className="card-header">
        <p className="card-question">{task.question}</p>
        <code className="card-text">Status: {task.status}</code>
      </div>

      <hr />

      <div className="card-body pretty-scrollbar">
        <div className="initial-responses">
          <h6 className="card-subtitle mb-2 text-muted">Initial Responses</h6>
          {task.initial_responses.map((response, index) => (
            <div key={index} className="initial-response">
              {response}
            </div>
          ))}
        </div>

        <div className="initial-prompt">
          <h6 className="card-subtitle mb-2 text-muted">Initial Prompt</h6>
          <p className="card-text">{task.initial_prompt}</p>
        </div>

        <div className="researcher-responses">
          <h6 className="card-subtitle mb-2 text-muted">
            Researcher Responses
          </h6>
          {task.researcher_responses.map((response, index) => (
            <div key={index} className="researcher-response">
              <strong>{response.role}:</strong> {response.content}
            </div>
          ))}
        </div>

        <div className="final-response">
          <h6 className="card-subtitle mb-2 text-muted">Final Response</h6>
          <p className="card-text">{task.final_response}</p>
        </div>

        <div className="perfect-result">
          <h6 className="card-subtitle mb-2 text-muted">Perfect Result</h6>
          <p className="card-text">{task.perfect_result}</p>
        </div>
      </div>

      <hr />

      <div className="card-footer">
        {task.ongoing ? <progress id="working" /> : null}
      </div>
    </div>
  );
}
