export type RiskSeverity = "high" | "medium" | "low";

export interface MandateFit {
  pass: boolean;
  reason: string;
}

export interface RiskFlag {
  flag: string;
  severity: RiskSeverity;
}

export interface DealAnalysis {
  loanSize: string;
  ltv: string;
  sponsor: string;
  sector: string;
  exitStrategy: string;
  term: string;
  mandateFit: MandateFit;
  riskFlags: RiskFlag[];
  confidence: number;
  summary: string;
  patternObservations: string[];
}

export type ActionType = "memo" | "reply" | "skip";

export type EmailSectorTag = "Retail" | "Industrial" | "Resi";

export type EmailStatus = "strong" | "review" | "miss" | "skip";

export interface BrokerEmail {
  id: string;
  from: string;
  company: string;
  subject: string;
  time: string;
  body: string;
  sector: EmailSectorTag;
  status: EmailStatus;
}
