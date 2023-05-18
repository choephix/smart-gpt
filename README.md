# Smart-GPT implementation for the browser

[⚡️ Edit on StackBlitz](https://stackblitz.com/edit/smart-gpt)

---

🌟 The majority of the business logic is ported over from ***https://github.com/JarodMica/SmartGPT*** 
 
---
 
💛 An approach to getting quality answers from GPT3+4, as proposed by **AI Explained** here ***https://www.youtube.com/watch?v=wVzuvf9D9BU&t=0s***.
 
---

## Installation

Currently, the easiest way to run this app is through [Stackblitz](https://stackblitz.com).

You might need to make changes in order to run it locally. The project uses `react-scripts`, which seems to have specific requirements for the HTML and entry point file paths.. So far I have not managed to configure it in a way that will work both locally and on there.

## Usage

**SmartGPT** is an approach to text prompting, designed to improve upon the existing capabilities of GPT-4, by focusing on areas where GPT-4 struggles, in order to deliver superior results. The key aspects of SmartGPT include the use of chain of thought prompting, reflection, and self-error detection to refine and improve upon GPT-4's outputs. 

This is a web application meant to test out and demonstrate this approach. It was built with React + Typescript on Stackblitz (thus the relatively unorthodox file structure).

1. Enter your OpenAI API key. You only need to do this once, it will be saved in `localStorage`. Alternatively, you can add it directly to the browser's address bar (e.g. `https://smart-gpt.stackblitz.io/?k=sk-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`) and skip this step entirely. 

2. Enter your question and click "Ask". Watch the research and improvement process as it progresses toward the final answer.

## How it works

The application's strategy is to tackle the query in a phased manner: beginning with the generation of a set of preliminary answers, followed by a meticulous critique of each response by a simulated "researcher", and culminating in the selection and enhancement of the best answer by a "resolver". Here's the step-by-step:

* Generate initial responses to the question using the OpenAI's API and stores them in a list.
* Concatenate the initial responses into a single string, format it with answer labels, and then prompt the 'researcher' to analyze the flaws and faulty logic of each initial response.
* Prompt the 'resolver' to identify the best initial response and enhance it.
* Extract and output the final best answer to the question.
* Calculate the total cost of the OpenAI API usage and display it.
