import { loggerError } from '@maur025/core-logger';
import { GroupResponse } from '@models/dto/response/group-response';

export const groupCacheInit = (groupResponse?: GroupResponse[]): void => {
	if (!groupResponse?.length) {
		loggerError('group response undefined or empty');

		return;
	}
};
