import { availableRooms } from '@src/available-rooms';

export const getRoomValueAsList = (): string[] => {
	const availableRoomList: string[] = [];

	for (const [, roomValue] of Object.entries(availableRooms)) {
		availableRoomList.push(roomValue);
	}

	return [...availableRoomList];
};
