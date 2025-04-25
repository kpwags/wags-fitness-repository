import sqlite3 from 'sqlite3';
import config from '../config';
import cleanSqliteError from '../lib/cleanSqliteError';
import convertDateToJsonDate from '../lib/convertDateToJsonDate';
import convertToBoolean from '../lib/convertToBoolean';

import Shoe from '../models/Shoe';

import {
	getAllShoes,
	getActiveShoes,
} from '../queries/shoes';

type ShoeQueryReturn = {
	ShoeId: number;
	Name: string;
	DatePurchased: Date;
	IsRetired: boolean;
}

class ShoeRepository {
	private static GetDatabase = () => new sqlite3.Database(config.db);

	static readonly GetAllSneakers = (onlyActive: boolean = true, callback: (error: string | null, sneakers: Shoe[]) => void) => {
		const db = this.GetDatabase();

		const shoes: Shoe[] = [];

		db.all(onlyActive ? getActiveShoes : getAllShoes, (err: any, rows: ShoeQueryReturn[]) => {
			db.close();

			if (err) {
				return callback(cleanSqliteError(err), []);
			}

			rows.forEach((row) => {
				shoes.push({
					shoeId: row.ShoeId,
					name: row.Name,
					datePurchased: row.DatePurchased,
					isRetired: convertToBoolean(row.IsRetired),
				});
			});

			return callback(null, shoes);
		});
	};
}

export default ShoeRepository;
