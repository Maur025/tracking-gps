import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
	res.json([
		{ id: 1, nombre: 'prueba 1' },
		{ id: 2, nombre: 'prueba 2' },
		{ id: 3, nombre: 'prueba 3' },
	]);
});

export default router;
