import request from 'supertest';
import { describe, expect, test } from 'vitest';

import app from '../../../../src/app';

const { getApp } = app;

describe('Test Routes', () => {
	test('GET /two should return object with name', async () => {
		const result = await request(getApp()).get('/api/v1/test/two');

		expect(result.status).toBe(200);

		expect(Array.isArray(result.body)).toBeTruthy();
		expect(result.body).toHaveLength(1);

		const [firstObject] = result.body;

		expect(firstObject).toHaveProperty('name');
	});
});
