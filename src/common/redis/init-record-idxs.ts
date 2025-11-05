import DeviceCache from '@app/device/cache/device-cache.js';
import GeofenceCache from '@app/geofence/cache/geofence-cache.js';
import GeofenceInCache from '@app/geofence/cache/geofence-in-cache.js';
import VehicleCache from '@app/vehicle/cache/vehicle-cache.js';
import { container } from 'tsyringe';
import { addRedisIdx } from './service/add-redis-idx.js';
import { RediSearchSchema } from 'redis';
import PointInterestCache from '@app/point-interest/cache/point-interest-cache.js';
import RuleCache from '@app/rule/cache/rule-cache.js';
import { GroupCache } from '@app/group/cache/group-cache.js';
import DeventCache from '@app/devent/cache/devent-cache.js';

export const initRecordIdxs = async (): Promise<void> => {
	const deviceCache = container.resolve(DeviceCache);
	const geofenceCache = container.resolve(GeofenceCache);
	const pointInterestCache = container.resolve(PointInterestCache);
	const geofenceInCache = container.resolve(GeofenceInCache);
	const vehicleCache = container.resolve(VehicleCache);
	const ruleCache = container.resolve(RuleCache);
	const groupCache = container.resolve(GroupCache);
	const deventCache = container.resolve(DeventCache);

	const commonIdx: RediSearchSchema = { '$.id': { type: 'TEXT', AS: 'id' } };

	await addRedisIdx(
		deviceCache.getIdxData(),
		{ ...commonIdx },
		deviceCache.getRedisKey(),
	);

	await addRedisIdx(
		geofenceCache.getIdxData(),
		{ ...commonIdx },
		geofenceCache.getRedisKey(),
	);

	await addRedisIdx(
		pointInterestCache.getIdxData(),
		{ ...commonIdx },
		pointInterestCache.getRedisKey(),
	);

	await addRedisIdx(
		geofenceInCache.getIdxData(),
		{ ...commonIdx },
		geofenceInCache.getRedisKey(),
	);

	await addRedisIdx(
		vehicleCache.getIdxData(),
		{ ...commonIdx, '$.deviceId': { type: 'TEXT', AS: 'deviceId' } },
		vehicleCache.getRedisKey(),
	);

	await addRedisIdx(
		ruleCache.getIdxData(),
		{
			...commonIdx,
			'$.vehicles[*].vehicleId': { type: 'TEXT', AS: 'ruleVehicleId' },
			'$.groups[*].groupId': { type: 'TEXT', AS: 'ruleGroupId' },
		},
		ruleCache.getRedisKey(),
	);

	await addRedisIdx(
		groupCache.getIdxData(),
		{
			...commonIdx,
			'$.vehicles[*].id': { type: 'TEXT', AS: 'groupVehicleId' },
		},
		groupCache.getRedisKey(),
	);

	await addRedisIdx(
		deventCache.getIdxData(),
		{ ...commonIdx },
		deventCache.getRedisKey(),
	);
};
