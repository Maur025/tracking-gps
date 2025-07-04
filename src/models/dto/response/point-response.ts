import { BaseData } from '@maur025/core-model-data';

/**
 * @deprecated PointResponse is deprecated, use schema version
 */
export default interface PointResponse extends BaseData {
	route_id?: string;
	section?: number;
	lat?: number;
	lon?: number;
}
