import DeviceResyncCmd from '@command/device/device-resync.cmd';
import environment from '@config/env';
import Device from '@models/entity/device';
import { Topics } from '@models/enums/topics.enum';
import { io, Socket } from 'socket.io-client';
import { container } from 'tsyringe';

const deviceResyncCmd = container.resolve(DeviceResyncCmd);

export const connect = (): void => {
	const socket: Socket = io(environment.TRACK_URL, {
		reconnection: true,
		reconnectionDelay: 10000,
	});

	socket.on(Topics.CONNECT, () => {
		console.info(`connect to Track with ID: ${socket.id}`);

		socket.emit(Topics.MESSAGE, 'enviando');
	});

	socket.on(Topics.DEVICES, (payload: Device[]) =>
		deviceResyncCmd
			.withRequest({
				deviceList: [...payload],
				socketClient: socket,
			})
			.execute()
	);
};
