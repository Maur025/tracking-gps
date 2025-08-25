export const replaceDataInTemplate = (
	template: string,
	dataObject: Record<string, string>,
) => template.replace(/\$(\w+\.\w+)/g, (_, match) => dataObject[match] || '');
