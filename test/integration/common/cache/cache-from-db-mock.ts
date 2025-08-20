import { setupServer, SetupServerApi } from 'msw/node';
import { http, HttpResponse } from 'msw';
import environment from '@config/env';
import { vehicleDataFakeDb } from './vehicle-data-fake-db';
import { geofenceDataFakeDb } from './geofence-data-fake-db';
import { groupDataFakeDb } from './group-data-fake-db';
import {
	vehicle_137f1081_4502_48c6_93ae_7f6d7d1a28fd,
	vehicle_515d3e35_6afd_49ec_bb36_a2190dfc7713,
	vehicle_5f4a5f59_74e2_4f1f_be17_b70d331544fc,
	vehicle_71cf8bf3_dfdf_4519_8449_efd9314ef3e4,
	vehicle_86296a8e_cc66_45c4_9e74_350c6432302c,
	vehicle_f10b7799_d38c_4a2b_a781_08b8f19a8db8,
} from './vehicle-id-data-fake-db';
import { ruleDataFakeDb } from './rule-data-fake-db';
import { deventDataFakeDb } from './devent-data-fake-db';
import { channelDataFakeDb } from './channel-data-fake-db';
import {
	deventSensor_052767e2_8cf0_4f23_8333_fdf96bfbbbfd,
	deventSensor_12b3bb66_d2b9_4b30_adac_79b12be8304b,
	deventSensor_2db5e43c_02b1_4468_9b59_6c0a58f6dc79,
	deventSensor_44b0a6be_622d_4a14_9b07_6f31d13ea4cc,
	deventSensor_4f38deda_c2d1_48aa_ad56_44a0b3302e0e,
	deventSensor_7eb32537_dd40_4bf6_b60c_bb492088fc54,
	deventSensor_ab8ca6df_2edf_45c9_9091_3e795fa231d9,
	deventSensor_abacf815_4bc2_4300_afeb_b8bc52544fed,
	deventSensor_b35ec7f2_75ad_45ab_924b_a82535674b3b,
	deventSensor_c100b10b_9712_411e_b059_4ad82a20d590,
	deventSensor_fd759611_7ede_4e87_bcd4_63dbce06e156,
} from './devent-sensor-id-data-fake-db';

const { BACKEND_URL } = environment;

export const cacheFromDbMock = (): SetupServerApi =>
	setupServer(
		http.get(`${BACKEND_URL}/trackingdb/vehicles`, ({ request }) => {
			const url = new URL(request.url);
			const size = url.searchParams.get('size');

			if (size !== '5000') {
				return HttpResponse.json({ content: [] });
			}

			return HttpResponse.json(vehicleDataFakeDb);
		}),

		http.get(`${BACKEND_URL}/trackingdb/vehicles/:id`, ({ params }) => {
			const { id } = params;

			switch (id) {
				case '137f1081-4502-48c6-93ae-7f6d7d1a28fd': {
					return HttpResponse.json(
						vehicle_137f1081_4502_48c6_93ae_7f6d7d1a28fd,
					);
				}
				case '86296a8e-cc66-45c4-9e74-350c6432302c': {
					return HttpResponse.json(
						vehicle_86296a8e_cc66_45c4_9e74_350c6432302c,
					);
				}
				case '71cf8bf3-dfdf-4519-8449-efd9314ef3e4': {
					return HttpResponse.json(
						vehicle_71cf8bf3_dfdf_4519_8449_efd9314ef3e4,
					);
				}
				case 'f10b7799-d38c-4a2b-a781-08b8f19a8db8': {
					return HttpResponse.json(
						vehicle_f10b7799_d38c_4a2b_a781_08b8f19a8db8,
					);
				}
				case '5f4a5f59-74e2-4f1f-be17-b70d331544fc': {
					return HttpResponse.json(
						vehicle_5f4a5f59_74e2_4f1f_be17_b70d331544fc,
					);
				}
				case '515d3e35-6afd-49ec-bb36-a2190dfc7713': {
					return HttpResponse.json(
						vehicle_515d3e35_6afd_49ec_bb36_a2190dfc7713,
					);
				}
				default: {
					return HttpResponse.json({ content: [] });
				}
			}
		}),
		http.get(`${BACKEND_URL}/trackingdb/geofences`, ({ request }) => {
			const url = new URL(request.url);
			const size = url.searchParams.get('size');

			if (size !== '1000') {
				return HttpResponse.json({ content: [] });
			}

			return HttpResponse.json(geofenceDataFakeDb);
		}),
		http.get(`${BACKEND_URL}/trackingdb/groups`, () =>
			HttpResponse.json(groupDataFakeDb),
		),
		http.get(`${BACKEND_URL}/trackingdb/rules`, () =>
			HttpResponse.json(ruleDataFakeDb),
		),
		http.get(`${BACKEND_URL}/trackingdb/devent_sensors/:id`, ({ params }) => {
			const { id } = params;

			switch (id) {
				case 'b35ec7f2-75ad-45ab-924b-a82535674b3b': {
					return HttpResponse.json(
						deventSensor_b35ec7f2_75ad_45ab_924b_a82535674b3b,
					);
				}
				case '44b0a6be-622d-4a14-9b07-6f31d13ea4cc': {
					return HttpResponse.json(
						deventSensor_44b0a6be_622d_4a14_9b07_6f31d13ea4cc,
					);
				}
				case 'ab8ca6df-2edf-45c9-9091-3e795fa231d9': {
					return HttpResponse.json(
						deventSensor_ab8ca6df_2edf_45c9_9091_3e795fa231d9,
					);
				}
				case '12b3bb66-d2b9-4b30-adac-79b12be8304b': {
					return HttpResponse.json(
						deventSensor_12b3bb66_d2b9_4b30_adac_79b12be8304b,
					);
				}
				case '7eb32537-dd40-4bf6-b60c-bb492088fc54': {
					return HttpResponse.json(
						deventSensor_7eb32537_dd40_4bf6_b60c_bb492088fc54,
					);
				}
				case 'abacf815-4bc2-4300-afeb-b8bc52544fed': {
					return HttpResponse.json(
						deventSensor_abacf815_4bc2_4300_afeb_b8bc52544fed,
					);
				}
				case '2db5e43c-02b1-4468-9b59-6c0a58f6dc79': {
					return HttpResponse.json(
						deventSensor_2db5e43c_02b1_4468_9b59_6c0a58f6dc79,
					);
				}
				case '052767e2-8cf0-4f23-8333-fdf96bfbbbfd': {
					return HttpResponse.json(
						deventSensor_052767e2_8cf0_4f23_8333_fdf96bfbbbfd,
					);
				}
				case 'c100b10b-9712-411e-b059-4ad82a20d590': {
					return HttpResponse.json(
						deventSensor_c100b10b_9712_411e_b059_4ad82a20d590,
					);
				}
				case '4f38deda-c2d1-48aa-ad56-44a0b3302e0e': {
					return HttpResponse.json(
						deventSensor_4f38deda_c2d1_48aa_ad56_44a0b3302e0e,
					);
				}
				case 'fd759611-7ede-4e87-bcd4-63dbce06e156': {
					return HttpResponse.json(
						deventSensor_fd759611_7ede_4e87_bcd4_63dbce06e156,
					);
				}
				default: {
					return HttpResponse.json({ content: [] });
				}
			}
		}),
		http.get(`${BACKEND_URL}/trackingdb/devents`, () =>
			HttpResponse.json(deventDataFakeDb),
		),
		http.get(`${BACKEND_URL}/trackingdb/channels`, () =>
			HttpResponse.json(channelDataFakeDb),
		),
	);
