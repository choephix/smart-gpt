import { SmartGPT } from './SmartGPT';

const gpt3 = 'gpt-3.5-turbo';
const gpt4 = 'gpt-4';
const rate_of_3 = 0.002 / 1000;
const rate_of_4 = 0.06 / 1000;

function createTaskStore(question: string) {
  return {
    question,
    outputs_count: 3,
    ongoing: true,
    phase: 0,
    statusMessage: 'Initializing...',
    initial_responses: [] as string[],
    initial_prompt: '',
    researcher_responses: [] as { role: string; content: string }[],
    final_response: '',
    perfect_result: '',
    error: null as string | null,
  };
}
export type TaskStore = ReturnType<typeof createTaskStore>;

async function findThePerfectResult(smartGPT: SmartGPT, store: TaskStore) {
  store.statusMessage = 'Generating initial answers';

  store.phase = 1;

  [store.initial_responses, store.initial_prompt] =
    await smartGPT.getInitialResponses(
      store.question,
      store.outputs_count,
      (response) => store.initial_responses = [...store.initial_responses, response]
    );

  store.phase = 2;

  const answers = smartGPT.concatenateResponses(store.initial_responses);

  store.statusMessage = `Researching answers: 2/4 complete`;
  store.researcher_responses = await smartGPT.getResearcherResponses(
    answers,
    store.initial_prompt,
    store.outputs_count
  );

  store.phase = 3;

  store.statusMessage = `Resolving answers: 3/4 complete`;
  store.final_response = await smartGPT.getResolverResponse(
    store.researcher_responses,
    store.outputs_count
  );
  store.perfect_result = await smartGPT.getImprovedResponse(store.final_response);

  store.phase = 4;

  // update tokens and calculate total cost
  const total_calc =
    smartGPT.tokenCounts[gpt3] * rate_of_3 +
    smartGPT.tokenCounts[gpt4] * rate_of_4;
  const total_cost = `$${total_calc.toFixed(2)}`;

  console.log(`You used ${smartGPT.tokenCounts[gpt3]} gpt3.5 tokens`);
  console.log(`You used ${smartGPT.tokenCounts[gpt4]} gpt4 tokens`);

  store.statusMessage = `🎈 Ready! This query cost you ${total_cost}`;
  store.ongoing = false;
}

export function useSmartGPT(apiKey: string) {
  return {
    askQuestion(
      userQuestionInput: string,
      numberOfAnswersToProcess: number,
      updateData: (updates: Partial<TaskStore>) => unknown,
      existingStore?: TaskStore
    ) {
      const smartGPT = new SmartGPT(apiKey);

      const _store = existingStore ?? createTaskStore(userQuestionInput);
      _store.outputs_count = numberOfAnswersToProcess;

      async function main() {
        const store = new Proxy(_store, {
          set(target, property, value) {
            target[property] = value;
            updateData(target);
            return true;
          },
        });

        try {
          await findThePerfectResult(smartGPT, store);
        } catch (error) {
          store.error = error.message;
        }
      }

      setTimeout(main, 250);

      return _store;
    },
  };
}
