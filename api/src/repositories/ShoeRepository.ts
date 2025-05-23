import { db } from '../lib/db';
import convertToBoolean from '../lib/convertToBoolean';
import RunRepository from './RunRepository';
import { calculateLifespan } from '../lib/shoeFunctions';

import Shoe from '../models/Shoe';

import {
	getAllShoes,
	getActiveShoes,
	getShoeById,
	updateShoe,
	getLastInsertedId,
	deleteShoe,
	addShoe,
} from '../queries/shoes';

import convertDateToJsonDate from '../lib/convertDateToJsonDate';

type ShoeQueryReturn = {
	ShoeId: number;
	Name: string;
	DatePurchased: Date;
	IsRetired: boolean;
}

class ShoeRepository {
	static async GetAllShoes(onlyActive: boolean = true, includeRunData = true): Promise<[error: string | null, shoes: Shoe[]]> {
		const [error, data] = await db.Query<ShoeQueryReturn>(onlyActive ? getActiveShoes : getAllShoes);

		if (error) {
			return [error, []];
		}

		const shoes: Shoe[] = [];

		data.forEach((row) => {
			shoes.push({
				shoeId: row.ShoeId,
				name: row.Name,
				datePurchased: convertDateToJsonDate(row.DatePurchased),
				isRetired: convertToBoolean(row.IsRetired),
			});
		});

		if (!includeRunData) {
			return [null, shoes];
		}

		const shoesWithRunData: Shoe[] = [];

		for await (const shoe of shoes) {
            const [error, data] = await RunRepository.GetRunsForShoe(shoe.shoeId);

			if (error || data.length === 0) {
				shoesWithRunData.push({
					...shoe,
					runCount: 0,
					milesRun: 0,
					dateFirstRun: null,
					dateLastRun: null,
					lifespan: 0,
				});
			} else {
				shoesWithRunData.push({
					...shoe,
					runCount: data.length,
					milesRun: data.reduce((a, { distance }) => a + distance, 0),
					dateFirstRun: convertDateToJsonDate(data[0].dateRan),
					dateLastRun: convertDateToJsonDate(data[data.length - 1].dateRan),
					lifespan: calculateLifespan(data),
				});
			}
        }

		return [null, shoesWithRunData];
	}

	static async GetShoeById(shoeId: number): Promise<[error: string | null, shoe: Shoe | null]> {
		const [error, data] = await db.QuerySingle<ShoeQueryReturn>(getShoeById, [shoeId]);

		if (error) {
			return [error, null];
		}

		if (!data) {
			return [null, null];
		}

		const [runsError, runs] = await RunRepository.GetRunsForShoe(data.ShoeId);

		if (!runsError) {
			return [null, {
				shoeId: data.ShoeId,
				name: data.Name,
				datePurchased: convertDateToJsonDate(data.DatePurchased),
				isRetired: convertToBoolean(data.IsRetired),
			}];
		}

		return [null, {
			shoeId: data.ShoeId,
			name: data.Name,
			datePurchased: convertDateToJsonDate(data.DatePurchased),
			isRetired: convertToBoolean(data.IsRetired),
			runCount: runs.length,
			milesRun: runs.reduce((a, { distance }) => a + distance, 0),
			dateFirstRun: convertDateToJsonDate(runs[0].dateRan),
			dateLastRun: convertDateToJsonDate(runs[runs.length - 1].dateRan),
			lifespan: calculateLifespan(runs),
		}];
	}

	static async AddShoe(shoe: Shoe): Promise<[error: string | null, id: number | null]> {
		const error = await db.Execute(addShoe, [shoe.name, shoe.datePurchased, shoe.isRetired]);

		if (error) {
			return [error, null];
		}

		const [lastInsertedIdError, lastInsertedId] = await this.GetLastInsertedRowId();

		if (lastInsertedIdError) {
			return [lastInsertedIdError, null];
		}

		if (!lastInsertedId) {
			return ['Unable to retrieve ID', null];
		}

		return [null, lastInsertedId];
	}

	static async UpdateShoe(shoe: Shoe): Promise<string | null> {
		const error = await db.Execute(updateShoe, [shoe.name, shoe.datePurchased, shoe.isRetired, shoe.shoeId]);

		return error;
	};

	static async GetLastInsertedRowId(): Promise<[error: string | null, id: number | null]> {
		const [error, data] = await db.QuerySingle<number>(getLastInsertedId);

		if (error) {
			return [error, null];
		}

		if (!data) {
			return [null, null];
		}

		return [null, data];
	}

	static async DeleteShoe(shoeId: number): Promise<string | null> {
		const error = await db.Execute(deleteShoe, [shoeId]);

		return error;
	};
}

export default ShoeRepository;
