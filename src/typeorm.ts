import { createConnection } from 'typeorm';

const config = require('../config.json');

export const conn = createConnection({
	...config.database,
	entities: [__dirname + '/models/*.js']
});
