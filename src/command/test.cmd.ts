import AbstractCommand from '@utils/abstract-command';

export default class TestCmd extends AbstractCommand<Request, void> {
	protected validate(input: Request | undefined): void {
		console.log('SE SUPONE QUE AQUI SE DEBE REALIZAR UNA VALIDACION');
	}

	protected run(input: Request | undefined): void {
		console.log('DATO test ID', input?.testId);
		console.log('DATO name', input?.name);
		console.log('DATO price ID', input?.price);
	}
}

interface Request {
	testId: string;
	name: string;
	price: number;
}
