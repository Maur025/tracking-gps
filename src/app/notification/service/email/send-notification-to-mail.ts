import { DeviceRuleAlertToLaunch } from '@app/device/entity/device-rule-alert-to-launch';
import z, { array, boolean, number, object, string } from 'zod/v4';
import { emailService } from './email-service';
import { container } from 'tsyringe';
import ChannelCache from '@app/channel/cache/channel-cache';
import { loggerDebug, loggerError } from '@maur025/core-logger';
import { ChannelDataParams } from '@app/channel/entity/channel-data-params';

const SendNotificationToMailRequest = object({
	senderList: array(string()).nonempty(),
	titleFormat: string().nonempty(),
	messageFormat: string().nonempty(),
	notificationToLaunch: array(DeviceRuleAlertToLaunch).nonempty(),
});

type SendNotificationToMailRequest = z.infer<
	typeof SendNotificationToMailRequest
>;

export const sendNotificationToMail = async (
	request: SendNotificationToMailRequest,
): Promise<void> => {
	const { senderList, titleFormat, messageFormat, notificationToLaunch } =
		SendNotificationToMailRequest.parse(request);

	const channelCache = container.resolve(ChannelCache);
	const channel = channelCache.getById('1');

	if (!channel) {
		loggerError(
			`[NOTIFICATION] (sendNotificationToMail) channel not founded, fatal error`,
		);

		return;
	}

	const { server, port, ssl, username, password }: EmailChannelParams =
		getEmailChannelParams(channel.data?.params);

	const { getTransporter, closeTransporter } = emailService();

	const emailTransporter = getTransporter({
		host: server,
		port,
		withSsl: ssl,
		auth: { user: username, pass: password },
	});

	for (const notification of notificationToLaunch) {
		// should be a for???
		emailTransporter.sendMail({
			from: username,
			to: senderList,
			subject: `${titleFormat} | test | test1 | test2`,
			text: `Notification of rule: ${notification.ruleId}`,
			html: messageFormat,
		});
	}

	closeTransporter();
};

const EmailChannelParams = object({
	server: string(),
	port: number(),
	ssl: boolean().default(false),
	username: string(),
	password: string(),
});

type EmailChannelParams = z.infer<typeof EmailChannelParams>;

const getEmailChannelParams = (
	channelParams: ChannelDataParams[],
): EmailChannelParams => {
	const emailChannelParams: EmailChannelParams = {
		server: '',
		port: 0,
		ssl: false,
		username: '',
		password: '',
	};

	for (const param of channelParams) {
		switch (param.field) {
			case 'server': {
				emailChannelParams.server = param.value;
				continue;
			}
			case 'port': {
				emailChannelParams.port = Number(param.value);
				continue;
			}
			case 'ssl': {
				emailChannelParams.ssl = param.value === 'true';
				continue;
			}
			case 'username': {
				// emailChannelParams.username = param.value;

				// only dev purposes
				emailChannelParams.username = 'mauro.moya@kernotec.com';
				continue;
			}
			case 'password': {
				// emailChannelParams.password = param.value;

				// only dev purposes
				emailChannelParams.password = process.env.MAIL_PASS ?? '';
				continue;
			}
			default: {
				loggerDebug(
					`[NOTIFICATION] (getChannelParams) unknown param [${param.field}]`,
				);
				continue;
			}
		}
	}

	return emailChannelParams;
};
