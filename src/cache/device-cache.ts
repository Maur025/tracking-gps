import Device from '@models/entity/device';
import { singleton } from 'tsyringe';
import AbstractSingleCache from './abstract-single-cache';
@singleton()
export default class DeviceCache extends AbstractSingleCache<Device> {
	private readonly deviceMap: Map<string, Device> = new Map<string, Device>();

	public getMap(): Map<string, Device> {
		return this.deviceMap;
	}

	protected getResource(): string {
		return 'Device';
	}
}
