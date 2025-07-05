import { DefaultServerLimitsSchema } from './schema/default-server-limits.schema';

const DEFAULT_LIMITS: DefaultServerLimitsSchema = {
	LIMIT_TEXT: '25mb',
	LIMIT_JSON: '25mb',
	LIMIT_URLENCODED: '50mb',
	LIMIT_PARAMETER: 100000,
};

export default DEFAULT_LIMITS;
