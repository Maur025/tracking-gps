import {
	number,
	object,
	string,
	function as function_,
	void as void_,
	union,
	null as null_,
	any,
} from 'zod/v4';

const KafkaMessageSchema = object({
	key: union([string(), null_()]),
	value: union([string(), null_()]),
	timestamp: string(),
	attributes: number(),
	offset: string(),
	size: number().optional(),
	headers: any().optional(),
});

export const EachMessagePayloadSchema = object({
	topic: string().nonempty(),
	partition: number(),
	message: KafkaMessageSchema,
	heartbeat: function_({ output: void_() }),
	pause: function_({ output: void_() }),
});
