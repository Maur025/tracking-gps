import { BaseData } from '@maur025/core-model-data';

/**
 * @deprecated SectionResponse is deprecated, use schema version RouteSectionResponse
 */
export default interface SectionResponse extends BaseData {
	uuid?: string;
	coords?: [number, number][];
}
