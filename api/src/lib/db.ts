import sqlite3 from 'sqlite3';
import config from '../config';
import cleanSqliteError from '../lib/cleanSqliteError';

class db {
	private static GetDatabase = () => new sqlite3.Database(config.db);

	static async Query<T>(sql: string, params: any = []): Promise<[error: string | null, data: T[]]> {
		return new Promise(function (resolve, reject) {
			try {
				const database = db.GetDatabase();

				database.all(sql, params, (err: any, rows: T[]) => {
					database.close();

					if (err) {
						return reject([cleanSqliteError(err), []]);
					}

					resolve([null, rows]);
				});
			} catch (e) {
				return reject(e);
			}
		});
	}

	static async QuerySingle<T>(sql: string, params: any = []): Promise<[error: string | null, data: T | null]> {
		return new Promise(function (resolve, reject) {
			try {
				const database = db.GetDatabase();

				database.get(sql, params, (err: any, row: T) => {
					database.close();

					if (err) {
						return reject([cleanSqliteError(err), []]);
					}

					if (!row) {
						return resolve([null, null]);
					}

					resolve([null, row]);
				});
			} catch (e) {
				return reject(e);
			}
		});
	}

	static async Execute(sql: string, params: any = []): Promise<string | null> {
		return new Promise(function (resolve, reject) {
			try {
				const database = db.GetDatabase();

				database.run(sql, params, (err: any) => {
					database.close();

					if (err) {
						return reject(cleanSqliteError(err));
					}

					resolve(null);
				});
			} catch (e) {
				return reject(e);
			}
		});
	}
}

export { db };
