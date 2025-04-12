import 'dotenv/config';
import 'reflect-metadata';
import { registerDependencies } from '@config/dependency-injection';
import app from 'app';

registerDependencies();
const { getApp, start } = app;

getApp().get('/', (req, res) => {
	res.send('Running project tracking gps!');
});

start();
