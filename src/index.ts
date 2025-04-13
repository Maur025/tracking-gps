import 'dotenv/config';
import 'reflect-metadata';
import '@config/ioc/dependency-injection';
import app from 'app';

const { getApp, start } = app;

getApp().get('/', (req, res) => {
	res.send('Running project tracking gps!');
});

start();
