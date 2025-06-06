import AbstractSingleCache from '@cache/abstract-single-cache';
import { BaseData } from '@maur025/core-model-data';
import { expect, test } from 'vitest';

export const cacheSingleCommonTest = <T extends BaseData>(
	cache: AbstractSingleCache<T>,
	dataToTestList: T[] = []
) => {
	test('getAll in new instance return should be empty array', () => {
		const cacheDataList = cache.getAll();

		expect(cacheDataList).toBeDefined();
		expect(cacheDataList).toHaveLength(0);
		expect(cacheDataList).toEqual([]);
	});

	test('addMany should add batch of data to cache', () => {
		cache.addMany(dataToTestList);

		const cacheSize: number = cache.size();

		expect(cacheSize).toBeDefined();
		expect(cacheSize).toBe(dataToTestList.length);
	});

	test('addMany should skip objects without id', () => {
		const testDataList = [
			{
				otherProperty: 'anything 1',
			},
			{
				id: '2',
				otherProperty: 'anything 2',
			},
			{
				otherProperty: 'anything 3',
			},
		] as any[];

		cache.addMany(testDataList);

		const cacheSize: number = cache.size();

		expect(cacheSize).toBeDefined();
		expect(cacheSize).not.toBe(testDataList.length);
		expect(cacheSize).toBe(1);
	});

	test('clear should clear all data in cache', () => {
		addAllListToTest();
		const sizeBefore: number = cache.size();

		expect(sizeBefore).toBeDefined();
		expect(sizeBefore).toBe(dataToTestList.length);

		cache.clear();

		const currentSize: number = cache.size();

		expect(currentSize).toBeDefined();
		expect(currentSize).toBe(0);
	});

	test('getAll return should be a immutable objects', () => {
		addAllListToTest();

		const original: T[] = cache.getAll();
		const copy: T[] = cache.getAll();

		expect(original).toEqual(copy);
		expect(original).not.toBe(copy);
	});

	test('addById should add a new element in cache', () => {
		addAllListToTest();
		const testData = { id: '788' } as T;

		cache.addById('788', testData);

		const cacheSize: number = cache.size();
		const dataInCache: T | undefined = cache.getById('788');

		expect(cacheSize).toBeDefined();
		expect(cacheSize).toBe(dataToTestList.length + 1);

		expect(dataInCache).toBeDefined();
		expect(dataInCache).toEqual(testData);
	});

	test('addById should skip if value exist', () => {
		addAllListToTest();
		addTestElement();

		const currentSize: number = cache.size();
		expect(currentSize).toBeDefined();
		expect(currentSize).toBe(dataToTestList.length + 1);

		const testNewData = { deleted: true } as T;

		cache.addById('788', testNewData);

		const cacheSize = cache.size();
		const dataInCache: T | undefined = cache.getById('788');

		expect(cacheSize).toBeDefined();
		expect(cacheSize).toBe(currentSize);

		expect(dataInCache).toBeDefined();
		expect(dataInCache!.deleted).toBeUndefined();
	});

	test('updateById should replace or add attributes to objects', () => {
		addAllListToTest();
		addTestElement();

		const testData = { deleted: true } as T;

		cache.updateById('788', testData);

		const dataInCache: T | undefined = cache.getById('788');

		expect(dataInCache).toBeDefined();
		expect(dataInCache!.deleted).toBeDefined();
		expect(dataInCache!.deleted).toBeTruthy();
	});

	test('updateById should skip in unknown id', () => {
		addAllListToTest();

		const testData = { deleted: true } as T;
		cache.updateById('788', testData);

		const dataInCache: T | undefined = cache.getById('788');
		const size: number = cache.size();

		expect(size).toBeDefined();
		expect(size).toBe(dataToTestList.length);

		expect(dataInCache).toBeUndefined();
	});

	test('updateMany should skip objects without id', () => {
		addAllListToTest();
		addTestElement();

		const testDataList = [
			{ deleted: false },
			{ deleted: true },
			{ id: '788', deleted: true },
		] as T[];

		cache.updateMany(testDataList);

		const size: number = cache.size();
		const dataInCache: T | undefined = cache.getById('788');

		expect(size).toBeDefined();
		expect(size).toBe(dataToTestList.length + 1);

		expect(dataInCache).toBeDefined();
		expect(dataInCache!.deleted).toBeDefined();
		expect(dataInCache!.deleted).toBeTruthy();
	});

	test('deleteById should remove element in cache', () => {
		addAllListToTest();
		addTestElement();

		const previusSize: number = cache.size();

		expect(previusSize).toBeDefined();
		expect(previusSize).toBe(dataToTestList.length + 1);

		cache.deleteById('788');

		const currentSize: number = cache.size();
		const dataInCache: T | undefined = cache.getById('788');

		expect(currentSize).toBeDefined();
		expect(currentSize).not.toBe(previusSize);
		expect(currentSize).toBe(dataToTestList.length);

		expect(dataInCache).toBeUndefined();
	});

	const addTestElement = (): void => {
		const testData = { id: '788' } as T;
		cache.addById('788', testData);
	};

	const addAllListToTest = (): void => {
		cache.addMany(dataToTestList);
	};
};
