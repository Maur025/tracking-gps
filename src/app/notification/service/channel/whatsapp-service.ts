import { loggerDebug, loggerError, loggerInfo } from '@maur025/core-logger';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { BrowserContext, chromium, Page } from 'playwright';
import { singleton } from 'tsyringe';

@singleton()
export default class WhatsappService {
	private readonly PROFILE_DATA_PATH: string = `${path.join(process.cwd(), 'tmp/playwright-profile')}`;
	private readonly BROWSER_PATH: string = '/usr/bin/google-chrome-stable';

	private browser: BrowserContext | null = null;

	constructor() {}

	public getWhatsappBrowser(): BrowserContext {
		if (!this.browser) {
			throw new Error(
				`[WHATSAPP] (getWhatsappBrowser) whatsapp browser not initialized`,
			);
		}

		return this.browser;
	}

	public async closeWhatsappBrowser(): Promise<void> {
		if (this.browser) {
			await this.browser.close();
			this.browser = null;
		}
	}

	public async initialize(): Promise<void> {
		if (!existsSync(this.PROFILE_DATA_PATH)) {
			await this.loginAndInitBrowser();
			return;
		}

		const browserVerify: BrowserContext | undefined =
			await this.verifyWhatsappLoged();

		if (!browserVerify) {
			await this.loginAndInitBrowser();
			return;
		}

		this.browser = browserVerify;
		loggerInfo(
			`[WHATSAPP] (launchBrowserToSendMessage) whatsapp service started`,
		);
	}

	private async verifyWhatsappLoged(): Promise<BrowserContext | undefined> {
		const browserToVerify: BrowserContext = await this.launchBrowser(true);

		const whatsappPage: Page = await browserToVerify.newPage();
		await whatsappPage.goto('https://web.whatsapp.com');

		try {
			await whatsappPage.waitForSelector('[aria-label="Search input textbox"]');
			await whatsappPage.waitForTimeout(1000);
			await whatsappPage.close();

			return browserToVerify;
		} catch (error) {
			loggerError(
				`[WHATSAPP] (verifyWhatsappLoged) whatsapp not loged, trying to login scan qr again`,
				error as Error,
			);
		}

		await whatsappPage.close();
		await browserToVerify.close();

		return undefined;
	}

	private async loginAndInitBrowser(): Promise<void> {
		const isLoged: boolean = await this.launchBrowserToLogin();

		if (!isLoged) {
			loggerError(`[WHATSAPP] (loginAndInitBrowser) whatsapp login failed`);
			return;
		}

		await this.launchBrowserToSendMessage();
	}

	private async launchBrowserToLogin(): Promise<boolean> {
		const auxLogger: string = `[WHATSAPP] (launchBrowserToLogin)`;
		const browserToLogin: BrowserContext = await this.launchBrowser(false);

		const whatsappPage: Page = await browserToLogin.newPage();
		await whatsappPage.goto('https://web.whatsapp.com');

		const qrCodeReady: boolean = await this.verifyQrCodeExists(whatsappPage);

		if (!qrCodeReady) {
			loggerDebug(`${auxLogger} without qr exiting the process`);
			await whatsappPage.close();
			await browserToLogin.close();

			return false;
		}

		loggerInfo(`${auxLogger} qr launched, scan to continue`);

		const isLoged: boolean = await this.verifyIsLogedInAttempts(
			whatsappPage,
			4,
		);

		await whatsappPage.close();
		await browserToLogin.close();

		return isLoged;
	}

	private async verifyQrCodeExists(whatsappPage: Page): Promise<boolean> {
		try {
			await whatsappPage.waitForSelector(
				'canvas[aria-label="Scan this QR code to link a device!"]',
			);

			return true;
		} catch (error) {
			loggerError(
				`[WHATSAPP] (verifyQrCodeExists] qr not founded`,
				error as Error,
			);

			return false;
		}
	}

	private async verifyIsLogedInAttempts(
		whatsappPage: Page,
		attempts: number,
	): Promise<boolean> {
		while (attempts > 0) {
			try {
				const continueButton = await whatsappPage.waitForSelector(
					'button:has-text("Continuar"), button:has-text("continue")',
				);

				await continueButton.click();
				await whatsappPage.waitForTimeout(500);

				return true;
			} catch (error) {
				loggerError(
					`[WHATSAPP] (verifyIsLogedInAttempts) qr not scaned, retrying...`,
					error as Error,
				);
			}

			attempts--;
		}

		return false;
	}

	private async launchBrowserToSendMessage(): Promise<void> {
		this.browser = await this.launchBrowser(true);
		loggerInfo(
			`[WHATSAPP] (launchBrowserToSendMessage) whatsapp service started`,
		);
	}

	private async launchBrowser(headless: boolean): Promise<BrowserContext> {
		return await chromium.launchPersistentContext(this.PROFILE_DATA_PATH, {
			headless,
			executablePath: this.BROWSER_PATH,
		});
	}
}
