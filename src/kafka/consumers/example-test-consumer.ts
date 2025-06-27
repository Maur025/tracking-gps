import { KafkaRecordSchema } from '@config/kafka/kafka-record.schema';

export interface TestKafkaInterface {
	name: string;
}

export const exampleTestConsumer = async (
	record: KafkaRecordSchema<TestKafkaInterface>,
): Promise<void> => {
	console.log(record);
};
