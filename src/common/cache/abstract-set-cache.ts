import { loggerWarn } from '@maur025/core-logger';
import AbstractCache from './abstract-cache.js';

interface ManySetRequest<R> {
	id: string;
	dataSet: Set<R>;
}

enum OperationEnum {
	ADD = 'ADD',
	UPDATE = 'UPDATE',
	REPLACE = 'REPLACE',
}

export default abstract class AbstractSetCache<E> extends AbstractCache<
	Set<E>
> {
	/**
	 * Retrieves an entity set by its ID from the cache.
	 *
	 * @param {string} id - The ID of the entity set to retrieve.
	 * @returns {Set<E> | undefined} The entity set if found, otherwise `undefined`.
	 */
	public getById(id: string): Set<E> | undefined {
		if (!this.hasId(id)) {
			loggerWarn(`${this.getResource()} with id ${id} not found in cache.`);
		}

		const dataSet: Set<E> | undefined = this.getMap().get(id);

		return dataSet ? new Set(dataSet) : dataSet;
	}

	/**
	 * Adds a new entity set to the cache by its ID.
	 *
	 * @param {string} id - The ID of the entity set to add.
	 * @param {Set<E>} dataSet - The entity set data to add.
	 */
	public addById(id: string, dataSet: Set<E>): void {
		if (this.hasId(id)) {
			loggerWarn(
				`${this.getResource()} with id ${id} already exists in cache, skipping...`,
			);
			return;
		}

		this.getMap().set(id, new Set(dataSet));
	}

	/**
	 * Adds multiple entity set to the cache.
	 *
	 * @param {{id:string, dataSet:Set<E>}} addManyReqList - The list of objects with sets to add.
	 */
	public addMany(addManyReqList: ManySetRequest<E>[]): void {
		this.processMany(OperationEnum.ADD, addManyReqList);
	}

	public updateById(id: string, dataSet: Set<E>): void {
		const currentSet: Set<E> | undefined = this.getById(id);

		if (!currentSet) {
			loggerWarn(`can't be update a set that does not exist.`);
			return;
		}

		this.getMap().set(id, new Set([...currentSet, ...dataSet]));
	}

	public updateMany(updateManyReqList: ManySetRequest<E>[]): void {
		this.processMany(OperationEnum.UPDATE, updateManyReqList);
	}

	public replaceById(id: string, dataSet: Set<E>): void {
		if (!this.hasId(id)) {
			loggerWarn(`can't be replace a set that does not exist.`);
			return;
		}

		this.getMap().set(id, new Set(dataSet));
	}

	public replaceMany(replaceManyReqList: ManySetRequest<E>[]): void {
		this.processMany(OperationEnum.REPLACE, replaceManyReqList);
	}

	private processMany(
		operation: OperationEnum,
		manyRequestList: ManySetRequest<E>[],
	): void {
		if (!manyRequestList.length) {
			return;
		}

		for (const { id, dataSet } of manyRequestList) {
			if (!id || !(dataSet instanceof Set)) {
				continue;
			}

			switch (operation) {
				case OperationEnum.ADD: {
					this.addById(id, dataSet);
					break;
				}
				case OperationEnum.UPDATE: {
					this.updateById(id, dataSet);
					break;
				}
				case OperationEnum.REPLACE: {
					this.replaceById(id, dataSet);
					break;
				}
				default: {
					loggerWarn(`[SYSTEM] (processMany) Operation unknown`);
				}
			}
		}
	}
}
