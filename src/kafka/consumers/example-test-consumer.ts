import { KafkaRecordSchema } from '@config/kafka/kafka-record.schema';

export const exampleTestConsumer = async (
	record: KafkaRecordSchema,
): Promise<void> => {
	console.log(record);
};
