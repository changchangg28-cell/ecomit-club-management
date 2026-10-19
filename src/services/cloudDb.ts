import { ClubEvent, Member, Task } from '../types';

const CONFIG_KEY = 'ecomit_cloud_config_v1';

export interface CloudConfig {
  mode: 'local' | 'supabase' | 'firebase';
  supabaseUrl: string;
  supabaseAnonKey: string;
  firebaseDatabaseUrl: string;
}

const DEFAULT_CONFIG: CloudConfig = {
  mode: 'local',
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  firebaseDatabaseUrl: import.meta.env.VITE_FIREBASE_DB_URL || '',
};

export function getCloudConfig(): CloudConfig {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (raw) {
      return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
    }
  } catch {
    // ignore
  }
  if (DEFAULT_CONFIG.supabaseUrl && DEFAULT_CONFIG.supabaseAnonKey) {
    return { ...DEFAULT_CONFIG, mode: 'supabase' };
  }
  if (DEFAULT_CONFIG.firebaseDatabaseUrl) {
    return { ...DEFAULT_CONFIG, mode: 'firebase' };
  }
  return DEFAULT_CONFIG;
}

export function saveCloudConfig(cfg: CloudConfig): void {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg));
}

export async function pullFromCloud(
  cfg: CloudConfig
): Promise<{ members: Member[]; tasks: Task[]; events?: ClubEvent[] } | null> {
  if (cfg.mode === 'firebase' && cfg.firebaseDatabaseUrl) {
    const baseUrl = cfg.firebaseDatabaseUrl.replace(/\/$/, '');
    const res = await fetch(`${baseUrl}/ecomit_store.json`);
    if (!res.ok) throw new Error(`Firebase HTTP ${res.status}`);
    const data = await res.json();
    if (data && Array.isArray(data.members) && Array.isArray(data.tasks)) {
      return {
        members: data.members,
        tasks: data.tasks,
        events: Array.isArray(data.events) ? data.events : undefined,
      };
    }
    return null;
  }

  if (cfg.mode === 'supabase' && cfg.supabaseUrl && cfg.supabaseAnonKey) {
    const baseUrl = cfg.supabaseUrl.replace(/\/$/, '');
    const headers = {
      apikey: cfg.supabaseAnonKey,
      Authorization: `Bearer ${cfg.supabaseAnonKey}`,
      'Content-Type': 'application/json',
    };
    const res = await fetch(
      `${baseUrl}/rest/v1/ecomit_store?id=eq.main&select=payload`,
      { headers }
    );
    if (!res.ok) throw new Error(`Supabase HTTP ${res.status}`);
    const rows = await res.json();
    if (Array.isArray(rows) && rows.length > 0 && rows[0].payload) {
      const p = rows[0].payload;
      if (Array.isArray(p.members) && Array.isArray(p.tasks)) {
        return {
          members: p.members,
          tasks: p.tasks,
          events: Array.isArray(p.events) ? p.events : undefined,
        };
      }
    }
    return null;
  }

  return null;
}

export async function pushToCloud(
  cfg: CloudConfig,
  payload: { members: Member[]; tasks: Task[]; events: ClubEvent[] }
): Promise<boolean> {
  if (cfg.mode === 'firebase' && cfg.firebaseDatabaseUrl) {
    const baseUrl = cfg.firebaseDatabaseUrl.replace(/\/$/, '');
    const res = await fetch(`${baseUrl}/ecomit_store.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        updatedAt: new Date().toISOString(),
      }),
    });
    if (!res.ok) throw new Error(`Firebase HTTP ${res.status}`);
    return true;
  }

  if (cfg.mode === 'supabase' && cfg.supabaseUrl && cfg.supabaseAnonKey) {
    const baseUrl = cfg.supabaseUrl.replace(/\/$/, '');
    const headers = {
      apikey: cfg.supabaseAnonKey,
      Authorization: `Bearer ${cfg.supabaseAnonKey}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates',
    };
    const res = await fetch(`${baseUrl}/rest/v1/ecomit_store`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        id: 'main',
        payload,
        updated_at: new Date().toISOString(),
      }),
    });
    if (!res.ok) throw new Error(`Supabase HTTP ${res.status}`);
    return true;
  }

  return false;
}
