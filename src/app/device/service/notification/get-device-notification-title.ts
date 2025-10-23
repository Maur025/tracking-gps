import { DeviceNotificationSchema } from '@app/notification/schema/device-notification.schema';
import { replaceDataInTemplate } from '@utils/replace-data-in-template';
import z, { object, string } from 'zod/v4';

const GetDeviceNotificationTitleRequest = object({
	notificationData: DeviceNotificationSchema,
	template: string(),
});

type GetDeviceNotificationTitleRequest = z.infer<
	typeof GetDeviceNotificationTitleRequest
>;

export const getDeviceNotificationTitle = (
	request: GetDeviceNotificationTitleRequest,
): string => {
	const { notificationData, template } =
		GetDeviceNotificationTitleRequest.parse(request);

	const dataObject: Record<string, string> = {
		'rule.name': notificationData.ruleName || 'N/A',
		'device.id': notificationData.deviceId || 'N/A',
	};

	return replaceDataInTemplate(template, dataObject);
};
