export interface IAsyncCommand<I, R> {
	withRequest(request: I): IAsyncCommand<I, R>;

	execute(): Promise<R>;
}
