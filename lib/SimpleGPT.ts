import { Configuration, OpenAIApi } from 'openai';
import { TextCompletionResponse } from './TextCompletionResponse';

export class SimpleGPT {
  private readonly openai: OpenAIApi;

  constructor(apiKey: string) {
    const configuration = new Configuration({ apiKey });
    this.openai = new OpenAIApi(configuration);
  }

  async researchAndAnswerQuestion(question: string) {
    type CompletionResult = { data: TextCompletionResponse };
    const completion: CompletionResult = await this.openai.createCompletion({
      model: 'text-davinci-003',
      prompt: question,
      max_tokens: 2048,
      n: 3,
    });
    const answers = completion.data.choices.map((choice) => choice.text);
    return answers;
  }
}
