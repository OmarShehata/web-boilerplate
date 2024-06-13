import Sequelize from 'sequelize'
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

export async function connectToDB() {
	console.log("Connecting to DB...")
	const sequelize = new Sequelize('database', process.env.DB_USER, process.env.DB_PASS, {
	  host: '0.0.0.0',
	  logging: false,
	  dialect: 'sqlite',
	  pool: {
	    max: 5,
	    min: 0,
	    idle: 10000
	  },
	  storage: resolve(__dirname, '../.data/database.sqlite')
	});
	await sequelize.authenticate()	
	const models = getSchema(sequelize)
	console.log("Connected!")

	return { sequelize, models }
}


export function getSchema(sequelize) {
	const Number = sequelize.define('random_numbers', {
		value: { type: Sequelize.NUMBER },
		metadata: { type: Sequelize.STRING }
	})

	return { Number }
}