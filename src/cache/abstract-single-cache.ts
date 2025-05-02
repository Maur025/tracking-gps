import { BaseData } from '@maur025/core-model-data';
import AbstractCache from './abstract-cache';
import { loggerWarn } from '@utils/logger';

export default abstract class AbstractSingleCache<
	E extends BaseData
> extends AbstractCache<E> {
	/**
	 * Adds a new entity to the cache by its ID.
	 *
	 * @param {string} id - The ID of the entity to add.
	 * @param {E} data - The entity data to add.
	 */
	public addById(id: string, data: E): void {
		if (this.hasId(id)) {
			loggerWarn(
				`${this.getResource()} with id ${id} already exists in cache, skipping...`
			);
			return;
		}

		this.getMap().set(id, { ...data });
	}

	/**
	 * Adds multiple entities to the cache.
	 *
	 * @param {E[]} dataList - The list of entities to add.
	 */
	public addMany(dataList: E[]): void {
		if (!dataList.length) {
			return;
		}

		for (const data of dataList) {
			if (!data.id) {
				continue;
			}

			this.addById(data.id, data);
		}
	}

	/**
	 * Updates an existing entity in the cache by its ID.
	 *
	 * @param {string} id - The ID of the entity to update.
	 * @param {Partial<E>} data - The partial data to update the entity with.
	 */
	public updateById(id: string, data: Partial<E>): void {
		const currentData: E | undefined = this.getById(id);

		if (!currentData) {
			loggerWarn(`can't be update data that does not exist`);
			return;
		}

		this.getMap().set(id, { ...currentData, ...data });
	}

	/**
	 * Updates multiple entities in the cache.
	 *
	 * @param {E[]} dataList - The list of entities to update.
	 */
	public updateMany(dataList: E[]): void {
		for (const data of dataList) {
			if (!data.id) {
				continue;
			}

			this.updateById(data.id, data);
		}
	}
}
