import { SmartGPT } from './SmartGPT';

const gpt3 = 'gpt-3.5-turbo';
const gpt4 = 'gpt-4';
const rate_of_3 = 0.002 / 1000;
const rate_of_4 = 0.06 / 1000;

function createTaskStore(question: string) {
  return {
    question,
    ongoing: true,
    status: 'Initializing...',
    initial_responses: [] as string[],
    initial_prompt: '',
    researcher_responses: [] as { role: string; content: string }[],
    final_response: '',
    perfect_result: '',
  };
}
export type TaskStore = ReturnType<typeof createTaskStore>;

export function useSmartGPT() {
  return {
    askQuestion(
      user_input: string,
      updateData: (updates: Partial<TaskStore>) => unknown
    ) {
      const outputs = 3;
      const _store = createTaskStore(user_input);

      async function go() {
        const smartGPT = new SmartGPT();
        
        const store = new Proxy(_store, {
          set(target, property, value) {
            target[property] = value;
            updateData(target);
            return true;
          },
        });

        store.status = 'Generating initial answers';

        [store.initial_responses, store.initial_prompt] =
          await smartGPT.initial_output(user_input, outputs);

        const answers = smartGPT.concat_output(store.initial_responses);

        store.status = `Researching answers: 2/4 complete`;
        store.researcher_responses = await smartGPT.researcher(
          answers,
          store.initial_prompt,
          outputs
        );

        store.status = `Resolving answers: 3/4 complete`;
        store.final_response = await smartGPT.resolver(
          store.researcher_responses,
          outputs
        );
        store.perfect_result = await smartGPT.final_output(
          store.final_response
        );

        // update tokens and calculate total cost
        const total_calc =
          smartGPT.token_counts[gpt3] * rate_of_3 +
          smartGPT.token_counts[gpt4] * rate_of_4;
        const total_cost = `$${total_calc.toFixed(2)}`;

        console.log(`You used ${smartGPT.token_counts[gpt3]} gpt3.5 tokens`);
        console.log(`You used ${smartGPT.token_counts[gpt4]} gpt4 tokens`);

        store.status = `🎈 Ready! This query cost you ${total_cost}`;
        store.ongoing = false;
      }

      setTimeout(go, 250);

      return _store;
    },
  };
}

async function fake(store: any) {
  // function updateStore(updates: Partial<TaskStore>) {
  //   Object.assign(_store, updates);
  //   updateData(_store);
  // }

  await delay(1);
  store.status = 'Uno';
  await delay(1);
  store.status = 'Dos';
  await delay(1);
  store.status = 'Tres!';
  return;
}

const delay = (sec: number) =>
  new Promise((done) => setTimeout(done, sec * 1000));
