import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import ZodSwaggerGenerator from '@src/docs/swagger/zod-swagger-generator';
import { container } from 'tsyringe';
import { z } from 'zod/v4';

const zodSwaggerGenerator = container.resolve(ZodSwaggerGenerator);
extendZodWithOpenApi(z);

export const TestSchema = z
	.object({
		size: z.coerce.number().int().optional().default(20),
		page: z.coerce.number().int().optional().default(1),
		sortBy: z.string().optional(),
		descending: z.coerce.boolean().optional().default(true),
		keyword: z.string().optional().nullable(),
	})
	.openapi('Test Schema');

export type TestSchema = z.infer<typeof TestSchema>;

zodSwaggerGenerator.getRegistry().register('Test Schema', TestSchema);
