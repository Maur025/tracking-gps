import { WsTrackResponse } from '@app/track/dto/ws-track-response';
import environment from '@config/env';
import AbstractApiService from '@utils/abstract-api-service';
import { get } from '@utils/api-client';
import { Observable } from 'rxjs';
import { singleton } from 'tsyringe';
import { Device } from '../entity/device';

@singleton()
export default class WsDeviceService extends AbstractApiService<Device> {
	constructor() {
		super({ baseUrl: `${environment.TRACK_URL}`, resource: 'device' });
	}

	public readonly getTracks = ({
		deviceId,
	}: {
		deviceId: string;
	}): Observable<WsTrackResponse> =>
		get<WsTrackResponse>(
			`${this.apiRequest?.baseUrl}/${this.apiRequest?.resource}/${deviceId}/tracks`,
		);

	public readonly getHistoryTracks = ({
		deviceId,
	}: {
		deviceId: string;
	}): Observable<WsTrackResponse> =>
		get<WsTrackResponse>(
			`${this.apiRequest?.baseUrl}/${this.apiRequest?.resource}/${deviceId}/tracksHistory`,
		);
}
