export const listBikes = `
SELECT
	BikeId,
	Name,
	IsRetired
FROM Bike
ORDER BY BikeId ASC;
`

export const listActiveBikes = `
SELECT
	BikeId,
	Name,
	IsRetired
FROM Bike
WHERE IsRetired = 0
ORDER BY BikeId ASC;
`;

export const findBike = `
SELECT
	BikeId,
	Name,
	IsRetired
FROM Bike
WHERE BikeId = ?;
`

export const insertBike = `
INSERT INTO Bike (Name, IsRetired) VALUES (?, ?);
`;

export const updateBike = `
UPDATE Bike SET
	Name = ?,
	IsRetired = ?
WHERE BikeId = ?;
`;

export const deleteBike = `
DELETE FROM Bike WHERE BikeId = ?;
`;

export const getLastInsertedId = 'SELECT MAX(BikeId) AS LastInsertedId FROM Bike';