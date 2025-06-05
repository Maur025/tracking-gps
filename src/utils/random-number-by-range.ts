import { v4 as uuidv4 } from 'uuid';
export const randomNumberByRange = (min: number, max: number): number => {
	const minNumber: number = Math.pow(10, min - 1);
	const maxNumber: number = Math.pow(10, max) - 1;

	return Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
};

export const randomLetters = (): string => {
	const newUuid = uuidv4();

	const noNumbers = newUuid.replace(/[\d-]+/g, '');

	return noNumbers.slice(0, 3).toUpperCase();
};

export const generateFakePrefix = (): string => {
	const valuesArray = ['CL', 'V', 'S'];
	const randomNumber = Math.floor(Math.random() * valuesArray.length);

	return valuesArray[randomNumber];
};
