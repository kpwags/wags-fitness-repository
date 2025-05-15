export const getAllShoes = `
SELECT
	ShoeId,
	Name,
	DatePurchased,
	IsRetired
FROM Shoe;
`;

export const getActiveShoes = `
SELECT
	ShoeId,
	Name,
	DatePurchased,
	IsRetired
FROM Shoe
WHERE
	IsRetired = 0;
`;

export const getShoeById = `
SELECT
	ShoeId,
	Name,
	DatePurchased,
	IsRetired
FROM Shoe
WHERE
	ShoeId = ?;
`;

export const addShoe = `
INSERT INTO Shoe (Name, DatePurchased, IsRetired) VALUES (?, ?, ?);
`;

export const updateShoe = `
UPDATE Shoe SET
	Name = ?,
	DatePurchased = ?,
	IsRetired = ?
WHERE ShoeId = ?;
`;

export const deleteShoe = `DELETE FROM Shoe WHERE ShoeId = ?`;

export const getLastInsertedId = 'SELECT MAX(ShoeId) AS LastInsertedId FROM Shoe';