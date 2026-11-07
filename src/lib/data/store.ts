import fs from "fs";
import path from "path";
import { Incident, PostMortem } from "../types/incident";
import { RecallResult } from "../hindsight/types";
import { INITIAL_INCIDENTS } from "./initial-incidents";
import { INITIAL_MEMORIES } from "./initial-memories";

interface PagerLoreState {
  incidents: Incident[];
  memories: RecallResult[];
  lastResetAt: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __pagerlore_state: PagerLoreState | undefined;
}

const STORAGE_DIR = path.join(process.cwd(), "data");
const STORAGE_FILE = path.join(STORAGE_DIR, "pagerlore-storage.json");

function ensureDirectoryExists(dirPath: string) {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  } catch (err) {
    console.warn("[DataStore] Could not create storage directory:", err);
  }
}

function loadStateFromDisk(): PagerLoreState | null {
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const raw = fs.readFileSync(STORAGE_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.incidents) && Array.isArray(parsed.memories)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("[DataStore] Failed reading persistent state from disk, using seed:", err);
  }
  return null;
}

function saveStateToDisk(state: PagerLoreState) {
  try {
    ensureDirectoryExists(STORAGE_DIR);
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(state, null, 2), "utf-8");
  } catch (err) {
    console.warn("[DataStore] Failed saving persistent state to disk:", err);
  }
}

function getState(): PagerLoreState {
  if (!global.__pagerlore_state) {
    const fromDisk = loadStateFromDisk();
    if (fromDisk) {
      global.__pagerlore_state = fromDisk;
    } else {
      global.__pagerlore_state = {
        incidents: JSON.parse(JSON.stringify(INITIAL_INCIDENTS)),
        memories: JSON.parse(JSON.stringify(INITIAL_MEMORIES)),
        lastResetAt: new Date().toISOString(),
      };
      saveStateToDisk(global.__pagerlore_state);
    }
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
    saveStateToDisk(state);
    return incident;
  },

  updateIncident(id: string, updates: Partial<Incident>): Incident | null {
    const state = getState();
    const index = state.incidents.findIndex((inc) => inc.id === id);
    if (index === -1) return null;
    state.incidents[index] = { ...state.incidents[index], ...updates };
    saveStateToDisk(state);
    return state.incidents[index];
  },

  deleteIncident(id: string): boolean {
    const state = getState();
    const initLen = state.incidents.length;
    state.incidents = state.incidents.filter((inc) => inc.id !== id);
    if (state.incidents.length < initLen) {
      saveStateToDisk(state);
      return true;
    }
    return false;
  },

  savePostMortem(incidentId: string, postmortem: PostMortem): Incident | null {
    const state = getState();
    const inc = state.incidents.find((i) => i.id === incidentId);
    if (!inc) return null;
    inc.postmortem = postmortem;
    inc.status = "resolved";
    inc.resolved_at = postmortem.submitted_at || new Date().toISOString();
    saveStateToDisk(state);
    return inc;
  },

  getMemories(): RecallResult[] {
    return getState().memories;
  },

  addMemory(memory: RecallResult): RecallResult {
    const state = getState();
    // Prevent duplicate memories with the exact same ID or identical content
    const existingIndex = state.memories.findIndex(
      (m) => m.id === memory.id || (m.text === memory.text && m.source_incident_id === memory.source_incident_id)
    );
    if (existingIndex >= 0) {
      state.memories[existingIndex] = { ...state.memories[existingIndex], ...memory };
    } else {
      state.memories.unshift(memory);
    }
    saveStateToDisk(state);
    return memory;
  },

  resetDemo(options?: { preserveRetainedMemories?: boolean }): {
    incidentsCount: number;
    memoriesCount: number;
    retainedPreservedCount: number;
    resetAt: string;
  } {
    const preserve = options?.preserveRetainedMemories ?? true;
    const currentState = getState();

    // If preserve is true, retain all memories (seed + newly learned memories)
    const initialSeedIds = new Set(INITIAL_MEMORIES.map((m) => m.id));
    const newlyLearned = currentState.memories.filter((m) => !initialSeedIds.has(m.id));

    const keptMemories = preserve
      ? [...newlyLearned, ...JSON.parse(JSON.stringify(INITIAL_MEMORIES))]
      : JSON.parse(JSON.stringify(INITIAL_MEMORIES));

    global.__pagerlore_state = {
      incidents: JSON.parse(JSON.stringify(INITIAL_INCIDENTS)),
      memories: keptMemories,
      lastResetAt: new Date().toISOString(),
    };

    saveStateToDisk(global.__pagerlore_state);

    return {
      incidentsCount: global.__pagerlore_state.incidents.length,
      memoriesCount: global.__pagerlore_state.memories.length,
      retainedPreservedCount: newlyLearned.length,
      resetAt: global.__pagerlore_state.lastResetAt,
    };
  },
};
