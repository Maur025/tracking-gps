import z, { array, object, string } from 'zod/v4';

export const NotifyToEmailSchema = object({
	senderList: array(string()).nonempty(),
	subject: string().nonempty(),
	htmlMessage: string().nonempty(),
});

export type NotifyToEmailSchema = z.infer<typeof NotifyToEmailSchema>;
