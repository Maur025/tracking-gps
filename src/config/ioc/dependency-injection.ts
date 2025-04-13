import { container } from 'tsyringe';
import express, { Application } from 'express';
import { TOKENS } from './token';
import CacheableLookup from 'cacheable-lookup';

// Libraries
container.register<Application>(TOKENS.Application, { useValue: express() });
container.registerSingleton<CacheableLookup>(
	TOKENS.CacheableLookup,
	CacheableLookup
);

// Custom Class, Service And Utils
