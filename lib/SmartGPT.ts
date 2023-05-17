/**
 * Ported from python from https://github.com/JarodMica/SmartGPT
 * 
 * Originally proposed by AI Explained here https://www.youtube.com/watch?v=wVzuvf9D9BU&t=0s
 */

import { Configuration, OpenAIApi } from 'openai';
import { OPENAI_API_KEY } from './OPENAI_API_KEY';

const configuration = new Configuration({ apiKey: OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

const gpt3 = 'gpt-3.5-turbo';
const gpt4 = 'gpt-4';

export class SmartGPT {
  readonly token_counts = {} as Record<string, number>;

  temperature = 0.5;

  async generation(
    gpt_model: string,
    messages: any[]
  ) {
    console.log(`🍀 Asking ${gpt_model.toUpperCase()} at t° ${this.temperature}`, messages);

    const { data: completion } = await openai.createChatCompletion({
      model: gpt_model,
      messages: messages,
      temperature: this.temperature,
    });
    const response = completion.choices[0].message.content;
    const tokens = completion.usage.total_tokens;

    // update global token counts
    if (isNaN(this.token_counts[gpt_model])) {
      this.token_counts[gpt_model] = 0;
    }
    this.token_counts[gpt_model] += tokens;

    return [response, tokens] as const;
  }

  concat_output(responses: string[]): string {
    let answer_prompt = '';
    for (let i = 0; i < responses.length; i++) {
      answer_prompt += `Answer Option ${i + 1}: ${responses[i]}\n\n`;
    }
    return answer_prompt;
  }

  async initial_output(
    user_input: string,
    outputs: number
  ) {
    const responses: string[] = [];
    const initial_prompt = `Question. ${user_input}\nAnswer: Let's work this out in a step by step way to be sure we have the right answer: `;
    for (let i = 0; i < outputs; i++) {
      const messages = [{ role: 'user', content: initial_prompt }];
      const [response, tokens] = await this.generation(gpt3, messages);
      responses.push(response);
    }

    return [responses, initial_prompt] as const;
  }

  async researcher(
    answers: string,
    initial_prompt: string,
    outputs: number
  ) {
    const prompt = `You are a researcher tasked with investigating the ${outputs} response options provided. List the flaws and faulty logic of each answer option. Let's work this out in a step by step way to be sure we have all the errors:`;

    const messages = [
      { role: 'user', content: initial_prompt },
      { role: 'assistant', content: answers },
      { role: 'user', content: prompt },
    ];
    const [response, tokens] = await this.generation(gpt3, messages);
    messages.push({ role: 'assistant', content: response });

    return messages;
  }

  async resolver(
    messages: { role: string; content: string }[],
    outputs: number
  ) {
    const prompt = `The previous responses are from the researcher. You are a resolver tasked with 1) finding which of the ${outputs} answer options the researcher thought was best 2) improving that answer, and 3) Printing the improved answer in full. Let's work this out in a step by step way to be sure we have the right answer:`;

    messages.push({ role: 'user', content: prompt });

    const [response, tokens] = await this.generation(gpt4, messages);

    console.log(`Resolved Response:\n${response}`);

    return response;
  }

  async final_output(final_response: string) {
    const prompt = `Based on the following response, extract out only the improved response and nothing else.  DO NOT include typical responses and the answer should only have the improved response: \n\n${final_response}`;

    const messages = [{ role: 'user', content: prompt }];
    const [response, tokens] = await this.generation(gpt3, messages);

    console.log(`SmartGPT response: ${response}`);

    return response;
  }
}