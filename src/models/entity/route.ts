import { BaseDataAudit } from '@maur025/core-model-data';
import District from './district';
import Point from './point';
import Section from './section';

export default interface Route extends BaseDataAudit {
	name?: string;
	description?: string;
	distance?: number;
	color?: string;
	min_split_mt?: number;
	max_split_mt?: number;
	district_id: number;
	district: District;
	points: Point[];
	frecuency: string;
	extend?: number[];
	sections?: Section[];
}
