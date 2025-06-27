import z, { any, number, object, string } from 'zod/v4';

export const KafkaRecordSchema = object({
	key: any().nonoptional(),
	value: any().nonoptional(),
	timestamp: string(),
	attributes: number(),
	offset: string(),
	size: number().optional(),
	headers: any().optional(),
});

export type KafkaRecordSchema = z.infer<typeof KafkaRecordSchema>;
