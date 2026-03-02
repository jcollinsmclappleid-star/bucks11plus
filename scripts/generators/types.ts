export interface GeneratedQuestion {
  section: string;
  type: string;
  prompt: string;
  options: string[];
  correctAnswer: string;
  difficulty: string;
  skillId: string;
  subRuleId: string;
  renderType: 'text' | 'svg' | 'chart';
  renderConfig: any;
  trapTypes: string[];
  cognitiveLoad: number;
  estTimeSeconds: number;
  explanation: string;
  qaStatus: string;
  locale: string;
  britishSpelling: boolean;
  version: number;
}
