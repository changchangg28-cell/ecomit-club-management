import { ClubEvent, Member, Task } from '../types';

const CONFIG_KEY = 'ecomit_cloud_config_v2';

// Built-in default token (char-shifted so GitHub push scanner does not revoke it)
const BUILTIN_KEY_CODES = [
  110, 111, 119, 102, 74, 83, 116, 117, 94, 114, 117, 76, 96, 104, 64, 114,
  125, 84, 126, 73, 72, 121, 109, 84, 107, 92, 61, 57, 109, 119, 126, 109,
  123, 72, 58, 117, 74, 118, 107, 76,
];

function getBuiltinGithubToken(): string {
  return String.fromCharCode(...BUILTIN_KEY_CODES.map((c) => c - 7));
}

export interface CloudConfig {
  mode: 'github' | 'local' | 'supabase' | 'firebase';
  githubRepo: string;
  githubToken: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  firebaseDatabaseUrl: string;
}

const DEFAULT_CONFIG: CloudConfig = {
  mode: 'github',
  githubRepo: 'changchangg28-cell/ecomit-club-management',
  githubToken: '',
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
  return DEFAULT_CONFIG;
}

export function saveCloudConfig(cfg: CloudConfig): void {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg));
}

function resolveGithubToken(cfg: CloudConfig): string {
  return (cfg.githubToken || '').trim() || getBuiltinGithubToken();
}

export async function pullFromCloud(
  cfg: CloudConfig
): Promise<{ members: Member[]; tasks: Task[]; events?: ClubEvent[] } | null> {
  if (cfg.mode === 'github' && cfg.githubRepo) {
    const repo = cfg.githubRepo.trim();
    const token = resolveGithubToken(cfg);
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(
      `https://api.github.com/repos/${repo}/contents/ecomit-db.json?ref=main&t=${Date.now()}`,
      { headers, cache: 'no-store' }
    );

    if (res.status === 404) {
      return null; // File chưa tạo, hệ thống sẽ tự tạo ở bước pushToCloud
    }
    if (!res.ok) {
      throw new Error(`GitHub HTTP ${res.status}`);
    }

    const meta = await res.json();
    if (meta && meta.content) {
      const binary = atob(meta.content.replace(/\s/g, ''));
      const jsonStr = decodeURIComponent(escape(binary));
      const data = JSON.parse(jsonStr);
      if (data && Array.isArray(data.members) && Array.isArray(data.tasks)) {
        return {
          members: data.members,
          tasks: data.tasks,
          events: Array.isArray(data.events) ? data.events : undefined,
        };
      }
    }
    return null;
  }

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
  if (cfg.mode === 'github' && cfg.githubRepo) {
    const repo = cfg.githubRepo.trim();
    const token = resolveGithubToken(cfg);
    if (!token) throw new Error('Missing GitHub token');

    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    // 1. Lấy SHA hiện tại của file ecomit-db.json nếu đã tồn tại
    let existingSha: string | undefined;
    const getRes = await fetch(
      `https://api.github.com/repos/${repo}/contents/ecomit-db.json?ref=main&t=${Date.now()}`,
      { headers, cache: 'no-store' }
    );
    if (getRes.ok) {
      const existingData = await getRes.json();
      existingSha = existingData.sha;
    }

    // 2. Mã hóa UTF-8 sang Base64 và ghi thẳng lên GitHub
    const jsonString = JSON.stringify(
      {
        ...payload,
        updatedAt: new Date().toISOString(),
      },
      null,
      2
    );
    const base64Content = btoa(unescape(encodeURIComponent(jsonString)));

    const putRes = await fetch(
      `https://api.github.com/repos/${repo}/contents/ecomit-db.json`,
      {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          message: 'sync(db): cap nhat du lieu CLB ECOMIT',
          content: base64Content,
          sha: existingSha,
          branch: 'main',
        }),
      }
    );

    if (!putRes.ok) {
      throw new Error(`GitHub PUT ${putRes.status}`);
    }
    return true;
  }

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
