import { ApiResponse, BaseData } from '@maur025/core-model-data';

export const handleAsArray = <T extends BaseData>(response: ApiResponse<T>) => {
	const dataResponse: T | T[] = findData(response);

	return Array.isArray(dataResponse)
		? dataResponse.map((data: T) => ({ ...data }))
		: [{ ...dataResponse }];
};

export const handleAsObject = <T extends BaseData>(
	response: ApiResponse<T>,
) => {
	const dataResponse: T | T[] = findData(response);

	if (Array.isArray(dataResponse)) {
		return dataResponse.length > 0 ? { ...dataResponse[0] } : {};
	}

	return { ...dataResponse };
};

export const findData = <T extends BaseData>(
	response: ApiResponse<T>,
): T | T[] => {
	return response.content ?? response.data ?? [];
};
