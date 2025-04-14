import Device from '@models/interface/track/device.interface';

class DeviceCache {
	private deviceList: Device[] = [];

	public readonly getAll = (): Device[] => {
		return [...this.deviceList];
	};

	public readonly updateAll = (newDeviceList: Device[]): void => {
		this.deviceList = [...newDeviceList];
	};

	public readonly clearList = (): void => {
		this.deviceList = [];
	};
}

const deviceCache = new DeviceCache();
export default deviceCache;
