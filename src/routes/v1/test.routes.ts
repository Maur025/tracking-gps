import TestController from '@controllers/test.controller';
import { Router } from 'express';

const router = Router();
const testController = new TestController();

router.get('/', testController.getTest);

export default router;
