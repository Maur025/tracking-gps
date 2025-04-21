import { IAsyncCommand } from './IAsyncCommand';

export abstract class AbstractAsyncCommand<I, R>
	implements IAsyncCommand<I, R>
{
	private i!: I;

	public withRequest(request: I): IAsyncCommand<I, R> {
		this.i = request;

		return this;
	}

	public async execute(): Promise<R> {
		if (this.i === undefined || this.i === null) {
			throw new Error(`Request must not be undefined or null`);
		}

		this.validate(this.i);

		return await this.run(this.i);
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	protected validate(request: I): void {
		// ADD CUSTOM VALIDATION
	}

	protected abstract run(request: I): Promise<R>;
}
