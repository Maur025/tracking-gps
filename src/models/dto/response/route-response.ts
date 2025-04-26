import { BaseDataAudit } from '@maur025/core-model-data';
import DistrictResponse from './district-response';
import PointResponse from './point-response';
import SectionResponse from './section-response';

export default interface RouteResponse extends BaseDataAudit {
	name?: string;
	description?: string;
	distance?: number;
	color?: string;
	min_split_mt?: number;
	max_split_mt?: number;
	district_id: number;
	district: DistrictResponse;
	points: PointResponse[];
	frecuency: string;
	extend?: number[];
	sections?: SectionResponse[];
	tracksIn?: [];
	tracksOut?: [];
	splitCoordsLine?: [];
}
