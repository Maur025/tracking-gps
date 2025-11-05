import { clickhouseClient } from '@common/log-db/connect-to-clickhouse.js';
import { GeofenceEventLoggerEventType } from '../entity/geofence-event-logger-event-type.js';
import { GeofenceEventLoggerSchema } from '../entity/geofence-event-logger-schema.js';
import { GeofenceIn } from '../entity/geofence-in.js';
import { v4 as uuidv4 } from 'uuid';

export const addGeofenceEventLoggerByBatchs = async (
	geofenceInList: GeofenceIn[],
	eventType: GeofenceEventLoggerEventType,
): Promise<void> => {
	const BATCH_SIZE: number = 100;
	let geofenceInBatch: GeofenceEventLoggerSchema[] = [];

	for (let index = 0; index < geofenceInList.length; index++) {
		geofenceInBatch.push(
			getGeofenceEventLoggerSchema(geofenceInList[index], eventType),
		);

		if (geofenceInBatch.length === BATCH_SIZE) {
			await saveGeofenceEventLogger(geofenceInBatch);

			geofenceInBatch = [];
		}
	}

	if (geofenceInBatch.length > 0) {
		await saveGeofenceEventLogger(geofenceInBatch);

		geofenceInBatch = [];
	}
};

const getGeofenceEventLoggerSchema = (
	{ geofenceId, deviceId, layerId, positionCoords, timestamp }: GeofenceIn,
	eventType: GeofenceEventLoggerEventType,
): GeofenceEventLoggerSchema => ({
	id: uuidv4(),
	geofence_id: geofenceId,
	device_id: deviceId,
	layer_id: layerId,
	device_lat: positionCoords[1],
	device_lon: positionCoords[0],
	timestamp,
	event_type: GeofenceEventLoggerEventType.parse(eventType),
});

const saveGeofenceEventLogger = async (
	dataBatch: GeofenceEventLoggerSchema[],
): Promise<void> => {
	await clickhouseClient.insert({
		table: 'geofence_events_logger',
		values: dataBatch,
		format: 'JSONEachRow',
	});
};
