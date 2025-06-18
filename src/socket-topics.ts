export const Topics = {
	// DEFAULT TOPICS
	ERROR: 'error',
	CONNECTION: 'connection',
	CONNECT: 'connect',
	RECONNECT_ATTEMPT: 'reconnect_attempt',
	RECONNECT_FAILED: 'reconnect_failed',
	RECONNECT: 'reconnect',
	// CUSTOM TOPICS
	MESSAGE: 'message',
	DEVICE: 'device',
	DEVICES: 'devices',
	DEVICE_NEW: 'device.new',
	DEVICE_REMOVE: 'device.remove',
	DEVICE_TRACKS: 'device.tracks',
	DEVICE_SETUP: 'device.setup',
	DEVICE_STATE: 'device.state',
	DEVICE_CONFIG: 'device.config',
	DEVICE_LAST: 'device.last',
	DEVICE_CLEARED: 'device.cleared',
	DEVICE_TRACK_END: 'device.track.end',
	DEVICE_UNSUBSCRIBE: 'device.unsubscribe',
	DEVICE_UNSUBSCRIBE_ALL: 'device.unsubscribe.all',
	DEVICE_SUBSCRIBE: 'device.subscribe',
	// GEOFENCE TOPICS
	GEOFENCE_IN: 'geofence.in',
	GEOFENCE_OUT: 'geofence.out',
} as const;
