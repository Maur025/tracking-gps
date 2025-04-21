import environment from '@config/env';
import { ApiResponse } from '@maur025/core-model-data';
import DeviceResponse from '@models/dto/response/device-response';
import TrackingResponse from '@models/dto/response/tracking-response';
import WsTrackResponse from '@models/dto/response/ws-track-response';
import AbstractApiService from '@utils/abstract-api-service';
import { get } from '@utils/api-client';
import { Observable } from 'rxjs';
import { singleton } from 'tsyringe';

@singleton()
export default class WsDeviceService extends AbstractApiService<DeviceResponse> {
	constructor() {
		super({ baseUrl: `${environment.TRACK_URL}`, resource: 'device' });
	}

	public readonly getTracks = ({
		deviceId,
	}: {
		deviceId: string;
	}): Observable<WsTrackResponse> =>
		get<WsTrackResponse>(
			`${this.apiRequest?.baseUrl}/${this.apiRequest?.resource}/${deviceId}/tracks`
		);

	public readonly getHistoryTracks = ({
		deviceId,
	}: {
		deviceId: string;
	}): Observable<WsTrackResponse> =>
		get<WsTrackResponse>(
			`${this.apiRequest?.baseUrl}/${this.apiRequest?.resource}/${deviceId}/tracksHistory`
		);
}
