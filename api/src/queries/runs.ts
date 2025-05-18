export const getAllRuns = `
SELECT
	RunId,
    DateRan,
    Temperature,
    Hours,
    Minutes,
    Seconds,
    MilesRun,
    Elevation,
    HeartRate,
    ShoeId
FROM Run
ORDER BY DateRan DESC;
`;

export const getRunsByShoe = `
SELECT
	RunId,
    DateRan,
    Temperature,
    Hours,
    Minutes,
    Seconds,
    MilesRun,
    Elevation,
    HeartRate,
    ShoeId
FROM Run
WHERE
	ShoeId = ?
ORDER BY DateRan;
`;