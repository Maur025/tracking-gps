import AbstractApiService from '@api-client/service/abstract-api-service';
import { singleton } from 'tsyringe';
import { ChannelResponse } from '../dto/response/channel-response';
import environment from '@config/env';

@singleton()
export default class ChannelService extends AbstractApiService<ChannelResponse> {
	constructor() {
		super({
			baseUrl: `${environment.BACKEND_URL}/trackingdb`,
			resource: `channels`,
		});
	}
}
