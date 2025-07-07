export const getAllRuns = `
SELECT
	R.RunId,
    R.DateRan,
    R.Temperature,
    R.Hours,
    R.Minutes,
    R.Seconds,
    R.Distance,
    R.Elevation,
    R.HeartRate,
    R.ShoeId,
    S.Name AS ShoeName
FROM Run R
LEFT JOIN Shoe S ON S.ShoeId = R.ShoeId
ORDER BY DateRan DESC;
`;

export const getRunsByShoe = `
SELECT
	R.RunId,
    R.DateRan,
    R.Temperature,
    R.Hours,
    R.Minutes,
    R.Seconds,
    R.Distance,
    R.Elevation,
    R.HeartRate,
    R.ShoeId,
    S.Name AS ShoeName
FROM Run R
LEFT JOIN Shoe S ON S.ShoeId = R.ShoeId
WHERE
	S.ShoeId = ?
ORDER BY DateRan;
`;

export const addRun = `
INSERT INTO Run (DateRan, Distance, Hours, Minutes, Seconds, Elevation, HeartRate, Temperature, ShoeId)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
`;

export const updateRun = `
UPDATE Run SET
    DateRan = ?,
    Distance = ?,
    Hours = ?,
    Minutes = ?,
    Seconds = ?,
    Elevation = ?,
    HeartRate = ?,
    Temperature = ?,
    ShoeId = ?
WHERE
    RunId = ?;
`;

export const deleteRun = `DELETE FROM Run WHERE RunId = ?;`;