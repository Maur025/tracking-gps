import { testSwagger } from '@routes/v1/test/test.swagger';
import { container } from 'tsyringe';
import ZodSwaggerGenerator from './swagger/zod-swagger-generator';

export const loadAllSwaggerDocs = (): void => {
	const BASE_PATH: string = '/api/v1';
	const zodSwaggerGenerator = container.resolve(ZodSwaggerGenerator);

	const TAGS_CONFIG = [
		{
			name: 'TEST',
			description: 'endpoint TEST only internal uses',
		},
	];

	testSwagger({
		path: `${BASE_PATH}/test`,
		tag: 'TEST',
	});

	zodSwaggerGenerator.setTags(TAGS_CONFIG);
};
