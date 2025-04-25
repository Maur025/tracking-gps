import Device from '@models/entity/device';
import { singleton } from 'tsyringe';
@singleton()
export default class DeviceCache {
	private deviceList: Device[] = [];

	public readonly getAll = (): Device[] => {
		return [...this.deviceList];
	};

	public readonly updateAll = (newDeviceList: Device[]): void => {
		this.deviceList = [...newDeviceList];
	};

	public readonly clearCache = (): void => {
		this.deviceList = [];
	};
}
