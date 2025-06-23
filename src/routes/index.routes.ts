import { Router } from 'express';
import v1Routes from '@routes/v1/index.routes';
import { loadAllSwaggerDocs } from '@src/docs/load-all-swagger-docs';

loadAllSwaggerDocs();

const router = Router();

router.use('/v1', v1Routes);

export default router;
