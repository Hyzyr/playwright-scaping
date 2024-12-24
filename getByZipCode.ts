import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

// {%zipCode%} is placeholder to replace
const URL_LINK = `https://www.zillow.com/rental-manager/market-trends/{%zipCode%}/?propertyTypes=house`;

export type housesStatistics = {
  medianRent: number;
  monthlyChange: number;
  yearlyChange: number;
  availableRentals: number;
  avgDaysOnMarket: number;
};

const pureNumber = (value: string): number => {
  return parseFloat(`${value}`.replace('$', '').replace(',', ''));
};

const main = async (zipCode: string | number): Promise<housesStatistics> => {
  const browser = await chromium.launch({
    headless: false,
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  // await page.goto(URL_LINK);
  await page.goto(URL_LINK.replace('{%zipCode%}', zipCode.toString()));

  //   await page.getByPlaceholder('Search by city or ZIP').click();
  //   await page.getByPlaceholder('Search by city or ZIP').fill(zipCode.toString());
  //   await page.getByText(zipCode.toString()).click();
  //   await page.getByRole('button', { name: 'All home types' }).click();
  //   await page.getByRole('menuitem', { name: 'Houses' }).click();

  const medianRent =
    (await page
      .locator('.styles__StatContainer-sc-1wabw3l-0.dlstUI:nth-child(1)  > p')
      .textContent()) ?? '';
  const monthlyChange =
    (await page
      .locator('.styles__StatContainer-sc-1wabw3l-0.dlstUI:nth-child(2)  > p')
      .textContent()) ?? '';
  const yearlyChange =
    (await page
      .locator('.styles__StatContainer-sc-1wabw3l-0.dlstUI:nth-child(3)  > p')
      .textContent()) ?? '';
  const avgMarketDays =
    (await page
      .locator('.styles__StatContainer-sc-1wabw3l-0.dlstUI:nth-child(4)  > p')
      .textContent()) ?? '';
  const availableRentals =
    (await page
      .locator('.styles__StatContainer-sc-1wabw3l-0.dlstUI:nth-child(5)  > p')
      .textContent()) ?? '';

  return {
    medianRent: pureNumber(medianRent),
    monthlyChange: pureNumber(monthlyChange),
    yearlyChange: pureNumber(yearlyChange),
    avgDaysOnMarket: pureNumber(avgMarketDays),
    availableRentals: pureNumber(availableRentals),
  };
};

main(33129).then((res) => console.log(res));
