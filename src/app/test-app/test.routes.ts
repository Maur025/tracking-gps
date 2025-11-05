import TestController from '@app/test-app/test.controller.js';
import { TestSchema } from '@app/test-app/schema/test.schema.js';
import { Router } from 'express';
import { container } from 'tsyringe';
import { testPaths } from './test-paths.js';
import { zodValidator } from './middlewares/zod-validator.js';

const { DEFAULT, ZOD_VALIDATION, KAFKA } = testPaths;

const testRouter: Router = Router();
const {
	getTest,
	getTestTwo,
	currentDevices,
	currentRoutes,
	zodTestValidationAndInheritance,
	viewJsonConfigSwagger,
	testingPdf,
	kafkaTestExample,
} = container.resolve(TestController);

testRouter.get(DEFAULT, getTest);
testRouter.get('/two', getTestTwo);
testRouter.get('/current/devices', currentDevices);
testRouter.get('/current/routes', currentRoutes);
testRouter.get(
	ZOD_VALIDATION,
	zodValidator<TestSchema>(TestSchema, 'query'),
	zodTestValidationAndInheritance,
);
testRouter.get('/view/swagger/config', viewJsonConfigSwagger);
testRouter.get('/pdf/test', testingPdf);
testRouter.post(KAFKA, kafkaTestExample);

export { testRouter };
