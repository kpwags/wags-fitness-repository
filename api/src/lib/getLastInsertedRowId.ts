import { db } from "./db";

async function getLastInsertedRowId(query: string): Promise<[error: string | null, id: number | null]> {
	const [error, data] = await db.QuerySingle<number>(query);

	if (error) {
		return [error, null];
	}

	if (!data) {
		return [null, null];
	}

	return [null, data];
}

export { getLastInsertedRowId };
