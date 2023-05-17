// SmartTaskCard.tsx
import * as React from 'react';
import { TaskStore } from '../lib/useSmartGPT';

export function SmartTaskCard(props: { task: TaskStore }) {
  const { task } = props;
  const cardBodyRef = React.useRef<HTMLDivElement>(null);

  return (
    <div className='card with-border'>
      <div className='card-header'>
        <p className='card-question'>{task.question}</p>
        <code className='card-text'>Status: {task.status}</code>
      </div>

      <hr />

      <div className='card-body pretty-scrollbar' ref={cardBodyRef}>
        {task.initial_responses.length > 0 && (
          <div className='initial-responses'>
            <h5 className='card-subtitle mb-2 text-muted'>Initial Responses</h5>
            {task.initial_responses.map((response, index) => (
              <div key={index} className='initial-response subcard'>
                {response}
              </div>
            ))}
          </div>
        )}

        {task.initial_prompt && (
          <div className='initial-prompt'>
            <h5 className='card-subtitle mb-2 text-muted'>Initial Prompt</h5>
            <p className='card-text subcard'>{task.initial_prompt}</p>
          </div>
        )}

        {task.researcher_responses.length > 0 && (
          <div className='researcher-responses'>
            <h5 className='card-subtitle mb-2 text-muted'>Researcher Responses</h5>
            {task.researcher_responses.map((response, index) => (
              <div key={index} className='researcher-response subcard'>
                <strong>{response.role}:</strong> {response.content}
              </div>
            ))}
          </div>
        )}

        {task.final_response && (
          <div className='final-response'>
            <h5 className='card-subtitle mb-2 text-muted'>Final Response</h5>
            <p className='card-text subcard'>{task.final_response}</p>
          </div>
        )}

        {task.perfect_result && (
          <div className='perfect-result'>
            <h5 className='card-subtitle mb-2 text-muted'>Perfect Result</h5>
            <p className='card-text subcard'>{task.perfect_result}</p>
          </div>
        )}
      </div>

      <hr />

      <div className='card-footer'>{task.ongoing ? <progress id='working' /> : null}</div>
    </div>
  );
}