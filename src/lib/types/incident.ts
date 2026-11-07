export type Severity = "SEV-1" | "SEV-2" | "SEV-3" | "SEV-4";
export type IncidentStatus = "investigating" | "identified" | "monitoring" | "resolved";

export interface LogEntry {
  id: string;
  timestamp: string;
  level: "ERROR" | "WARN" | "INFO" | "FATAL";
  source: string;
  message: string;
  trace_id?: string;
}

export interface DeploymentRecord {
  version: string;
  commit_hash: string;
  author: string;
  timestamp: string;
  description: string;
  diff_highlights?: string[];
}

export interface PostMortem {
  incident_id: string;
  summary: string;
  root_cause: string;
  detection_method: string;
  timeline: Array<{ timestamp: string; note: string }>;
  actions_taken: string[];
  successful_actions: string[];
  failed_attempts: string[];
  final_resolution: string;
  mttr_minutes: number;
  business_impact: string;
  preventive_measures: string[];
  hindsight_memory_id?: string;
  hindsight_retained?: boolean;
  submitted_at: string;
  submitted_by: string;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  status: IncidentStatus;
  affected_service: string;
  environment: "production" | "staging" | "us-east" | "eu-central";
  started_at: string;
  resolved_at?: string;
  duration_minutes: number;
  assigned_engineer: {
    name: string;
    avatar: string;
    email: string;
    role: string;
  };
  metrics: {
    error_rate_pct: number;
    p95_latency_ms: number;
    request_rate_rps: number;
    db_connection_pool_saturation_pct?: number;
    cpu_usage_pct?: number;
    memory_usage_pct?: number;
  };
  logs: LogEntry[];
  recent_deployments: DeploymentRecord[];
  notes?: Array<{
    id: string;
    author: string;
    timestamp: string;
    content: string;
  }>;
  postmortem?: PostMortem;
}

export interface InvestigationHypothesis {
  id: string;
  hypothesis: string;
  confidence_pct: number;
  confidence_label?: "HEURISTIC ESTIMATE" | "EMPIRICALLY GROUNDED" | "LOW CONFIDENCE SPECULATION";
  supporting_evidence: string[];
  contradicting_evidence: string[];
  relevant_historical_incident?: {
    id: string;
    title: string;
    relevance_score: number;
    root_cause_similarity: string;
  };
  diagnostic_next_step: string;
  verification_status?: "verified" | "unverified" | "refuted";
}

export interface RemediationRecommendation {
  id: string;
  title: string;
  action_summary: string;
  why_recommended: string;
  historical_justification: string;
  risk_level: "LOW" | "MEDIUM" | "HIGH";
  expected_outcome: string;
  rollback_procedure?: string;
  command_or_script?: string;
  requires_approval: boolean;
  approved?: boolean;
  approved_by?: string;
  approved_at?: string;
  verification_metrics?: {
    metric: string;
    before: string;
    expected_after: string;
  };
}

export interface InvestigationResult {
  incident_id: string;
  mode: "with_memory" | "without_memory";
  timestamp: string;
  signals_analyzed_count: number;
  facts_extracted?: string[];
  assumptions_identified?: string[];
  retrieval_status?: "strong_match" | "partial_match" | "weak_match" | "no_match" | "conflicting_match";
  hypotheses: InvestigationHypothesis[];
  remediations: RemediationRecommendation[];
  historical_memories_used: Array<{
    id: string;
    text: string;
    source_incident_id?: string;
    score: number;
    entities: string[];
    relevance_tier?: "strong" | "partial" | "weak" | "none";
  }>;
  executive_summary: string;
  investigation_duration_ms: number;
  verification_checklist?: Array<{
    check: string;
    status: "passed" | "pending" | "failed";
    evidence: string;
  }>;
}

