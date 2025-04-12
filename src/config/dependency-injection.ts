import { container } from 'tsyringe';
import express, { Application } from 'express';

export const registerDependencies = (): void => {
	container.register<Application>('Application', { useValue: express() });
};
