import { WsTrackResponse } from '@app/track/dto/response/ws-track-response.js';
import environment from '@config/env.js';
import AbstractApiService from '@src/api-client/service/abstract-api-service.js';
import { singleton } from 'tsyringe';
import { Device } from '../entity/device.js';
import { get } from '@api-client/fetch-api.js';

@singleton()
export default class WsDeviceService extends AbstractApiService<Device> {
	constructor() {
		super({ baseUrl: `${environment.TRACK_URL}`, resource: 'device' });
	}

	public readonly getTracks = async ({
		deviceId,
	}: {
		deviceId: string;
	}): Promise<WsTrackResponse> =>
		get<WsTrackResponse>(
			`${this.apiRequest?.baseUrl}/${this.apiRequest?.resource}/${deviceId}/tracks`,
		);

	public readonly getHistoryTracks = async ({
		deviceId,
	}: {
		deviceId: string;
	}): Promise<WsTrackResponse> =>
		get<WsTrackResponse>(
			`${this.apiRequest?.baseUrl}/${this.apiRequest?.resource}/${deviceId}/tracksHistory`,
		);
}
