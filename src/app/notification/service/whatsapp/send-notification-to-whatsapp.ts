import { loggerDebug } from '@maur025/core-logger';
import path from 'node:path';
import { chromium } from 'playwright';
// ONLY DEMO... REMOVE LATER
export const sendNotificationToWhatsapp = async (): Promise<void> => {
	const browser = await chromium.launchPersistentContext(
		`${path.resolve(process.cwd(), 'tmp/playwright-profile')}`,
		{
			headless: false,
			executablePath: '/usr/bin/google-chrome-stable',
		},
	);

	const page = await browser.newPage();
	await page.goto('https://web.whatsapp.com');

	await page.screenshot({ path: 'debug.png' });

	const searchChatTextBox = await page.waitForSelector(
		'[aria-label="Search input textbox"]',
	);

	if (searchChatTextBox) {
		console.log(
			'existe el textbox asi que puedo cerrar el navegador e iniciarlo sin la opcion de visualizacion',
		);
	}

	await page.close();
	await browser.close();

	const browserHeadless = await chromium.launchPersistentContext(
		`${path.resolve(process.cwd(), 'tmp/playwright-profile')}`,
		{
			headless: true,
			executablePath: '/usr/bin/google-chrome-stable',
		},
	);

	const message =
		'TEST OF RULE WITH GOEFENCE IN-OUT\nDispositivo: 3165cdc688df6\nlat: -16.529648\nlon: -68.070368\nubicacion:https://maps.app.goo.gl/2Yk64tfZmsepXJh59';

	const textoUrl = encodeURIComponent(message);

	console.log(textoUrl);

	const pageToSend = await browserHeadless.newPage();
	await pageToSend.goto(
		`https://web.whatsapp.com/send?phone=59160174745&text=${textoUrl}`,
	);

	const buttonSend = await pageToSend.waitForSelector('[aria-label="Send"]', {
		state: 'attached',
	});

	await pageToSend.screenshot({ path: 'button-send.png' });

	await buttonSend.click();

	await pageToSend.waitForTimeout(1000);
	await pageToSend.close();

	loggerDebug(`[WHATSAPP] (func) notification sent to number`);
};
