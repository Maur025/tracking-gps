import BaseData from '@models/dto/base-data';
import Config from './config';
import Setup from './setup';
import State from './state';
import Last from './last';

export default interface Device extends BaseData {
	config: Config;
	type: string;
	elapsed: number;
	setup: Setup;
	states: State;
	tracks: [];
	last: Last;
}
