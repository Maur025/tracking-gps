import z, { enum as enum_ } from 'zod/v4';

export const DeventCondition = enum_(['AND', 'OR']);

export type DeventCondition = z.infer<typeof DeventCondition>;
