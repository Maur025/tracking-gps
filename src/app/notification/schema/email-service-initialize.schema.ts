import z, { boolean, number, object, string } from 'zod/v4';

export const EmailServiceInitializeSchema = object({
	host: string(),
	port: number(),
	withSsl: boolean().default(false),
	auth: object({
		user: string().nonempty(),
		pass: string(),
	}),
});

export type EmailServiceInitializeSchema = z.infer<
	typeof EmailServiceInitializeSchema
>;
