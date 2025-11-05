import { Router } from 'express';
import { loadAllSwaggerDocs } from '@src/docs/load-all-swagger-docs.js';
import { v1Router } from './v1/index.routes.js';

loadAllSwaggerDocs();

const router: Router = Router();

router.use('/v1', v1Router);

export default router;
