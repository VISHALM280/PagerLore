import { Incident, PostMortem } from "../types/incident";
import { RecallResult } from "../hindsight/types";
import { INITIAL_INCIDENTS } from "./initial-incidents";
import { INITIAL_MEMORIES } from "./initial-memories";

// Global in-memory singleton to persist updates across serverless API calls during runtime
interface PagerLoreState {
  incidents: Incident[];
  memories: RecallResult[];
  lastResetAt: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __pagerlore_state: PagerLoreState | undefined;
}

function getState(): PagerLoreState {
  if (!global.__pagerlore_state) {
    global.__pagerlore_state = {
      incidents: JSON.parse(JSON.stringify(INITIAL_INCIDENTS)),
      memories: JSON.parse(JSON.stringify(INITIAL_MEMORIES)),
      lastResetAt: new Date().toISOString(),
    };
  }
  return global.__pagerlore_state;
}

export const DataStore = {
  getIncidents(): Incident[] {
    return getState().incidents;
  },

  getIncidentById(id: string): Incident | undefined {
    return getState().incidents.find((inc) => inc.id === id);
  },

  createIncident(incident: Incident): Incident {
    const state = getState();
    state.incidents.unshift(incident);
    return incident;
  },

  updateIncident(id: string, updates: Partial<Incident>): Incident | null {
    const state = getState();
    const index = state.incidents.findIndex((inc) => inc.id === id);
    if (index === -1) return null;
    state.incidents[index] = { ...state.incidents[index], ...updates };
    return state.incidents[index];
  },

  deleteIncident(id: string): boolean {
    const state = getState();
    const initLen = state.incidents.length;
    state.incidents = state.incidents.filter((inc) => inc.id !== id);
    return state.incidents.length < initLen;
  },

  savePostMortem(incidentId: string, postmortem: PostMortem): Incident | null {
    const state = getState();
    const inc = state.incidents.find((i) => i.id === incidentId);
    if (!inc) return null;
    inc.postmortem = postmortem;
    inc.status = "resolved";
    inc.resolved_at = postmortem.submitted_at || new Date().toISOString();
    return inc;
  },

  getMemories(): RecallResult[] {
    return getState().memories;
  },

  addMemory(memory: RecallResult): RecallResult {
    const state = getState();
    state.memories.unshift(memory);
    return memory;
  },

  resetDemo(): { incidentsCount: number; memoriesCount: number; resetAt: string } {
    global.__pagerlore_state = {
      incidents: JSON.parse(JSON.stringify(INITIAL_INCIDENTS)),
      memories: JSON.parse(JSON.stringify(INITIAL_MEMORIES)),
      lastResetAt: new Date().toISOString(),
    };
    return {
      incidentsCount: global.__pagerlore_state.incidents.length,
      memoriesCount: global.__pagerlore_state.memories.length,
      resetAt: global.__pagerlore_state.lastResetAt,
    };
  },
};
