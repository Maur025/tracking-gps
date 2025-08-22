import { container } from 'tsyringe';
import EmailService from './service/channel/email-service';
import ChannelCache from '@app/channel/cache/channel-cache';
import { Channel } from '@app/channel/entity/channel';
import { getEmailChannelParams } from './util/get-email-channel-params';
import WhatsappService from './service/channel/whatsapp-service';

export const notificationChannelInit = async (): Promise<void> => {
	const channelCache = container.resolve(ChannelCache);

	const emailChannelData: Channel | undefined = channelCache.getById('1');

	if (emailChannelData) {
		const emailService = container.resolve(EmailService);
		const { server, port, ssl, username, password } = getEmailChannelParams(
			emailChannelData?.data?.params,
		);

		await emailService.initialize({
			host: server,
			port,
			withSsl: ssl,
			auth: { user: username, pass: password },
		});
	}

	const whatsappService = container.resolve(WhatsappService);
	await whatsappService.initialize();

	// await sendNotificationToWhatsapp();
};
