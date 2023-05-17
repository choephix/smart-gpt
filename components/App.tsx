import * as React from 'react';

import useOpenAIKey from '../lib/useApiKey';
import Chat from './Chat';
import KeyLessGate from './KeyLessGate';

export default function App() {
  const { apiKey } = useOpenAIKey();
  return apiKey ? <Chat /> : <KeyLessGate />;
}
