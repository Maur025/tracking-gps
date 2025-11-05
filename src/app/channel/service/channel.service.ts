import AbstractApiService from '@api-client/service/abstract-api-service.js';
import { singleton } from 'tsyringe';
import { ChannelResponse } from '../dto/response/channel-response.js';
import environment from '@config/env.js';

@singleton()
export default class ChannelService extends AbstractApiService<ChannelResponse> {
	constructor() {
		super({
			baseUrl: `${environment.BACKEND_URL}/trackingdb`,
			resource: `channels`,
		});
	}
}
