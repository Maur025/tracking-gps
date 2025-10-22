import { loggerError } from '@maur025/core-logger';
import { RuleResponse } from '../dto/response/rule-response';
import { container } from 'tsyringe';
import RuleCache from '../cache/rule-cache';
import { Rule } from '../entity/rule';
import { addDataInBatch } from '@common/redis/service/add-data-in-batch';
import { addRuleBatchToRedis } from '../cache/add-rule-batch-to-redis';
import { RuleGeofence } from '../entity/rule-geofence';
import { RuleGeofenceResponse } from '../dto/response/rule-geofence-response';
import { RuleNotificationResponse } from '../dto/response/rule-notification-response';
import { RuleNotification } from '../entity/rule-notification';
import { RuleVehicle } from '../entity/rule-vehicle';
import { RuleVehicleResponse } from '../dto/response/rule-vehicle-response';
import { RuleEvent } from '../entity/rule-event';
import { RuleGroup } from '../entity/rule-group';
import { RuleGroupResponse } from '../dto/response/rule-group-response';
import { RuleFrequencyResponse } from '../dto/response/rule-frequency-response';
import { RuleFrequency } from '../entity/rule-frequency';
import { Alert } from '@app/alert/entity/alert';
import { AlertResponse } from '@app/alert/dto/response/alert-response';
import { RuleInoutSchema } from '../entity/rule-inout-schema';
import { RuleEventResponse } from '../dto/response/rule-event-response';
import { RuleNotificationChannelData } from '../entity/rule-notification-channel-data';
import { getObjectOfString } from '@utils/get-object-of-string';

export const ruleCacheInit = async (
	ruleResponseList: RuleResponse[],
): Promise<void> => {
	if (!ruleResponseList?.length) {
		loggerError('[RULE] (ruleCacheInit) rule response undefined or empty');

		return;
	}

	const ruleCache = container.resolve(RuleCache);

	ruleCache.clear();

	const ruleList: Rule[] = ruleResponseList.map(
		({
			id,
			name,
			description,
			type,
			inout,
			enabled,
			deleted,
			alerts,
			frequency,
			events,
			groups,
			vehicles,
			notifications,
			geofences,
		}) => ({
			id,
			name,
			description,
			type,
			inout: inout ? RuleInoutSchema.parse(inout) : null,
			enabled,
			deleted,
			alerts: getAlerts(alerts),
			frequencies: getRuleFrequencies(frequency),
			events: getRuleEvents(events),
			groups: getRuleGroups(groups),
			vehicles: getRuleVehicles(vehicles),
			notifications: getRuleNotifications(notifications),
			geofences: getRuleGeofences(geofences),
		}),
	);

	ruleCache.addMany(ruleList);

	await addDataInBatch<Rule>({
		dataList: ruleList,
		dataBaseKey: ruleCache.getRedisKey(),
		registerInRedisFn: addRuleBatchToRedis,
	});
};

const getAlerts = (alerts: AlertResponse[]): Alert[] =>
	alerts.map(({ id, name, color, rule_id, sound_id }) => ({
		id,
		name,
		color,
		ruleId: rule_id,
		soundId: sound_id,
	}));

const getRuleFrequencies = (
	frequencies: RuleFrequencyResponse[],
): RuleFrequency[] =>
	frequencies.map(({ id, rule_id, start_time, end_time, frequency }) => ({
		id,
		ruleId: rule_id,
		startTime: start_time,
		endTime: end_time,
		frequency,
	}));

const getRuleEvents = (events: RuleEventResponse[]): RuleEvent[] =>
	events.map(({ id, rule_id, devent_id, operator, value }) => ({
		id,
		ruleId: rule_id,
		deventId: devent_id,
		operator,
		value: value.toString(),
	}));

const getRuleGroups = (groups: RuleGroupResponse[]): RuleGroup[] =>
	groups.map(({ id, rule_id, group_id }) => ({
		id,
		ruleId: rule_id,
		groupId: group_id,
	}));

const getRuleVehicles = (vehicles: RuleVehicleResponse[]): RuleVehicle[] =>
	vehicles.map(({ id, rule_id, vehicle_id }) => ({
		id,
		ruleId: rule_id,
		vehicleId: vehicle_id,
	}));

const getRuleNotifications = (
	notifications: RuleNotificationResponse[],
): RuleNotification[] =>
	notifications.map(({ id, rule_id, channel_id, channel_data }) => ({
		id,
		ruleId: rule_id,
		channelId: channel_id,
		channelData: getNotificationChannelData(channel_data),
	}));

const getNotificationChannelData = (
	channelDataResponse: string,
): RuleNotificationChannelData | undefined => {
	if (channelDataResponse === '[object Object]') {
		return undefined;
	}

	if (!/^\s*\{[\s\S]*\}\s*$/.test(channelDataResponse)) {
		return undefined;
	}

	return getObjectOfString<RuleNotificationChannelData>(channelDataResponse);
};

const getRuleGeofences = (geofences: RuleGeofenceResponse[]): RuleGeofence[] =>
	geofences.map(({ id, rule_id, geofence_id }) => ({
		id,
		ruleId: rule_id,
		geofenceId: geofence_id,
	}));
