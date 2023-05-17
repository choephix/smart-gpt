import { Configuration, OpenAIApi } from 'openai';
import { TextCompletionResponse } from './TextCompletionResponse';
import { OPENAI_API_KEY } from './OPENAI_API_KEY';

const configuration = new Configuration({ apiKey: OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

export class SimpleGPT {
  async researchAndAnswerQuestion(question: string) {
    type CompletionResult = { data: TextCompletionResponse };
    const completion: CompletionResult = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: question,
      max_tokens: 2048,
      n: 3,
    });
    const answers = completion.data.choices.map((choice) => choice.text);
    return answers;
  }
}
