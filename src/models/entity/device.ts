import Config from './config';
import Setup from './setup';
import State from './state';
import Last from './last';
import { BaseData } from '@maur025/core-model-data';

export default interface Device extends BaseData {
	config: Config;
	type: string;
	elapsed: number;
	setup: Setup;
	states: State;
	tracks: [];
	last: Last;
}
