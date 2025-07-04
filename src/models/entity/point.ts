import { BaseData } from '@maur025/core-model-data';

/**
 * @deprecated Point is deprecated, use schema version
 */
export default interface Point extends BaseData {
	route_id?: string;
	section?: number;
	lat?: number;
	lon?: number;
}
