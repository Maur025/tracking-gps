import {
	afterAll,
	beforeAll,
	beforeEach,
	describe,
	expect,
	MockInstance,
	test,
	vi,
} from 'vitest';

vi.mock('@maur025/core-logger', async importOriginal => {
	const logger: object = await importOriginal();

	return {
		...logger,
		loggerError: vi.fn(),
	};
});

import { kakfaProducer } from '@common/kafka/kafka-producer';
import { KafkaPublishSchema } from '@common/kafka/schema/kafka-publish.schema';
import {
	startTestServices,
	stopTestServices,
} from 'test/integration/test-services.setup';
import * as deviceConsumer from '@app/device/consumers/device-tracking-data-consumer';
import { waitForAssert } from 'test/integration/util/wait-for-assert';
import app from '@src/app';
import { loggerError } from '@maur025/core-logger';
import { deviceTrackingDataPayloadFake } from '../payload-fake-data/device-tracking-data-payload-fake';
import { Position } from 'geojson';
import * as deviceEnrichPublisherModule from '@app/device/publisher/device-data-enrich-to-monitor-publisher';
import { container } from 'tsyringe';
import GeofenceInCache from '@app/geofence/cache/geofence-in-cache';
import { kafkaTopics } from '@src/kafka-topics';

const { TRACKING_GPS_DEVICE } = kafkaTopics;

describe('device tracking data consumer intergration test', () => {
	let publishKafka: <V>(
		kafkaPublishSchema: KafkaPublishSchema<V>,
	) => Promise<void>;

	let deviceTrackingDataConsumerSpy: MockInstance;
	let deviceEnrichPublisherSpy: MockInstance;

	const geofenceInCache = container.resolve(GeofenceInCache);
	const DEVICE_ID: string = '3165cdc688df6';

	beforeAll(async () => {
		const { start } = app;
		start();

		vi.clearAllMocks();
		deviceTrackingDataConsumerSpy = vi.spyOn(
			deviceConsumer,
			'deviceTrackingDataConsumer',
		);

		await startTestServices({
			withKafka: true,
			withRedis: true,
			withClickhouse: true,
			withCache: true,
		});

		const { publish } = kakfaProducer();

		publishKafka = publish;

		deviceEnrichPublisherSpy = vi.spyOn(
			deviceEnrichPublisherModule,
			'deviceDataEnrichToMonitorPublisher',
		);
	});

	afterAll(async () => {
		await stopTestServices();
	});

	beforeEach(() => {
		deviceTrackingDataConsumerSpy.mockClear();
		deviceEnrichPublisherSpy.mockClear();
	});

	test('should do early return when payload is invalid', async () => {
		await publishKafka({
			topic: TRACKING_GPS_DEVICE,
			value: { saludo: 'hola' },
		});

		await waitForAssert(() => {
			expect(deviceTrackingDataConsumerSpy).toHaveBeenCalled();
		});

		expect(loggerError).toHaveBeenCalledWith(
			`[DEVICE] (deviceTrackingDataConsumer) validation failed: '\n✖ Invalid input: expected object, received undefined\n  → at spec\n✖ Invalid input: expected object, received undefined\n  → at states'`,
		);
	});

	test('should process device data and return enrich with geofences,rules,alerts, notificarios, vehicle', async () => {
		await sendPayloadTest({ coords: [-68.156003, -16.505851] });
		await shouldNotInteractWithAnyGeofences();

		await simulateDelay();

		await sendPayloadTest({ coords: [-68.06901, -16.529763] });
		await shouldEnterSomeGeofences();
	});

	const shouldNotInteractWithAnyGeofences = async (): Promise<void> => {
		await expectCommon(1);

		const geofenceInCacheMap = geofenceInCache.getCache();
		const deviceGeofenceInMap = geofenceInCacheMap.get(DEVICE_ID);

		expect(deviceGeofenceInMap).toBeUndefined();

		shouldHaveVehicle();
		expect(deviceEnrichPublisherSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				...expectDeviceCommon(),
				last: expect.objectContaining({
					lat: -16.505851,
					lon: -68.156003,
				}),
				geofencesIn: expect.objectContaining({
					geofenceList: [],
					geofenceInTotal: 0,
					quantityNewIn: 0,
					geofenceInNames: [],
					newGeofenceInList: [],
				}),
				geofencesOut: expect.objectContaining({
					geofenceList: [],
					geofenceOutTotal: 0,
				}),
			}),
		);
	};

	const shouldEnterSomeGeofences = async (): Promise<void> => {
		await expectCommon(2);

		const geofenceInCacheMap = geofenceInCache.getCache();
		const deviceGeofenceInMap = geofenceInCacheMap.get(DEVICE_ID);

		expect(deviceGeofenceInMap).toBeDefined();
		expect(deviceGeofenceInMap!.size).toBe(2);

		shouldHaveVehicle();
	};

	const shouldHaveVehicle = (): void => {
		expect(deviceEnrichPublisherSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				...expectDeviceCommon(),
				vehicleData: expect.objectContaining({
					id: expect.any(String),
					deviceId: DEVICE_ID,
					devices: expect.arrayContaining([DEVICE_ID]),
					name: expect.any(String),
					type: expect.any(String),
					metadata: expect.any(Object),
				}),
			}),
		);
	};

	const expectCommon = async (numberToExpect: number): Promise<void> => {
		await waitForAssert(() => {
			expect(deviceEnrichPublisherSpy).toHaveBeenCalledTimes(numberToExpect);
		});
	};

	const expectDeviceCommon = () => {
		return {
			id: DEVICE_ID,
			spec: { name: 'Mei Track', brand: 'Mei', model: 'T311', type: 'tracker' },
			config: { IMEI: '869013020773878' },
			type: 'tracker',
			elapsed: 0,
			setup: {},
			tracks: 1908,
			last: expect.any(Object),
			states: expect.any(Object),
			vehicleData: expect.any(Object),
			geofencesIn: expect.any(Object),
			geofencesOut: expect.any(Object),
		};
	};

	const sendPayloadTest = async ({
		coords,
	}: {
		coords: Position;
	}): Promise<void> => {
		await publishKafka({
			topic: TRACKING_GPS_DEVICE,
			value: {
				...deviceTrackingDataPayloadFake,
				last: {
					...deviceTrackingDataPayloadFake.last,
					t: Date.now(),
					lat: coords[1],
					lon: coords[0],
				},
			},
		});
	};

	const simulateDelay = async (): Promise<void> =>
		new Promise(resolve => setTimeout(resolve, 1000));
});
