import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

// Configuration
const CONFIG = {
    // IMPORTANT: Inject ?mode=export to trigger Native Export Protocol
    baseUrl: 'http://localhost:5173/?month=4&day=20&mode=export',
    outputDir: './dist/preview',
    viewport: { width: 3840, height: 2160 }
};

if (!fs.existsSync(CONFIG.outputDir)) fs.mkdirSync(CONFIG.outputDir, { recursive: true });

async function generatePreview() {
    console.log(':: NATIVE EXPORT PREVIEW (V5) :: Initializing...');

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
        await new Promise(r => setTimeout(r, 2000)); // Render wait

        console.log('Applying Standard Device Wrapper (400x720)...');

        // Note: CrystalCard is now ALREADY in "Export Mode" (darker background, no parallax)
        // We just need to wrap it perfectly for the screenshot.

        await page.evaluate(() => {
            const card = document.querySelector('.crystal-card');
            if (!card) return;

            // 1. Capture exact styles
            const bodyStyle = window.getComputedStyle(document.body);
            const universeBg = bodyStyle.backgroundImage;
            const universeColor = '#000000';

            // 2. Global Cleanup
            const styleCheck = document.createElement('style');
            styleCheck.innerHTML = `
                /* We don't need to force styles on .crystal-card anymore! It handles itself! */
                /* Just ensure body is clean */
                body { overflow: hidden !important; }
            `;
            document.head.appendChild(styleCheck);

            // 3. Create DEVICE CONTAINER (The Wrapper)
            const wrapper = document.createElement('div');
            wrapper.id = 'micro-universe-wrapper';
            wrapper.style.position = 'relative';
            wrapper.style.width = '400px';
            wrapper.style.height = '720px';
            wrapper.style.margin = '50px';

            // 4. Create BACKPLANE (The Stars)
            // Absolute positioning
            const bgLayer = document.createElement('div');
            bgLayer.style.position = 'absolute';
            bgLayer.style.top = '0';
            bgLayer.style.left = '0';
            bgLayer.style.width = '100%';
            bgLayer.style.height = '100%';
            bgLayer.style.borderRadius = '32px';
            bgLayer.style.overflow = 'hidden';
            bgLayer.style.zIndex = '-1';

            // Visuals
            bgLayer.style.backgroundColor = universeColor;
            bgLayer.style.backgroundImage = universeBg;
            bgLayer.style.backgroundAttachment = 'fixed';
            bgLayer.style.backgroundPosition = 'center top';
            bgLayer.style.backgroundSize = '100vw 100vh';
            bgLayer.style.backgroundRepeat = 'no-repeat';

            // 5. STACKING
            card.parentNode.insertBefore(wrapper, card);
            wrapper.appendChild(bgLayer);
            wrapper.appendChild(card);

            // Force Card to fill Wrapper
            card.style.position = 'absolute';
            card.style.top = '0';
            card.style.left = '0';
            card.style.width = '100%';
            card.style.height = '100%';
            // IMPORTANT: Remove margin, Card component might have margin in standard mode
            card.style.margin = '0';

            // 6. Global Cleanup
            document.body.style.background = 'transparent';
            const hub = document.querySelector('.frozen-light-hub');
            if (hub) hub.style.display = 'none';
        });

        const wrapperHandle = await page.$('#micro-universe-wrapper');

        console.log('Capturing Snapshot V5...');
        await wrapperHandle.screenshot({
            path: path.join(CONFIG.outputDir, 'preview-micro-universe-005.png'),
            omitBackground: true
        });

        console.log(`\nPREVIEW GENERATED: ${path.join(CONFIG.outputDir, 'preview-micro-universe-005.png')}`);

    } catch (e) {
        console.error('Preview Failed:', e);
    } finally {
        await browser.close();
    }
}

generatePreview();
