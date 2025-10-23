import z, { object, string } from 'zod/v4';

export const AddWhatsappToQueueSchema = object({
	numberPhone: string().nonempty(),
	message: string().nonempty(),
});

export type AddWhatsappToQueueSchema = z.infer<typeof AddWhatsappToQueueSchema>;
