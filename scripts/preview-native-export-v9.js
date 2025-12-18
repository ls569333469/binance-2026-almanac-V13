import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

// Configuration
const CONFIG = {
    // TRIGGER NATIVE EXPORT MODE
    baseUrl: 'http://localhost:5173/?month=4&day=20&mode=export',
    outputDir: './dist/preview',
    viewport: { width: 3840, height: 2160 }
};

if (!fs.existsSync(CONFIG.outputDir)) fs.mkdirSync(CONFIG.outputDir, { recursive: true });

async function generatePreview() {
    console.log(':: NATIVE EXPORT PREVIEW (V9 - The Luminous Master) :: Initializing...');

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

        console.log('Applying Micro-Universe V9 (Mastering Grade)...');

        await page.evaluate(() => {
            const card = document.querySelector('.crystal-card');
            if (!card) return;

            // 1. Manually Define the Correct Gradient from index.html
            // V9 TUNING: Mastering Black (#040406) - Tuned for maximum dynamic range perception
            const exactGradient = 'radial-gradient(circle at 50% 0%, #151921 0%, #040406 85%), radial-gradient(circle at 85% 30%, rgba(240, 185, 11, 0.08) 0%, transparent 50%)';
            const exactBgColor = '#040406';

            // 2. Global Cleanup
            const styleCheck = document.createElement('style');
            styleCheck.innerHTML = `
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

            // Visuals - EXPLICITLY APPLY GRADIENT
            bgLayer.style.backgroundColor = exactBgColor;
            bgLayer.style.backgroundImage = exactGradient;
            bgLayer.style.backgroundAttachment = 'fixed';
            bgLayer.style.backgroundPosition = 'center top';
            bgLayer.style.backgroundSize = '100vw 100vh';
            bgLayer.style.backgroundRepeat = 'no-repeat';

            // 5. INJECT GRAIN (The "Film Soul")
            // This SVG noise prevents color banding in the dark gradient
            const grainLayer = document.createElement('div');
            grainLayer.style.position = 'absolute';
            grainLayer.style.inset = '0';
            grainLayer.style.zIndex = '0'; // Between BG and Card
            grainLayer.style.opacity = '0.04'; // Very subtle
            grainLayer.style.pointerEvents = 'none';
            grainLayer.style.filter = 'contrast(500%) brightness(1000%)'; // Maximize noise contrast
            grainLayer.style.backgroundImage = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;

            // 6. STACKING
            card.parentNode.insertBefore(wrapper, card);
            wrapper.appendChild(bgLayer);
            wrapper.appendChild(grainLayer); // Insert Grain
            wrapper.appendChild(card);

            // Force Card to fill Wrapper
            card.style.position = 'absolute';
            card.style.top = '0';
            card.style.left = '0';
            card.style.width = '100%';
            card.style.height = '100%';
            card.style.margin = '0';

            // 7. Global Cleanup
            document.body.style.background = 'transparent';
            const hub = document.querySelector('.frozen-light-hub');
            if (hub) hub.style.display = 'none';
        });

        const wrapperHandle = await page.$('#micro-universe-wrapper');

        console.log('Capturing Snapshot V9...');
        await wrapperHandle.screenshot({
            path: path.join(CONFIG.outputDir, 'preview-micro-universe-009.png'),
            omitBackground: true
        });

        console.log(`\nPREVIEW GENERATED: ${path.join(CONFIG.outputDir, 'preview-micro-universe-009.png')}`);

    } catch (e) {
        console.error('Preview Failed:', e);
    } finally {
        await browser.close();
    }
}

generatePreview();
