import { Response } from 'express';
import PdfKit from 'pdfkit';

export const generatePdf = (
	res: Response,
	filename: string = 'pdf-report',
	disposition: 'inline' | 'attachment' = 'inline',
) => {
	const cmToPoints = (numberCm: number): number => {
		return numberCm * (72 / 2.54);
	};

	const doc = new PdfKit({
		size: 'LETTER',
		margins: {
			top: cmToPoints(2),
			bottom: cmToPoints(1),
			left: cmToPoints(2.5),
			right: cmToPoints(1),
		},
	});

	res.setHeader('Content-Type', 'application/pdf');
	res.setHeader(
		'Content-Disposition',
		`${disposition}; filename="${filename}"`,
	);

	const pdfContent = (setBody: () => void) => {
		doc.pipe(res);
		setBody();
	};

	const pdfEnd = (): void => {
		doc.end();
	};

	return { doc, pdfContent, pdfEnd };
};
