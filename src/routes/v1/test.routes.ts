import TestController from '@controllers/test.controller';
import { Router } from 'express';
import { container } from 'tsyringe';

const router = Router();
const testController = container.resolve(TestController);

router.get('/', testController.getTest);
router.get('/two', testController.getTestTwo);
router.get('/test-socket', testController.testSocket);

export default router;
