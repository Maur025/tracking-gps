import Config from './config';
import Setup from './setup';
import State from './state';
import { BaseData } from '@maur025/core-model-data';
import Track from './track';
import Stop from './stop';
import Route from './route';

/**
 * @deprecated Device is deprecated, use schema version
 */
export default interface Device extends BaseData {
	config?: Config;
	type?: string;
	elapsed?: number;
	setup?: Setup;
	states: State;
	tracks: Track[];
	last?: Track;
	isReady?: boolean;
	tracksCoord?: [number, number][];
	stops?: Stop[];
	routeSelected?: Route;
	// quitar cuando se arregle el vinculo de device con vehiculos
	personal?: {
		plaque?: string;
		name?: string;
		icon?: string;
	};
}
