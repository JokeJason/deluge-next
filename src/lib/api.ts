'use client';

import {
  type ApiResponse,
  NormalizedTorrentForTable,
  TorrentSpeedForTable,
} from '@/types';
import 'client-only';

export async function fetchAllTorrents(
  token?: string | null,
): Promise<Record<string, NormalizedTorrentForTable> | undefined> {
  const response = await fetch('/api/deluge/torrents', {
    method: 'GET',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  const result = (await response.json()) as ApiResponse<
    Record<string, NormalizedTorrentForTable>
  >;

  if (!result.success) throw new Error(result.error);
  return result.data;
}

export async function fetchAllStates(
  token?: string | null,
): Promise<string[] | undefined> {
  const response = await fetch('/api/deluge/states', {
    method: 'GET',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  const result = (await response.json()) as ApiResponse<string[]>;

  if (!result.success) throw new Error(result.error);
  return result.data;
}

export async function fetchActiveTorrentsSpeed(
  token?: string | null,
): Promise<Record<string, TorrentSpeedForTable> | undefined> {
  const response = await fetch('/api/deluge/torrents/active/speed', {
    method: 'GET',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  const result = (await response.json()) as ApiResponse<
    Record<string, TorrentSpeedForTable>
  >;

  if (!result.success) throw new Error(result.error);
  return result.data;
}

export async function fetchAllLabels(
  token?: string | null,
): Promise<string[] | undefined> {
  const response = await fetch('/api/deluge/labels', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch labels');
  }
  const data = (await response.json()) as ApiResponse<string[]>;
  return data.data;
}
