import { loggerWarn } from '@maur025/core-logger';

/**
 * Abstract class representing a generic cache for managing entities of type `E`.
 *
 * @template E - The type of data.
 */
export default abstract class AbstractCache<E> {
	/**
	 * Returns the internal map used to store the cached data.
	 *
	 * @abstract
	 * @protected
	 * @returns {Map<string, E>} The map containing the cached data.
	 */
	protected abstract getMap(): Map<string, E>;

	/**
	 * Returns the name of the resource associated with this cache.
	 *
	 * @abstract
	 * @protected
	 * @returns {string} The name of the resource.
	 */
	protected abstract getResource(): string;

	/**
	 * Retrieves all the cached data as an array.
	 *
	 * @returns {E[]} An array of all cached data.
	 */
	public getAll(): E[] {
		return Array.from(this.getMap().values());
	}

	/**
	 * Retrieves an iterable iterator for the cached data.
	 *
	 * @returns {IterableIterator<E>} An iterator for the cached data.
	 */
	public getIterable(): IterableIterator<E> {
		return this.getMap().values();
	}

	/**
	 * Checks if an entity with the given ID exists in the cache.
	 *
	 * @param {string} id - The ID of the entity to check.
	 * @returns {boolean} `true` if the entity exists, otherwise `false`.
	 */
	public hasId(id: string): boolean {
		return this.getMap().has(id);
	}

	/**
	 * Retrieves an entity by its ID from the cache.
	 *
	 * @param {string} id - The ID of the entity to retrieve.
	 * @returns {E | undefined} The entity if found, otherwise `undefined`.
	 */
	public getById(id: string): E | undefined {
		if (!this.hasId(id)) {
			loggerWarn(`${this.getResource()} with id ${id} not found in cache.`);
		}

		const data: E | undefined = this.getMap().get(id);

		return data ? { ...data } : data;
	}

	/**
	 * Deletes an entity from the cache by its ID.
	 *
	 * @param {string} id - The ID of the entity to delete.
	 */
	public deleteById(id: string): void {
		const data: E | undefined = this.getById(id);

		if (!data) {
			return;
		}

		this.getMap().delete(id);
	}

	/**
	 * Clears all entities from the cache.
	 */
	public clear(): void {
		this.getMap().clear();
	}

	/**
	 * Returns the number of entities in the cache.
	 *
	 * @returns {number} The size of the cache.
	 */
	public size(): number {
		return this.getMap().size;
	}
}
