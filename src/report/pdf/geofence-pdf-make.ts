import { loggerError } from '@maur025/core-logger';
import { ApiResponse, ErrorResponse } from '@maur025/core-model-data';
import GeofenceResponse from '@models/dto/response/geofence-response';
import GeofenceService from '@services/geofence/geofence.service';
import { handleAsArray } from '@utils/handle-response';
import { Response } from 'express';
import path from 'node:path';
import pdfPrinter from 'pdfmake';
import { Content, TDocumentDefinitions } from 'pdfmake/interfaces';
import { container } from 'tsyringe';

export const geofencePdfMake = (res: Response): void => {
	const geofenceService = container.resolve(GeofenceService);

	geofenceService.getAllPaginated({ size: 1000 }).subscribe({
		next: (apiResponse: ApiResponse<GeofenceResponse>) => {
			generatePdf(res, handleAsArray<GeofenceResponse>(apiResponse));
		},
		error: (error: ErrorResponse) => {
			loggerError(`Can't get geofence data: `, error as Error);
		},
	});
};

const generatePdf = (res: Response, geofenceList: GeofenceResponse[]) => {
	const fontPath = path.resolve(process.cwd(), 'public/fonts');

	const printer = new pdfPrinter({
		Roboto: {
			normal: `${fontPath}/Roboto-Regular.ttf`,
			bold: `${fontPath}/Roboto-Medium.ttf`,
			italics: `${fontPath}/Roboto-Italic.ttf`,
			bolditalics: `${fontPath}/Roboto-MediumItalic.ttf`,
		},
	});
	let index = 0;
	const geofenceData = [];
	for (const geofence of geofenceList) {
		const { name: geofenceName, layer: { name: layerName, type } = {} } =
			geofence;

		geofenceData.push([
			{ text: (index + 1).toString(), style: 'textTdTableCenter' },
			{ text: geofenceName ?? 'S/N', style: 'textTdTableLeft' },
			{ text: layerName ?? 'S/N', style: 'textTdTableLeft' },
			{
				text: type
					? type === 'POLYGONS'
						? 'Geocerca'
						: 'Punto de interes'
					: 'S/N',
				style: 'textTdTableLeft',
			},
		]);
		index++;
	}

	const geofencePdf: TDocumentDefinitions = {
		pageMargins: [cmToPoints(3), cmToPoints(2), cmToPoints(1), cmToPoints(1.5)],
		pageSize: 'LETTER',
		content: [
			{
				columns: [
					{
						image: path.resolve(process.cwd(), 'public/trebol-logo.png'),
						height: 65,
						width: 65,
					},
					[
						{
							text: 'REPORTE DE GEOCERCAS',
							style: 'mainTitle',
						},
						{
							text: 'Usuario: Sin Nombre',
							style: 'secondaryTitle',
						},
						{
							text: 'Grupo: Personas incluidas (todas)',
							style: 'secondaryTitle',
						},
						{
							text: 'Por fechas del 16/06/2025 al 18/06/2025',
							style: 'secondaryTitle',
						},
						{
							text: 'Fecha emision: 24/06/2025 14:39',
							style: 'secondaryTitle',
						},
					],
				],
				margin: [0, 0, 0, 20],
			},
			{
				table: {
					headerRows: 1,
					widths: [22, '*', '*', '*'],
					body: [
						[
							{ text: 'N°', style: 'textTableHeaderCenter' },
							{ text: 'NOMBRE', style: 'textTableHeaderLeft' },
							{ text: 'CAPA', style: 'textTableHeaderLeft' },
							{ text: 'TIPO', style: 'textTableHeaderLeft' },
						],
						...geofenceData,
					],
				},
			},
		],
		footer: (currentPage: number, pageCount: number): Content => {
			return {
				columns: [
					{
						text: `Pagina ${currentPage} de ${pageCount}`,
						alignment: 'left',
						margin: [cmToPoints(3), 0, 0, 0],
						style: 'footerText',
					},
					{
						text: 'Tracking - GPS',
						alignment: 'center',
						style: 'footerText',
					},
					{
						text: `Fecha y Hora de impresión: ${getCurrentDate()}`,
						alignment: 'right',
						margin: [0, 0, cmToPoints(1), 0],
						style: 'footerText',
					},
				],
			};
		},
		styles: {
			mainTitle: {
				fontSize: 14,
				margin: [40, 0, 0, 0],
				bold: true,
			},
			secondaryTitle: {
				fontSize: 12,
				margin: [40, 0, 0, 0],
				bold: false,
			},
			textTableHeaderCenter: {
				fontSize: 11,
				bold: true,
				alignment: 'center',
			},
			textTableHeaderLeft: {
				fontSize: 11,
				bold: true,
				alignment: 'left',
			},
			textTdTableCenter: {
				fontSize: 11,
				bold: false,
				alignment: 'center',
			},
			textTdTableLeft: {
				fontSize: 11,
				bold: false,
				alignment: 'left',
			},
			footerText: {
				fontSize: 7,
				bold: true,
			},
		},
	};

	const pdfdoc = printer.createPdfKitDocument(geofencePdf, {});

	res.setHeader('Content-type', 'application/pdf');
	res.setHeader('Content-Disposition', 'inline; filename="geofence-test.pdf"');

	pdfdoc.pipe(res);

	pdfdoc.end();
};

const cmToPoints = (cm: number): number => cm * (72 / 2.54);

const getCurrentDate = (): string => {
	const now = new Date();

	return now.toLocaleString('es-BO', {
		hour12: false,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
	});
};
