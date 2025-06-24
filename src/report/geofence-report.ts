import { Response } from 'express';
import { generatePdf } from './generate-pdf';

export const geofenceReport = (res: Response): void => {
	const { doc, pdfContent, pdfEnd } = generatePdf(res, 'geofence-report');

	pdfContent(() => {
		doc.text('REPORTE DE GEOCERCAS');
		doc.text('Usuario: SIN NOMBRE');
		doc.text('Grupo: Persona incluidas (todas)');
		doc.text('Por fechas del 16/06/2025 al 18/06/2025');
		doc.text('Fecha emision: 24/06/2025 14:39');
	});

	pdfEnd();
};
