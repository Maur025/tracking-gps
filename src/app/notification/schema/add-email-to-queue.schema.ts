import z, { array, object, string } from 'zod/v4';

export const AddEmailToQueueSchema = object({
	senderList: array(string()).nonempty(),
	subject: string().nonempty(),
	htmlMessage: string().nonempty(),
});

export type AddEmailToQueueSchema = z.infer<typeof AddEmailToQueueSchema>;
