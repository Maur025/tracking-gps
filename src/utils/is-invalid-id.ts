export const isInvalidId = (id?: string): boolean => {
	if (!id) return true;

	return !/^[a-zA-Z0-9_-]+$/.test(id);
};
