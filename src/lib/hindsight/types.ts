export type MemoryType = "world" | "experience" | "observation";

export interface HindsightRetainRequest {
  bankId?: string;
  content: string;
  retain_mission?: string;
  retain_extraction_mode?: "concise" | "verbose" | "verbatim" | "chunks";
  document_id?: string;
  metadata?: {
    incidentId?: string;
    service?: string;
    severity?: string;
    author?: string;
    tags?: string[];
    [key: string]: any;
  };
}

export interface HindsightRetainResponse {
  success: boolean;
  memory_id: string;
  bank_id: string;
  facts_extracted_count: number;
  status: "retained" | "indexed";
  timestamp: string;
  is_demo_mode: boolean;
  extracted_facts?: Array<{
    id: string;
    text: string;
    type: MemoryType;
  }>;
}

export interface RecallResult {
  id: string;
  text: string;
  type: MemoryType;
  entities: string[];
  score: number; // 0.0 - 1.0 relevance
  occurred_start?: string;
  occurred_end?: string;
  source_incident_id?: string;
  service?: string;
  resolution_action?: string;
  preventive_action?: string;
  metadata?: Record<string, any>;
}

export interface HindsightRecallRequest {
  bankId?: string;
  query: string;
  top_k?: number;
  budget?: "low" | "mid" | "high";
  types?: MemoryType[];
  serviceFilter?: string;
}

export interface HindsightRecallResponse {
  query: string;
  bank_id: string;
  strategy: "rrf-hybrid-multi-path";
  results: RecallResult[];
  total_recalled: number;
  is_demo_mode: boolean;
  retrieval_strategies_run: {
    semantic_similarity: boolean;
    bm25_keyword: boolean;
    graph_traversal: boolean;
    temporal_proximity: boolean;
  };
  duration_ms: number;
}

export interface HindsightReflectRequest {
  bankId?: string;
  query: string;
  budget?: "low" | "mid" | "high";
}

export interface HindsightReflectResponse {
  bank_id: string;
  query: string;
  synthesis: string;
  grounded_facts: string[];
  suggested_preventions: string[];
  confidence: number;
  is_demo_mode: boolean;
  timestamp: string;
}

export interface HindsightBankStatus {
  connected: boolean;
  bank_id: string;
  is_demo_mode: boolean;
  api_url: string;
  retained_count: number;
  last_activity?: string;
  health: "healthy" | "degraded" | "disconnected" | "demo_active";
  message: string;
}

