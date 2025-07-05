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

	let fontRegularValue: string = 'Times-Roman';
	let fontBoldValue: string = 'Times-Bold';
	let fontItalicValue: string = 'Times-Italic';
	let fontBoldItalicValue: string = 'Times-BoldItalic';

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

	doc.pipe(res);

	const pdfContent = (setBody: () => void) => {
		doc.font(fontRegularValue).fontSize(11);

		setBody();
	};

	const pdfEnd = (): void => {
		doc.end();
	};

	const fontRegular = (): void => {
		doc.font(fontRegularValue);
	};

	const fontBold = (): void => {
		doc.font(fontBoldValue);
	};

	const fontItalic = (): void => {
		doc.font(fontItalicValue);
	};

	const fontBoldItalic = (): void => {
		doc.font(fontBoldItalicValue);
	};

	const setFont = ({
		regular,
		bold,
		italic,
		boldItalic,
	}: {
		regular: string;
		bold: string;
		italic: string;
		boldItalic: string;
	}) => {
		fontRegularValue = regular;
		fontBoldValue = bold;
		fontItalicValue = italic;
		fontBoldItalicValue = boldItalic;

		doc.font(regular);
	};

	return {
		doc,
		pdfContent,
		pdfEnd,
		fontBold,
		fontItalic,
		fontRegular,
		fontBoldItalic,
		setFont,
	};
};
