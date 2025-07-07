import { Run } from '@models/Run';

export const calculateLifespan = (runs: Run[]): number => Math.round((runs.reduce((a, { distance }) => a + distance, 0) / 500) * 100);