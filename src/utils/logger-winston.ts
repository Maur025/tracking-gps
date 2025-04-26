import environment from '@config/env';
import path from 'path';
import { singleton } from 'tsyringe';
import { createLogger, format, transports } from 'winston';
import fs from 'node:fs';
import chalk from 'chalk';

const { combine, timestamp, printf, json } = format;
const { cyan, red, yellow, green, white, gray } = chalk;

if (!fs.existsSync(environment.LOG_PATH)) {
	fs.mkdirSync(environment.LOG_PATH, { recursive: true });
}

@singleton()
export default class LoggerWinston {
	private readonly logger = createLogger({
		format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), json()),
		transports: [
			new transports.Console({
				level: environment.LOG_LEVEL,
				format: combine(
					timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
					printf(({ level, message, timestamp }) => {
						const timestampColored = gray(`${timestamp}`);

						const levelUpper: string = level.toUpperCase();
						const levelColored = this.coloredByLevel(levelUpper, levelUpper);
						const messageColored = this.highlightMessage(
							levelUpper,
							message?.toString() ?? ''
						);

						return `[${timestampColored}] [${levelColored}]: ${messageColored}`;
					})
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

	private readonly coloredByLevel = (level: string, text: string): string => {
		switch (level) {
			case 'ERROR':
				return red(text);
			case 'WARN':
				return yellow(text);
			case 'INFO':
				return cyan(text);
			case 'HTTP':
				return white(text);
			case 'VERBOSE':
				return white(text);
			case 'DEBUG':
				return green(text);
			case 'SILLY':
				return white(text);
			default:
				return white(text);
		}
	};

	private readonly highlightMessage = (level: string, text: string): string => {
		const color = (text: string) => this.coloredByLevel(level, text);

		return text
			.replace(/\[(.*?)\]/g, (_, content) => color(`[${content}]`))
			.replace(/(https?:\/\/\S+)/g, (_, url) => chalk.underline.gray(url))
			.replace(/'([^']+)'/g, (_, quoted) => color(`'${quoted}'`))
			.replace(/"([^"]+)"/g, (_, quoted) => color(`"${quoted}"`))
			.replace(/\b([A-Z_]{2,})\b/g, match => color(match));
	};

	public getLogger() {
		return this.logger;
	}
}
