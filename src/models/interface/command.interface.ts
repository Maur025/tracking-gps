export default interface ICommand<IN, RES> {
	withRequest(input: IN): ICommand<IN, RES>;

	execute(): RES;
}
