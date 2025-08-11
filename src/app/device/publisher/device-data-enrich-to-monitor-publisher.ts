import { kakfaProducer } from '@common/kafka/kafka-producer';
import { Device } from '../entity/device';

export const deviceDataEnrichToMonitorPublisher = async (
	payload: Device,
): Promise<void> => {
	const { publish } = kakfaProducer();

	await publish<Device>({
		topic: 'tracking-vehicle',
		value: payload,
	});
};
