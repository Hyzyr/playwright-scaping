const { chromium } = require('playwright-extra');

const stealth = require('puppeteer-extra-plugin-stealth')();
chromium.use(stealth);

const main = async () => {
  const browser = await chromium.launch({
    headless: false,
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  const results = {};

  await page.goto(`https://www.zillow.com/rental-manager/market-trends`);

  const listenChanges = async () => {
    const response = await page.waitForResponse('**/marketPages', {
      timeout: 0,
    });
    if (response.status() === 200) {
      // Extract the response data here
      const resData = await response.json();
      const data = resData?.data?.marketPage;

      if (data?.areaName && data?.summary) {
        results[data.areaName] = data.summary;
        console.log(`=>>>> ${data.areaName} `);
        console.log(data.summary);
        console.log(`<<<<= `);
      }
    }

    await listenChanges();
  };

  try {
    await listenChanges();
  } catch (error) {
    // ignore errors
  }
  return results;
};

main().then((res) => {
  console.log('\n\n\n RESULT >>');
  console.log(res);
});
