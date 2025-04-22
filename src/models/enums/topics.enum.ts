export enum Topics {
	// DEFAULT TOPICS
	ERROR = 'error',
	CONNECTION = 'connection',
	CONNECT = 'connect',
	// CUSTOM TOPICS
	MESSAGE = 'message',
	DEVICES = 'devices',
	DEVICE_NEW = 'device.new',
	DEVICE_REMOVE = 'device.remove',
	DEVICE_TRACK = 'device.track',
	DEVICE_LAST = 'device.last',
	DEVICE_UNSUBSCRIBE = 'device.unsubscribe',
	DEVICE_UNSUBSCRIBE_ALL = 'device.unsubscribe.all',
	DEVICE_SUBSCRIBE = 'device.subscribe',
}
