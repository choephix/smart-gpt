import type { TaskStore } from './useSmartGPT';

export function loadSavedHistory() {
  const savedHistoryJson = localStorage.getItem('history');
  const savedHistory = (JSON.parse(savedHistoryJson) ?? []) as TaskStore[];

  for (const task of savedHistory) {
    if (task.ongoing) {
      task.ongoing = false;
      task.error = `Task was probably interrupted.`;
    }
  }

  function setSavedHistory(newHistory: TaskStore[]) {
    localStorage.setItem('history', JSON.stringify(newHistory));
  }

  return [savedHistory, setSavedHistory] as const;
}
