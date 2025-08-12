import DeviceCache from '@app/device/cache/device-cache';
import GeofenceCache from '@app/geofence/cache/geofence-cache';
import GeofenceInCache from '@app/geofence/cache/geofence-in-cache';
import VehicleCache from '@app/vehicle/cache/vehicle-cache';
import { container } from 'tsyringe';
import { addRedisIdx } from './service/add-redis-idx';
import { RediSearchSchema } from 'redis';
import PointInterestCache from '@app/point-interest/cache/point-interest-cache';
import RuleCache from '@app/rule/cache/rule-cache';
import { GroupCache } from '@app/group/cache/group-cache';

export const initRecordIdxs = async (): Promise<void> => {
	const deviceCache = container.resolve(DeviceCache);
	const geofenceCache = container.resolve(GeofenceCache);
	const pointInterestCache = container.resolve(PointInterestCache);
	const geofenceInCache = container.resolve(GeofenceInCache);
	const vehicleCache = container.resolve(VehicleCache);
	const ruleCache = container.resolve(RuleCache);
	const groupCache = container.resolve(GroupCache);

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
};
