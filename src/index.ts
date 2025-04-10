import express, { Express } from 'express';

const app: Express = express();
const port: number = 3000;

app.use(express.json());

app.get('/', (req, res) => {
	res.send('Running project tracking gps!');
});

app.listen(port, () => console.log(`Server runnning on port: ${port}`));
