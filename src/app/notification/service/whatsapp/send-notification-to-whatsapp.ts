import { Browser, chromium } from 'playwright';

export const sendNotificationToWhatsapp = async (): Promise<void> => {
	let browser: Browser | null = null;
	try {
		browser = await chromium.launch({
			headless: true,
			executablePath: '/usr/bin/google-chrome-stable',
		});

		const context = await browser.newContext({
			viewport: { width: 1920, height: 1080 },
		});
		const page = await context.newPage();

		await page.goto('https://web.whatsapp.com');

		await page.screenshot({ path: 'debug.png' });

		await page.close();
		await context.close();
	} finally {
		if (browser) {
			await browser.close();
		}
	}
};
