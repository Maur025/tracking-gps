import { geofenceEventLoggerEntity } from '@app/geofence/clickhouse/geofence-event-logger.entity';

export const initCLickhouseEntities = async (): Promise<void> => {
	await geofenceEventLoggerEntity();
};
