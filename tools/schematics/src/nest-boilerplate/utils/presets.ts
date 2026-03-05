import { VersionPreset } from '../schema';

export const PRESETS: Record<VersionPreset, { nodeMajor: number; nestMajor: number }> = {
  'node20-nest11': { nodeMajor: 20, nestMajor: 11 },
  'node22-nest11': { nodeMajor: 22, nestMajor: 11 },
  'node20-nest10': { nodeMajor: 20, nestMajor: 10 }
};
