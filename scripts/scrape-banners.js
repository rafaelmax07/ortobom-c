const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: true, // Headless is fine for this
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // Set a realistic viewport and user agent to avoid being blocked or getting mobile version unexpectedly
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    console.log('🕵️‍♀️ Navigating to Ortobom Home...');
    try {
        await page.goto('https://www.ortobom.com.br', { waitUntil: 'networkidle2', timeout: 60000 });

        // Selector for main slider images. 
        // Based on common structures or inspecting previously: often in a "banner" or "slider" container.
        // Ortobom uses Splide or similar. Let's look for large images at the top.

        const banners = await page.evaluate(() => {
            // Try multiple selectors for banners
            const images = Array.from(document.querySelectorAll('img'));

            // Filter for large images likely to be banners (width > 1000)
            const candidates = images.filter(img => {
                const rect = img.getBoundingClientRect();
                return rect.width > 800 && rect.height > 200 && img.src.includes('banner');
            });

            return candidates.map(img => ({
                src: img.src,
                alt: img.alt || 'Banner Ortobom',
                width: img.naturalWidth,
                height: img.naturalHeight
            })).slice(0, 3); // Get top 3
        });

        console.log('✅ Found Banners:', JSON.stringify(banners, null, 2));
    } catch (e) {
        console.error('❌ Error scraping banners:', e);
    }

    await browser.close();
})();
