import {
	afterAll,
	afterEach,
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

import { kafkaProducer } from '@common/kafka/kafka-producer';
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
import { SetupServerApi } from 'msw/node';
import { cacheFromDbMock } from 'test/integration/common/cache/cache-from-db-mock';

const { TRACKING_GPS_DEVICE } = kafkaTopics;

describe('device tracking data consumer intergration test', () => {
	let publishKafka: <V>(
		kafkaPublishSchema: KafkaPublishSchema<V>,
	) => Promise<void>;

	let deviceTrackingDataConsumerSpy: MockInstance;
	let deviceEnrichPublisherSpy: MockInstance;

	const geofenceInCache = container.resolve(GeofenceInCache);
	const DEVICE_ID: string = '3165cdc688df6';

	let mswServer: SetupServerApi;

	beforeAll(async () => {
		mswServer = cacheFromDbMock();
		mswServer.listen({ onUnhandledRequest: 'bypass' });

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

		const { publish } = kafkaProducer();

		publishKafka = publish;

		deviceEnrichPublisherSpy = vi.spyOn(
			deviceEnrichPublisherModule,
			'deviceDataEnrichToMonitorPublisher',
		);
	}, 20000);

	beforeEach(async () => {
		deviceTrackingDataConsumerSpy.mockClear();
		deviceEnrichPublisherSpy.mockClear();
	});

	afterAll(async () => {
		await stopTestServices();
		geofenceInCache.getCache().clear();
		mswServer.close();
	});

	afterEach(() => {
		mswServer.resetHandlers();
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
			`[DEVICE] (deviceTrackingDataConsumer) validation failed: '\n✖ Invalid input: expected object, received undefined\n  → at spec'`,
		);
	});

	test('should process device data and return enrich with geofences,rules,alerts, notificarios, vehicle', async () => {
		let callNumber: number = 0;
		let timestamp = Date.now();

		await sendPayloadTest({
			coords: [-68.156003, -16.505851],
			timestamp,
		});
		callNumber++;
		await shouldNotInteractWithAnyGeofences(callNumber);
		await simulateDelay(2);

		timestamp += 15000;
		await sendPayloadTest({
			coords: [-68.069219, -16.529027],
			timestamp,
		});
		callNumber++;
		await shouldEnterSomeGeofences(callNumber);
		await simulateDelay(2);

		timestamp += 15000;
		await sendPayloadTest({
			coords: [-68.069219, -16.529027],
			timestamp,
		});
		callNumber++;
		await shouldKeepInSameGeofence(callNumber);

		timestamp += 15000;
		await sendPayloadTest({
			coords: [-68.07001545788228, -16.529479330902902],
			timestamp,
		});
		callNumber++;
		await shouldVisitPointOfInterest(callNumber);

		timestamp += 15000;
		await sendPayloadTest({
			coords: [-68.070607, -16.529831],
			timestamp,
		});
		callNumber++;
		await shouldVisitPointOfInterest(callNumber);

		timestamp += 15000;
		await sendPayloadTest({
			coords: [-68.070931, -16.530651],
			timestamp,
		});
		callNumber++;
		await shouldVisitPointOfInterest(callNumber);

		timestamp += 15000;
		await sendPayloadTest({
			coords: [-68.070896, -16.531223],
			timestamp,
		});
		callNumber++;
		await shouldVisitPointOfInterest(callNumber);
	}, 30000);

	const shouldNotInteractWithAnyGeofences = async (
		call: number,
	): Promise<void> => {
		await expectCommon(call);

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

	const shouldEnterSomeGeofences = async (call: number): Promise<void> => {
		await expectCommon(call);

		const geofenceInCacheMap = geofenceInCache.getCache();
		const deviceGeofenceInMap = geofenceInCacheMap.get(DEVICE_ID);

		expect(deviceGeofenceInMap).toBeDefined();
		expect(deviceGeofenceInMap!.size).toBe(2);

		shouldHaveVehicle();
	};

	const shouldKeepInSameGeofence = async (call: number): Promise<void> => {
		await expectCommon(call);
	};

	const shouldVisitPointOfInterest = async (call: number): Promise<void> => {
		await expectCommon(call);
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
		timestamp,
	}: {
		coords: Position;
		timestamp: number;
	}): Promise<void> => {
		await publishKafka({
			topic: TRACKING_GPS_DEVICE,
			value: {
				...deviceTrackingDataPayloadFake,
				last: {
					...deviceTrackingDataPayloadFake.last,
					t: timestamp,
					lat: coords[1],
					lon: coords[0],
				},
			},
		});
	};

	const simulateDelay = async (seconds: number = 1): Promise<void> =>
		new Promise(resolve => setTimeout(resolve, seconds * 1000));
});
