import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

// Configuration
const CONFIG = {
    baseUrl: 'http://localhost:5173',
    outputDir: './dist/preview',
    viewport: { width: 3840, height: 2160 }
};

if (!fs.existsSync(CONFIG.outputDir)) fs.mkdirSync(CONFIG.outputDir, { recursive: true });

async function generatePreview() {
    console.log(':: MICRO-UNIVERSE PREVIEW :: Initializing...');

    // Launch Browser with improved color profile support
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: CONFIG.viewport,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--force-color-profile=srgb', // Force consistent color rendering
            '--font-render-hinting=none'  // Improve text sharpness
        ]
    });

    const page = await browser.newPage();
    // Ultra-High DPI
    await page.setViewport({ ...CONFIG.viewport, deviceScaleFactor: 3 });

    try {
        console.log('Navigating to 2026-05-20 (520)...');
        // Increase timeout for heavier page load at high DPI
        await page.goto(`${CONFIG.baseUrl}/?month=4&day=20`, { waitUntil: 'networkidle0', timeout: 60000 });

        await page.waitForSelector('.crystal-card');
        await new Promise(r => setTimeout(r, 3000)); // Extended Render wait for textures

        console.log('Applying Micro-Universe V4 (Device Standard)...');

        await page.evaluate(() => {
            const card = document.querySelector('.crystal-card');
            if (!card) return;

            // 1. Capture exact styles
            const bodyStyle = window.getComputedStyle(document.body);
            const universeBg = bodyStyle.backgroundImage;
            // Explicitly force black to avoid transparency arithmetic errors
            const universeColor = '#000000';

            // 2. Freeze Interactions & Normalize Global
            const styleCheck = document.createElement('style');
            styleCheck.innerHTML = `
                .crystal-card { 
                    transform: none !important; 
                    transition: none !important; 
                    margin: 0 !important;
                    /* FORCE STANDARD SIZE (iPhone Pro Width-ish scaled) */
                    width: 400px !important;
                    height: 720px !important;
                    max-width: none !important;
                    max-height: none !important;
                    /* Tone down brightness to fix overexposure */
                    backdrop-filter: blur(30px) brightness(1.0) !important;
                }
                .crystal-card:hover { transform: none !important; }
                body { overflow: hidden !important; }
                * { -webkit-font-smoothing: antialiased; }
            `;
            document.head.appendChild(styleCheck);

            // 3. Create DEVICE CONTAINER (The Wrapper)
            // This represents the "Phone Screen" boundary
            const wrapper = document.createElement('div');
            wrapper.id = 'micro-universe-wrapper';
            wrapper.style.position = 'relative';
            // Fixed dimensions equal to the card
            wrapper.style.width = '400px';
            wrapper.style.height = '720px';
            wrapper.style.margin = '50px'; // Breathing room for screenshots
            // We do NOT overflow hidden here if we want shadows. 
            // The user Red Line suggests they want the CARD structure.
            // Let's keep shadows but ensure the LAYERS match perfectly.

            // 4. Create BACKPLANE (The Stars)
            // Absolute positioning guarantees it sits exactly behind the card
            const bgLayer = document.createElement('div');
            bgLayer.style.position = 'absolute';
            bgLayer.style.top = '0';
            bgLayer.style.left = '0';
            bgLayer.style.width = '100%';
            bgLayer.style.height = '100%';
            bgLayer.style.borderRadius = '32px'; // Match card
            bgLayer.style.overflow = 'hidden';   // Clip stars
            bgLayer.style.zIndex = '-1';

            // Visuals
            bgLayer.style.backgroundColor = universeColor;
            bgLayer.style.backgroundImage = universeBg;
            bgLayer.style.backgroundAttachment = 'fixed';
            bgLayer.style.backgroundPosition = 'center top';
            bgLayer.style.backgroundSize = '100vw 100vh';
            bgLayer.style.backgroundRepeat = 'no-repeat';

            // 5. STACKING
            // Insert Wrapper
            card.parentNode.insertBefore(wrapper, card);
            // Move Elements into Wrapper
            wrapper.appendChild(bgLayer);
            wrapper.appendChild(card); // Card sits naturally on top (position: relative or static doesn't matter if size matches)

            // Force Card to fill Wrapper (Double Safety)
            card.style.position = 'absolute';
            card.style.top = '0';
            card.style.left = '0';
            card.style.width = '100%';
            card.style.height = '100%';

            // 6. Global Cleanup
            document.body.style.background = 'transparent';
            const hub = document.querySelector('.frozen-light-hub');
            if (hub) hub.style.display = 'none';
        });

        const wrapperHandle = await page.$('#micro-universe-wrapper');

        console.log('Capturing Snapshot V4...');
        await wrapperHandle.screenshot({
            path: path.join(CONFIG.outputDir, 'preview-micro-universe-004.png'),
            omitBackground: true
        });

        console.log(`\nPREVIEW GENERATED: ${path.join(CONFIG.outputDir, 'preview-micro-universe-004.png')}`);

    } catch (e) {
        console.error('Preview Failed:', e);
    } finally {
        await browser.close();
    }
}

generatePreview();
