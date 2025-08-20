export const channelDataFakeDb = {
	content: [
		{
			id: 1,
			name: 'Kernotec Mail - soporte@kernotec.com',
			data: '{\n\t"params":[\n\t\t{"field":"server","type":"text","value":"correo.kernotec.com"},\n\t\t{"field":"port","type":"text","value":"465"},\n\t\t{"field":"ssl","type":"boolean","value":"true"},\n\t\t{"field":"username","type":"text","value":"soporte"},\n\t\t{"field":"password","type":"password","value":"12345"}\n\t],\n\t"userparams":[\n\t\t{"field":"tomail","description":"A","type":"mail","default":""},\n\t\t{"field":"title","description":"Titulo","type":"text","default":""},\n\t\t{"field":"message","description":"Mensaje","type":"text","default":""},\n\t]\n}',
			cprotocol_id: 'a0807ae5-7039-4779-ae24-3f96077aff6a',
			cprotocol: {
				id: 'a0807ae5-7039-4779-ae24-3f96077aff6a',
				name: 'mail_smtp',
				script: '',
			},
		},
		{
			id: 2,
			name: 'Kernotec SMS - from 77264456',
			data: '{\n\t"params":[\n\t\t{"field":"fromphone","type":"number","value":"77264456"},\n\t]\n}',
			cprotocol_id: 'f1b00c7c-ec19-45f8-90a6-9348373da143',
			cprotocol: {
				id: 'f1b00c7c-ec19-45f8-90a6-9348373da143',
				name: 'sms_service',
				script: '',
			},
		},
	],
	pagination: {
		pages: 0,
		rowsNumber: 0,
	},
};
