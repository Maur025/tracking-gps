import { DeviceNotificationSchema } from '@app/notification/schema/device-notification.schema';
import { replaceDataInTemplate } from '@utils/replace-data-in-template';
import z, { object, string } from 'zod/v4';

const GetDeviceEmailHtmlMessageRequest = object({
	notificationData: DeviceNotificationSchema,
	template: string(),
});

type GetDeviceEmailHtmlMessageRequest = z.infer<
	typeof GetDeviceEmailHtmlMessageRequest
>;

export const getDeviceEmailHtmlMessage = (
	request: GetDeviceEmailHtmlMessageRequest,
): string => {
	const { notificationData, template } =
		GetDeviceEmailHtmlMessageRequest.parse(request);

	const dataObject: Record<string, string> = {
		'rule.description': notificationData.ruleDescription || 'N/A',
		'device.id': notificationData.deviceId || 'N/A',
		'device.lat': notificationData.withLat,
		'device.lon': notificationData.withLon,
	};

	return replaceDataInTemplate(template, dataObject);
};
