import { BaseData } from '@maur025/core-model-data';

export default interface SectionResponse extends BaseData {
	uuid?: string;
	coords?: [number, number][];
}
