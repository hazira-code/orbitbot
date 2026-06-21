export interface Rule {
  id: string;
  trigger: string;
  response: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'bot' | 'system';
  text: string;
  timestamp: string;
  type?: 'rule' | 'ai' | 'simulated_ai' | 'fallback';
  matched?: boolean;
  cleanInput?: string;
  triggerUsed?: string;
  executionTimeMs?: number;
  isExit?: boolean;
}

export interface PipelineStep {
  name: string;
  value: string;
  status: 'pending' | 'success' | 'info' | 'error';
  description: string;
}
