import environment from '@config/env';
import path from 'path';
import { singleton } from 'tsyringe';
import { createLogger, format, transports } from 'winston';
import fs from 'node:fs';

const { combine, timestamp, colorize, printf, json } = format;

if (!fs.existsSync(environment.LOG_PATH)) {
	fs.mkdirSync(environment.LOG_PATH, { recursive: true });
}

@singleton()
export default class LoggerWinston {
	private logger = createLogger({
		level: environment.LOG_LEVEL,
		format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), json()),
		transports: [
			new transports.Console({
				format: combine(
					colorize({ all: true }),
					timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
					printf(
						({ level, message, timestamp }) =>
							`[${timestamp}] [${level}]: ${message}`
					)
				),
			}),
			new transports.File({
				filename: path.join(environment.LOG_PATH, 'app.log'),
				level: 'info',
			}),
			new transports.File({
				filename: path.join(environment.LOG_PATH, 'error.log'),
				level: 'error',
			}),
		],
	});

	public getLogger() {
		return this.logger;
	}
}
