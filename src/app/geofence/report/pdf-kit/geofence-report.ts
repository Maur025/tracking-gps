import { Response } from 'express';
import path from 'node:path';
import GeofenceService from '@app/geofence/service/geofence.service.js';
import { container } from 'tsyringe';
import { ErrorResponse } from '@maur025/core-model-data';
import { loggerDebug, loggerError } from '@maur025/core-logger';
import { handleAsArray } from '@src/api-client/service/handle-response.js';
import { GeofenceResponse } from '@app/geofence/dto/response/geofence-response.js';
import { generatePdf } from '@common/report/generate-pdf.js';

export const geofenceReport = async (res: Response): Promise<void> => {
	const geofenceService = container.resolve(GeofenceService);
	const response = await geofenceService
		.getAllPaginated({ size: 1000 })
		.catch((error: ErrorResponse) => {
			loggerError(`Can't get geofence data: `, error as Error);
			return undefined;
		});

	if (!response) {
		loggerDebug(`No geofence data found for report`);
		return;
	}

	renderBody(res, handleAsArray<GeofenceResponse>(response));
};

const renderBody = (res: Response, geofenceList: GeofenceResponse[]): void => {
	const { doc, pdfContent, pdfEnd, fontBold, fontRegular } = generatePdf(
		res,
		'geofence-report',
	);

	pdfContent(() => {
		fontBold();

		doc
			.save()
			.image(
				path.resolve(process.cwd(), 'public/trebol-logo.png'),
				doc.page.margins.left,
				doc.page.margins.top,
				{
					height: 65,
				},
			)
			.fontSize(14)
			.text(
				'REPORTE DE GEOCERCAS',
				doc.page.margins.left + 100,
				doc.page.margins.top,
			);

		fontRegular();

		doc
			.fontSize(12)
			.text('Usuario: SIN NOMBRE')
			.text('Grupo: Personas incluidas (todas)')
			.text('Por fechas del 16/06/2025 al 18/06/2025')
			.text('Fecha emision: 24/06/2025 14:39')
			.fontSize(11)
			.restore();

		doc.y = doc.page.margins.top + 80;
		doc.x = doc.page.margins.left;

		const commonTh = {
			padding: '0.5rem',
			type: 'TH',
		};

		fontBold();
		const mainTable = doc
			.table({
				columnStyles: [28, '*', '*', '*'],
				rowStyles: (i: number) => {
					return i < 1
						? { backgroundColor: '#ccc' }
						: { backgroundColor: '#fff' };
				},
			})
			.row([
				{ ...commonTh, text: 'N°' },
				{ ...commonTh, text: 'NOMBRE' },
				{ ...commonTh, text: 'CAPA' },
				{ ...commonTh, text: 'TIPO' },
			]);

		fontRegular();

		let index = 0;
		for (const geofence of geofenceList) {
			const { name: geofenceName, layer: { name: layerName, type } = {} } =
				geofence;

			const cellCommon = {
				padding: '0.5rem',
			};

			mainTable.row([
				{
					...cellCommon,
					text: (index + 1).toString(),
				},
				{ ...cellCommon, text: geofenceName ?? 'S/N' },
				{ ...cellCommon, text: layerName ?? 'S/N' },
				{
					...cellCommon,
					text: type
						? type === 'POLYGONS'
							? 'Geocerca'
							: 'Punto de interes'
						: 'S/N',
				},
			]);

			index++;
		}
	});

	pdfEnd();
};
