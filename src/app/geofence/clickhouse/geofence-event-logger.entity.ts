import { clickhouseClient } from '../../../common/log-db/connect-to-clickhouse';

export const geofenceEventLoggerEntity = async (): Promise<void> => {
	await clickhouseClient.command({
		query: `CREATE TABLE IF NOT EXISTS geofence_events_logger(
      id UUID,
			geofence_id LowCardinality(String),
			device_id LowCardinality(String),
			layer_id LowCardinality(String),
			device_lat Float64,
			device_lon Float64,
      timestamp String,
			event_type Enum8('IN' = 1, 'OUT' = 2)
    )
		ENGINE = MergeTree
		ORDER BY (geofence_id, timestamp)	
		`,
		clickhouse_settings: {
			wait_end_of_query: 1,
		},
	});
};
