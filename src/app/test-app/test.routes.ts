import TestController from '@app/test-app/test.controller';
import { TestSchema } from '@app/test-app/schema/test.schema';
import { Router } from 'express';
import { container } from 'tsyringe';
import { testPaths } from './test-paths';
import { zodValidator } from './middlewares/zod-validator';

const { DEFAULT, ZOD_VALIDATION, KAFKA } = testPaths;

const router = Router();
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

router.get(DEFAULT, getTest);
router.get('/two', getTestTwo);
router.get('/current/devices', currentDevices);
router.get('/current/routes', currentRoutes);
router.get(
	ZOD_VALIDATION,
	zodValidator<TestSchema>(TestSchema, 'query'),
	zodTestValidationAndInheritance,
);
router.get('/view/swagger/config', viewJsonConfigSwagger);
router.get('/pdf/test', testingPdf);
router.post(KAFKA, kafkaTestExample);

export default router;
