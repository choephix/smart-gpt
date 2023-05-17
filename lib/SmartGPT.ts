/**
 * Ported from python from https://github.com/JarodMica/SmartGPT
 *
 * Originally proposed by AI Explained here https://www.youtube.com/watch?v=wVzuvf9D9BU&t=0s
 */

import { Configuration, OpenAIApi } from 'openai';

const gpt3 = 'gpt-3.5-turbo';
const gpt4 = 'gpt-4';

export class SmartGPT {
  private readonly openai: OpenAIApi;

  readonly tokenCounts = {} as Record<string, number>;

  temperature = 0.5;

  constructor(apiKey: string) {
    const configuration = new Configuration({ apiKey });
    this.openai = new OpenAIApi(configuration);
  }

  private async generateChatCompletion(
    gptModel: string,
    messages: any[],
    n?: number
  ) {
    console.log(
      `🍀 Asking ${gptModel.toUpperCase()} at t° ${this.temperature}`,
      messages
    );

    const { data: completion } = await this.openai.createChatCompletion({
      model: gptModel,
      messages: messages,
      temperature: this.temperature,
      n,
    });
    const response = completion.choices[0].message.content;
    const tokens = completion.usage.total_tokens;

    // update global token counts
    if (isNaN(this.tokenCounts[gptModel])) {
      this.tokenCounts[gptModel] = 0;
    }
    this.tokenCounts[gptModel] += tokens;

    return response;
  }

  concatenateResponses(responses: string[]): string {
    let answerPrompt = '';
    for (let i = 0; i < responses.length; i++) {
      answerPrompt += `Answer Option ${i + 1}: ${responses[i]}\n\n`;
    }
    return answerPrompt;
  }

  async getInitialResponses(
    userInput: string,
    outputs: number,
    onSingleResponseGotten?: (answer: string) => unknown
  ) {
    const responses: string[] = [];
    const initialPrompt = `Question. ${userInput}\nAnswer: Let's work this out in a step by step way to be sure we have the right answer: `;
    for (let i = 0; i < outputs; i++) {
      const messages = [{ role: 'user', content: initialPrompt }];
      const response = await this.generateChatCompletion(gpt3, messages);
      responses.push(response);
      onSingleResponseGotten?.(response);
    }

    return [responses, initialPrompt] as const;
  }

  async getResearcherResponses(
    answers: string,
    initialPrompt: string,
    outputs: number
  ) {
    const prompt = `You are a researcher tasked with investigating the ${outputs} response options provided. List the flaws and faulty logic of each answer option. Let's work this out in a step by step way to be sure we have all the errors:`;

    const messages = [
      { role: 'user', content: initialPrompt },
      { role: 'assistant', content: answers },
      { role: 'user', content: prompt },
    ];
    const response = await this.generateChatCompletion(gpt3, messages);
    messages.push({ role: 'assistant', content: response });

    return messages;
  }

  async getResolverResponse(
    messages: { role: string; content: string }[],
    outputs: number
  ) {
    const prompt = `The previous responses are from the researcher. You are a resolver tasked with 1) finding which of the ${outputs} answer options the researcher thought was best 2) improving that answer, and 3) Printing the improved answer in full. Let's work this out in a step by step way to be sure we have the right answer:`;

    messages.push({ role: 'user', content: prompt });

    const response = await this.generateChatCompletion(gpt4, messages);

    console.log(`Resolved Response:\n${response}`);

    return response;
  }

  async getImprovedResponse(finalResponse: string) {
    const prompt = `Based on the following response, extract out only the improved response and nothing else.  DO NOT include typical responses and the answer should only have the improved response: \n\n${finalResponse}`;

    const messages = [{ role: 'user', content: prompt }];
    const response = await this.generateChatCompletion(gpt3, messages);

    console.log(`SmartGPT response: ${response}`);

    return response;
  }
}
