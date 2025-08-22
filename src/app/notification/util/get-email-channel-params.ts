import { ChannelDataParams } from '@app/channel/entity/channel-data-params';
import { loggerDebug } from '@maur025/core-logger';
import z, { boolean, number, object, string } from 'zod/v4';

const EmailChannelParams = object({
	server: string(),
	port: number(),
	ssl: boolean().default(false),
	username: string(),
	password: string(),
});

type EmailChannelParams = z.infer<typeof EmailChannelParams>;

export const getEmailChannelParams = (
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
