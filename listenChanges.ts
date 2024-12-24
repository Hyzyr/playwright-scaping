import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

const URL_LINK = `https://www.zillow.com/rental-manager/market-trends`;
const API_ENDPOINT = '**/marketPages';

export type housesStatistics = {
  medianRent: number;
  monthlyChange: number;
  yearlyChange: number;
  availableRentals: number;
  avgDaysOnMarket: number;
};
export type listHousesStatistics = {
  [key: string]: housesStatistics;
};

const main = async (): Promise<listHousesStatistics> => {
  const browser = await chromium.launch({
    headless: false,
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  const results: listHousesStatistics = {};

  await page.goto(URL_LINK);

  const listenChanges = async () => {
    const response = await page.waitForResponse(API_ENDPOINT, { timeout: 0 });
    
    if (response.status() === 200) {
      // Extract the response data here
      const resData = await response.json();
      const data = resData?.data?.marketPage;

      if (data?.areaName && data?.summary && data.summary?.avgDaysOnMarket) {
        results[`${data.areaName}`] = {
          medianRent: data.summary.medianRent ?? 0,
          monthlyChange: data.summary.monthlyChange ?? 0,
          yearlyChange: data.summary.yearlyChange ?? 0,
          availableRentals: data.summary.availableRentals ?? 0,
          avgDaysOnMarket: data.summary.avgDaysOnMarket ?? 0,
        };

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
