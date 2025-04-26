import { z } from 'zod';

export const torrentSchema = z.object({
  id: z.string(),
  name: z.string(),
  totalSelected: z.number(),
  progress: z.number(),
  downloadSpeed: z.number(),
  uploadSpeed: z.number(),
  eta: z.number(),
  trackerHost: z.string(),
  label: z.string(),
});

export type DelugeTorrent = z.infer<typeof torrentSchema>;
