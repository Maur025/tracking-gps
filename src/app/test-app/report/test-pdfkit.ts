import PdfKit from 'pdfkit';
import { Response } from 'express';

export const testPdfKit = (res: Response) => {
	const pdfDoc = new PdfKit();

	const text: string =
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam in suscipit purus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Vivamus nec hendrerit felis. Morbi aliquam facilisis risus eu lacinia. Sed eu leo in turpis fringilla hendrerit. Ut nec accumsan nisl. Suspendisse rhoncus nisl posuere tortor tempus et dapibus elit porta. Cras leo neque, elementum a rhoncus ut, vestibulum non nibh. Phasellus pretium justo turpis. Etiam vulputate, odio vitae tincidunt ultricies, eros odio dapibus nisi, ut tincidunt lacus arcu eu elit. Aenean velit erat, vehicula eget lacinia ut, dignissim non tellus. Aliquam nec lacus mi, sed vestibulum nunc. Suspendisse potenti. Curabitur vitae sem turpis. Vestibulum sed neque eget dolor dapibus porttitor at sit amet sem. Fusce a turpis lorem. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae';

	res.setHeader('Content-Type', 'application/pdf');
	res.setHeader('Content-Disposition', 'inline; filename="test.pdf"');

	pdfDoc.pipe(res);

	pdfDoc
		.font('Helvetica-Bold')
		.fontSize(24)
		.text('Hola Mauro esto es un titulo', { align: 'center' });

	pdfDoc.moveDown();

	pdfDoc
		.font('Helvetica')
		.fontSize(12)
		.text(text, { align: 'justify', lineGap: 4 });

	pdfDoc.moveDown();

	pdfDoc.text('texto a la izquierda', { align: 'left' });
	pdfDoc.text('texto a la derecha', { align: 'right' });
	pdfDoc.text('texto centrado', { align: 'center' });
	pdfDoc.text('texto justificado', { align: 'justify' });

	pdfDoc.moveDown();

	pdfDoc.table({
		data: [
			['Column 1', 'Column 2', 'Column 3'],
			['One value goes here', 'Another one here', 'OK?'],
		],
	});

	pdfDoc.addPage();

	pdfDoc.text('Este texto ya no esta en la pagina 1', { align: 'center' });

	pdfDoc.end();
};
