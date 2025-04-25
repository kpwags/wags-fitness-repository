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