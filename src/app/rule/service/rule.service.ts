import AbstractApiService from '@api-client/service/abstract-api-service';
import environment from '@config/env';
import { singleton } from 'tsyringe';
import { RuleResponse } from '../dto/rule-response';

@singleton()
export default class RuleService extends AbstractApiService<RuleResponse> {
	constructor() {
		super({
			baseUrl: `${environment.BACKEND_URL}/trackingdb`,
			resource: 'rules',
		});
	}
}
