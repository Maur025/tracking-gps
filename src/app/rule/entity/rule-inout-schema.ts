import z, { enum as enum_ } from 'zod/v4';

export const RuleInoutSchema = enum_(['in', 'out', 'inout']);

export type RuleInoutSchema = z.infer<typeof RuleInoutSchema>;
