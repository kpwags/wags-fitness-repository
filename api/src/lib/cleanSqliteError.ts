export const cleanSqliteError = (error: Error): string => error.message.replace('SQLITE_ERROR: ', '');
