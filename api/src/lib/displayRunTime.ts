import RunTime from "../models/RunTime";

export default (runTime: RunTime): string => `${runTime.hours}:${String(runTime.minutes).padStart(2, '0')}:${String(runTime.seconds).padStart(2, '0')}`;
