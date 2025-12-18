import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
    const logFile = './diagnosis.log';
    fs.writeFileSync(logFile, ':: DIAGNOSIS START ::\n');
    const log = (msg) => fs.appendFileSync(logFile, msg + '\n');

    console.log(`Writing logs to ${logFile}`);

    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox']
    });
    const page = await browser.newPage();

    page.on('console', msg => {
        if (msg.type() === 'error') log(`[CONSOLE ERROR]: ${msg.text()}`);
    });
    page.on('pageerror', err => log(`[PAGE ERROR]: ${err.toString()}`));
    page.on('requestfailed', request => {
        if (request.url().includes('localhost')) log(`[REQ FAIL]: ${request.url()} - ${request.failure().errorText}`);
    });

    try {
        log('Navigating...');
        await page.goto('http://localhost:5174', { waitUntil: 'load', timeout: 8000 });

        await new Promise(r => setTimeout(r, 2000));

        const rootContent = await page.$eval('#root', el => el.innerHTML).catch(() => 'ROOT NOT FOUND');
        log(`[ROOT CONTENT LENGTH]: ${rootContent.length}`);
        if (rootContent.length === 0) {
            log('[ROOT IS EMPTY]');
        }

    } catch (e) {
        log(`[SCRIPT ERROR]: ${e}`);
    } finally {
        await browser.close();
        console.log('Diagnosis complete.');
    }
})();
