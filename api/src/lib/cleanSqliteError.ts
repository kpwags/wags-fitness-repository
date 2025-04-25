export default (error: Error): string => error.message.replace('SQLITE_ERROR: ', '');
