import { DeviceNotificationSchema } from '@app/notification/schema/device-notification.schema';
import { replaceDataInTemplate } from '@utils/replace-data-in-template';
import z, { object, string } from 'zod/v4';

const GetDeviceEmailSubjectRequest = object({
	notificationData: DeviceNotificationSchema,
	template: string(),
});

type GetDeviceEmailSubjectRequest = z.infer<
	typeof GetDeviceEmailSubjectRequest
>;

export const getDeviceEmailSubject = (
	request: GetDeviceEmailSubjectRequest,
): string => {
	const { notificationData, template } =
		GetDeviceEmailSubjectRequest.parse(request);

	const dataObject: Record<string, string> = {
		'rule.name': notificationData.ruleName || 'N/A',
		'device.id': notificationData.deviceId || 'N/A',
	};

	return replaceDataInTemplate(template, dataObject);
};
