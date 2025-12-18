import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

// Configuration
const CONFIG = {
    // STRESS TEST: Jan 6 (month=0, day=6) was identified as a "Shifting Date" (Short Text)
    // We confirm that with Dual Anchor, the footer stays at the bottom.
    baseUrl: 'http://localhost:5173/?month=0&day=6&mode=export',
    outputDir: './dist/preview',
    viewport: { width: 3840, height: 2160 }
};

if (!fs.existsSync(CONFIG.outputDir)) fs.mkdirSync(CONFIG.outputDir, { recursive: true });

async function generatePreview() {
    console.log(':: NATIVE EXPORT PREVIEW (V12 - Dual Anchor Stress Test) :: Initializing...');

    // Launch Browser
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: CONFIG.viewport,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--force-color-profile=srgb',
            '--font-render-hinting=none'
        ]
    });

    const page = await browser.newPage();
    // Ultra-High DPI
    await page.setViewport({ ...CONFIG.viewport, deviceScaleFactor: 3 });

    try {
        console.log(`Navigating to ${CONFIG.baseUrl} ...`);
        await page.goto(CONFIG.baseUrl, { waitUntil: 'networkidle0', timeout: 60000 });

        await page.waitForSelector('.crystal-card');
        await new Promise(r => setTimeout(r, 2000));

        console.log('Applying Micro-Universe V11 Logic (Dual Anchor)...');

        await page.evaluate(() => {
            const card = document.querySelector('.crystal-card');
            if (!card) return;

            const seamlessGradient = `
                linear-gradient(to bottom, #151921 0%, #040406 100%), 
                radial-gradient(circle at 85% 30%, rgba(240, 185, 11, 0.06) 0%, transparent 60%)
            `;
            const exactBgColor = '#040406';

            const styleCheck = document.createElement('style');
            styleCheck.innerHTML = `body { overflow: hidden !important; }`;
            document.head.appendChild(styleCheck);

            const wrapper = document.createElement('div');
            wrapper.id = 'micro-universe-wrapper';
            wrapper.style.position = 'relative';
            wrapper.style.width = '400px';
            wrapper.style.height = '720px';
            wrapper.style.margin = '50px';

            const bgLayer = document.createElement('div');
            bgLayer.style.position = 'absolute';
            bgLayer.style.top = '0';
            bgLayer.style.left = '0';
            bgLayer.style.width = '100%';
            bgLayer.style.height = '100%';
            bgLayer.style.borderRadius = '32px';
            bgLayer.style.overflow = 'hidden';
            bgLayer.style.zIndex = '-1';

            bgLayer.style.backgroundColor = exactBgColor;
            bgLayer.style.backgroundImage = seamlessGradient;
            bgLayer.style.backgroundAttachment = 'fixed';
            bgLayer.style.backgroundPosition = 'center top';
            bgLayer.style.backgroundSize = '100vw 100vh';
            bgLayer.style.backgroundRepeat = 'no-repeat';

            card.parentNode.insertBefore(wrapper, card);
            wrapper.appendChild(bgLayer);
            wrapper.appendChild(card);

            card.style.position = 'absolute';
            card.style.top = '0';
            card.style.left = '0';
            card.style.width = '100%';
            card.style.height = '100%';
            card.style.margin = '0';

            document.body.style.background = 'transparent';
            const hub = document.querySelector('.frozen-light-hub');
            if (hub) hub.style.display = 'none';
        });

        const wrapperHandle = await page.$('#micro-universe-wrapper');

        console.log('Capturing Snapshot V12...');
        await wrapperHandle.screenshot({
            path: path.join(CONFIG.outputDir, 'preview-micro-universe-012.png'),
            omitBackground: true
        });

        console.log(`\nPREVIEW GENERATED: ${path.join(CONFIG.outputDir, 'preview-micro-universe-012.png')}`);

    } catch (e) {
        console.error('Preview Failed:', e);
    } finally {
        await browser.close();
    }
}

generatePreview();
