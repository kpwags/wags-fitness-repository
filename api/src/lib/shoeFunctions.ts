import Run from '../models/Run';

export const calculateLifespan = (runs: Run[]): number => Math.round((runs.reduce((a, { milesRun }) => a + milesRun, 0) / 500) * 100);