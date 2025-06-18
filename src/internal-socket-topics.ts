// topic pattern to follow is => domain:intention-or-purpose:message-type
// IMPORTANT!! follow the pattern
export const internalSocketTopics = {
	// ROOM TOPICS
	ROOM_JOIN_REQUEST: 'room:join:request',
	ROOM_JOIN_RESPONSE: 'room:join:response',
	ROOM_LEAVE_REQUEST: 'room:leave:request',
	ROOM_LEAVE_RESPONSE: 'room:leave:response',
	ROOM_LIST_REQUEST: 'room:list:request',
	ROOM_LIST_RESPONSE: 'room:list:response',
	// GEOFENCE TOPICS
	GEOFENCE_IN_RESPONSE: 'geofence:in:response',
	GEOFENCE_OUT_RESPONSE: 'geofence:out:response',
};
