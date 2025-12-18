import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

/**
 * =============================================================================
 * PROJECT: FROZEN LIGHT - ENGINE B (BATCH GENERATOR V10)
 * PROTOCOL: NATIVE EXPORT + LINEAR GRADIENT SEAMLESS
 * =============================================================================
 */

const CONFIG = {
    // IMPORTANT: Inject ?mode=export to trigger Native Export Protocol
    baseUrl: 'http://localhost:5173',
    outputDir: './dist/frozen_light',
    rawDir: './dist/frozen_light/raw',
    viewport: { width: 3840, height: 2160 },
    daysPerMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    renderWait: 2500, // Slightly increased for safety
    startMonth: 0,
    endMonth: 11
};

// Interactive Control State
let isPaused = false;
let isCancelled = false;

// Setup Key Listener
import readline from 'readline';
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) process.stdin.setRawMode(true);

process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c') {
        process.exit();
    }
    if (key.name === 'q') {
        isCancelled = true;
        process.stdout.write('\n[COMMAND] Quitting after current page...\n');
    }
    if (key.name === 'p') {
        isPaused = !isPaused;
        process.stdout.write(isPaused ? '\n[COMMAND] PAUSED. Press P to resume.\n' : '\n[COMMAND] RESUMED.\n');
    }
});

async function ensureDirs() {
    if (!fs.existsSync(CONFIG.outputDir)) fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    if (!fs.existsSync(CONFIG.rawDir)) fs.mkdirSync(CONFIG.rawDir, { recursive: true });
}

async function generate() {
    console.log(':: ENGINE B (V10) :: INITIALIZING...');
    console.log('   [ Controls: "P" = Pause/Resume | "Q" = Quit ]');
    await ensureDirs();

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

    let totalSaved = 0;

    console.log(`:: ENGINE B :: STARTED. Target: ${CONFIG.viewport.width}x${CONFIG.viewport.height} @ 3x DPI`);

    for (let m = CONFIG.startMonth; m <= CONFIG.endMonth; m++) {
        const days = CONFIG.daysPerMonth[m];
        for (let d = 1; d <= days; d++) {
            // Check Cancellation
            if (isCancelled) break;

            // Check Pause
            while (isPaused) {
                await new Promise(r => setTimeout(r, 500));
                if (isCancelled) break;
            }

            const monStr = String(m + 1).padStart(2, '0');
            const dayStr = String(d).padStart(2, '0');
            const filename = `2026_${monStr}_${dayStr}.png`;
            const filePath = path.join(CONFIG.rawDir, filename);

            process.stdout.write(`\rProcessing: ${monStr}-${dayStr} ... `);

            try {
                // 1. Navigate with mode=export
                await page.goto(`${CONFIG.baseUrl}/?month=${m}&day=${d}&mode=export`, { waitUntil: 'load', timeout: 60000 });

                await page.waitForSelector('.crystal-card');
                await new Promise(r => setTimeout(r, CONFIG.renderWait));

                // 2. Apply V10 Wrapper Logic (Linear Gradient Seamless)
                await page.evaluate(() => {
                    const card = document.querySelector('.crystal-card');
                    if (!card) return;

                    // V10: LINEAR GRADIENT STRATEGY
                    const seamlessGradient = `
                        linear-gradient(to bottom, #151921 0%, #040406 100%), 
                        radial-gradient(circle at 85% 30%, rgba(240, 185, 11, 0.06) 0%, transparent 60%)
                    `;
                    const exactBgColor = '#040406';

                    // Global Cleanup
                    const styleCheck = document.createElement('style');
                    styleCheck.innerHTML = `body { overflow: hidden !important; }`;
                    document.head.appendChild(styleCheck);

                    // Create DEVICE CONTAINER
                    const wrapper = document.createElement('div');
                    wrapper.id = 'micro-universe-wrapper';
                    wrapper.style.position = 'relative';
                    wrapper.style.width = '400px';
                    wrapper.style.height = '720px';
                    wrapper.style.margin = '50px';

                    // Create BACKPLANE
                    const bgLayer = document.createElement('div');
                    bgLayer.style.position = 'absolute';
                    bgLayer.style.top = '0';
                    bgLayer.style.left = '0';
                    bgLayer.style.width = '100%';
                    bgLayer.style.height = '100%';
                    bgLayer.style.borderRadius = '32px';
                    bgLayer.style.overflow = 'hidden';
                    bgLayer.style.zIndex = '-1';

                    // Visuals - V10 SEAMLESS
                    bgLayer.style.backgroundColor = exactBgColor;
                    bgLayer.style.backgroundImage = seamlessGradient;
                    bgLayer.style.backgroundAttachment = 'fixed';
                    bgLayer.style.backgroundPosition = 'center top';
                    bgLayer.style.backgroundSize = '100vw 100vh';
                    bgLayer.style.backgroundRepeat = 'no-repeat';

                    // STACKING
                    // Check if already wrapped? (Batch logic is clean, page reloads each time, so no double wrap risk usually, but be careful)
                    // Since we navigate each time, DOM is fresh.
                    card.parentNode.insertBefore(wrapper, card);
                    wrapper.appendChild(bgLayer);
                    wrapper.appendChild(card);

                    // Force Card to fill Wrapper
                    card.style.position = 'absolute';
                    card.style.top = '0';
                    card.style.left = '0';
                    card.style.width = '100%';
                    card.style.height = '100%';
                    card.style.margin = '0';

                    // Global Cleanup
                    document.body.style.background = 'transparent';
                    const hub = document.querySelector('.frozen-light-hub');
                    if (hub) hub.style.display = 'none';

                    // Hide any navigation arrows
                    const navs = document.querySelectorAll('.hide-on-capture');
                    navs.forEach(n => n.style.display = 'none');
                });

                const wrapperHandle = await page.$('#micro-universe-wrapper');
                if (!wrapperHandle) throw new Error('Wrapper injection failed');

                await wrapperHandle.screenshot({
                    path: filePath,
                    omitBackground: true
                });

            } catch (e) {
                console.error(`\nError on ${monStr}-${dayStr}:`, e);
            }

            totalSaved++;
        }
        if (isCancelled) break;
    }

    console.log(`\n:: ENGINE B :: CAPTURE COMPLETE. Total: ${totalSaved}`);
    await browser.close();
    process.exit(0);
}

generate().catch(console.error);
