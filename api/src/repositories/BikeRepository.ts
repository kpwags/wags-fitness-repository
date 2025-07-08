import { db } from '@lib/db';
import { convertToBoolean } from '@lib/convertToBoolean';
import { getLastInsertedRowId } from '@lib/getLastInsertedRowId';

import { Bike } from '@models/Bike';

import {
	listBikes,
	listActiveBikes,
	findBike,
	insertBike,
	updateBike,
	deleteBike,
	getLastInsertedId,
} from '@queries/bike';


type BikeQueryReturn = {
	BikeId: number;
	Name: string;
	IsRetired: boolean;
}

class BikeRepository {
	static async GetAllBikes(onlyActive: boolean = true): Promise<[error: string | null, bikes: Bike[]]> {
		const [error, data] = await db.Query<BikeQueryReturn>(onlyActive ? listActiveBikes : listBikes);

		if (error) {
			return [error, []];
		}

		const bikes: Bike[] = [];

		data.forEach((row) => {
			bikes.push({
				bikeId: row.BikeId,
				name: row.Name,
				isRetired: convertToBoolean(row.IsRetired),
			});
		});

		return [null, bikes];
	}

	static async GetBikeById(bikeId: number): Promise<[error: string | null, bike: Bike | null]> {
		const [error, data] = await db.QuerySingle<BikeQueryReturn>(findBike, [bikeId]);

		if (error) {
			return [error, null];
		}

		if (!data) {
			return [null, null];
		}

		return [null, {
			bikeId: data.BikeId,
			name: data.Name,
			isRetired: convertToBoolean(data.IsRetired),
		}];
	}

	static async AddBike(bike: Bike): Promise<[error: string | null, id: number | null]> {
		const error = await db.Execute(insertBike, [bike.name, bike.isRetired]);

		if (error) {
			return [error, null];
		}

		const [lastInsertedIdError, lastInsertedId] = await getLastInsertedRowId(getLastInsertedId);

		if (lastInsertedIdError) {
			return [lastInsertedIdError, null];
		}

		if (!lastInsertedId) {
			return ['Unable to retrieve ID', null];
		}

		return [null, lastInsertedId];
	}

	static async UpdateBike(bike: Bike): Promise<string | null> {
		return await db.Execute(updateBike, [bike.name, bike.isRetired, bike.bikeId]);
	}

	static async DeleteBike(bikeId: number): Promise<string | null> {
		return await db.Execute(deleteBike, [bikeId]);
	}
}

export { BikeRepository };
