import app from 'app';

const { getApp, start } = app;

getApp().get('/', (req, res) => {
	res.send('Running project tracking gps!');
});

start();
