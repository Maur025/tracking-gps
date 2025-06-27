import z, { any, object, string } from 'zod/v4';

export const KafkaPublishSchema = object({
	topic: string().nonempty(),
	value: any().nonoptional(),
	key: any().nonoptional(),
});

export type KafkaPublishSchema<V> = Omit<
	z.infer<typeof KafkaPublishSchema>,
	'value'
> & { value: V };
