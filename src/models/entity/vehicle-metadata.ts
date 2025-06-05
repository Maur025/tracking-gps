import { BaseData } from '@maur025/core-model-data';

export interface VehicleMetadata extends BaseData {
	plaque?: string;
	brand?: string;
	model?: string;
	color?: string;
	totalTour?: string;
	totalFuel?: string;
	fuelKilometer?: string;
	detail?: string;
}
