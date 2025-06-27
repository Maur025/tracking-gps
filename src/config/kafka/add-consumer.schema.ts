import z, { array, object, string, boolean, any } from 'zod/v4';
import { KafkaRecordSchema } from './kafka-record.schema';

export const AddConsumerSchema = object({
	topics: array(string().nonempty()).nonempty(),
	groupId: string().nonempty(),
	handler: any(),
	fromBeginning: boolean().optional(),
});

type handlerFn = (payload: KafkaRecordSchema) => Promise<void>;

export type AddConsumerRequest = Omit<
	z.infer<typeof AddConsumerSchema>,
	'handler'
> & { handler: handlerFn };
