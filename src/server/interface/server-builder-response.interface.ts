import { Application } from 'express';
import { Server } from 'http';

export default interface ServerBuilderResponse {
	getApp(): Application;
	start(): Server;
}
