import ICommand from '@models/interface/command.interface';

export default abstract class AbstractCommand<IN, RES>
	implements ICommand<IN, RES>
{
	private input: IN | undefined;

	public withRequest(input: IN): ICommand<IN, RES> {
		this.input = input;

		return this;
	}

	public execute(): RES {
		this.validate(this.input);

		return this.run(this.input);
	}

	protected validate(input: IN | undefined): void {
		// add custom validation
	}

	protected abstract run(input: IN | undefined): RES;
}
