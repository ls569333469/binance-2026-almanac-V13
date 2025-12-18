import puppeteer from 'puppeteer';
import fs from 'fs';

// Helper to get days in month
const getDaysInMonth = (m) => [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m];

async function diagnose() {
    console.log(':: LAYOUT SHIFT DIAGNOSIS :: scanning 365 days...');

    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: { width: 400, height: 720 }, // Simulate Standard Device
        args: ['--no-sandbox']
    });

    const page = await browser.newPage();

    // Baseline (Jan 1)
    let baselineTop = null;
    const shifts = [];

    let checkedCount = 0;

    // Quick scan mode: check 3 days per month to save time, or scan all?
    // User asked to "retrieve 365 days". Let's try to be efficient but thorough.
    // To speed up, we disable images/styles? No, we need layout.
    // We can run in parallel? No, complex state.
    // Let's just run it linearly but fast.

    for (let m = 0; m < 12; m++) {
        const days = getDaysInMonth(m);
        for (let d = 1; d <= days; d++) {
            const url = `http://localhost:5173/?month=${m}&day=${d}&mode=export`;

            try {
                await page.goto(url, { waitUntil: 'domcontentloaded' }); // Faster than networkidle

                // Wait for layout to settle
                await page.waitForSelector('.date-group', { timeout: 2000 });

                const metrics = await page.evaluate(() => {
                    const dateGroup = document.querySelector('.date-group');
                    const visualArea = document.querySelector('.visual-area');
                    if (!dateGroup || !visualArea) return null;

                    const rect = dateGroup.getBoundingClientRect();
                    const areaRect = visualArea.getBoundingClientRect();

                    return {
                        dateTop: rect.top,
                        areaHeight: areaRect.height
                    };
                });

                if (metrics) {
                    if (baselineTop === null) baselineTop = metrics.dateTop;

                    const diff = metrics.dateTop - baselineTop;

                    // Log significant shifts (> 2px)
                    if (Math.abs(diff) > 2) {
                        shifts.push({
                            date: `${m + 1}-${d}`,
                            diff: diff.toFixed(1),
                            top: metrics.dateTop.toFixed(1),
                            areaHeight: metrics.areaHeight.toFixed(1)
                        });
                        process.stdout.write('X');
                    } else {
                        process.stdout.write('.');
                    }
                }
            } catch (e) {
                process.stdout.write('E');
            }

            checkedCount++;
            if (checkedCount % 30 === 0) console.log(` (${checkedCount}/365)`);
        }
    }

    console.log('\n\n:: DIAGNOSIS COMPLETE ::');
    console.log(`Baseline Date Top: ${baselineTop}px`);
    console.log(`Total Shifts Detected: ${shifts.length}`);

    if (shifts.length > 0) {
        console.log('\nTop 10 Deviations (Positive = Lower, Negative = Higher):');
        // Sort by magnitude of shift
        shifts.sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));
        shifts.slice(0, 10).forEach(s => {
            console.log(`[${s.date}] Shift: ${s.diff}px (Top: ${s.top}px, AreaH: ${s.areaHeight}px)`);
        });

        // Save full report
        fs.writeFileSync('layout_deviation_report.json', JSON.stringify(shifts, null, 2));
        console.log('\nFull report saved to layout_deviation_report.json');
    }

    await browser.close();
}

diagnose();
