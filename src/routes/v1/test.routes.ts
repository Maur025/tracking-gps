import TestController from '@controllers/test.controller';
import { zodValidator } from '@middlewares/zod-validator';
import { TestSchema } from '@schemas/controller/test.schema';
import { Router } from 'express';
import { container } from 'tsyringe';

const router = Router();
const {
	getTest,
	getTestTwo,
	testSocket,
	currentDevices,
	currentRoutes,
	zodTestValidationAndInheritance,
	viewJsonConfigSwagger,
} = container.resolve(TestController);

router.get('/', getTest);
router.get('/two', getTestTwo);
router.get('/test-socket', testSocket);
router.get('/current/devices', currentDevices);
router.get('/current/routes', currentRoutes);
router.get(
	'/zod/validation',
	zodValidator<TestSchema>(TestSchema, 'query'),
	zodTestValidationAndInheritance,
);
router.get('/view/swagger/config', viewJsonConfigSwagger);

export default router;
