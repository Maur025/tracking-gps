import { DeviceNotificationSchema } from '@app/notification/schema/device-notification.schema.js';
import { replaceDataInTemplate } from '@utils/replace-data-in-template.js';
import z, { object, string } from 'zod/v4';

const GetDeviceNotificationMessageRequest = object({
	notificationData: DeviceNotificationSchema,
	template: string(),
});

type GetDeviceNotificationMessageRequest = z.infer<
	typeof GetDeviceNotificationMessageRequest
>;

export const getDeviceNotificationMessage = (
	request: GetDeviceNotificationMessageRequest,
): string => {
	const { notificationData, template } =
		GetDeviceNotificationMessageRequest.parse(request);

	const dataObject: Record<string, string> = {
		'rule.description': notificationData.ruleDescription ?? 'N/A',
		'device.id': notificationData.deviceId ?? 'N/A',
		'device.lat': notificationData.withLat ?? 'N/A',
		'device.lon': notificationData.withLon ?? 'N/A',
	};

	return replaceDataInTemplate(template, dataObject);
};
