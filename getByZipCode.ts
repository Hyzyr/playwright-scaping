import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import { Page } from 'playwright';

chromium.use(stealth());

// {%zipCode%} is placeholder to replace
const URL_LINK = `https://www.zillow.com/rental-manager/market-trends/{%zipCode%}/?propertyTypes=house`;

const medianRentTitle = 'Median Rent';
const monthlyChangeTitle = 'Month-Over-Month Change';
const yearlyChangeTitle = 'Year-Over-Year Change';
const availableRentalsTitle = 'Avg. Days On Market';
const avgDaysOnMarketTitle = 'Available Rentals';

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
const locateByTitle = async (page: Page, title: string) => {
  const paragraph = page.getByText(title, { exact: true });
  const div = paragraph.locator('..');
  return (await div.locator('p').textContent()) ?? '';
};
const main = async (zipCode: string | number): Promise<housesStatistics> => {
  const browser = await chromium.launch({
    headless: false,
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(URL_LINK.replace('{%zipCode%}', zipCode.toString()));

  //   await page.getByPlaceholder('Search by city or ZIP').click();
  //   await page.getByPlaceholder('Search by city or ZIP').fill(zipCode.toString());
  //   await page.getByText(zipCode.toString()).click();
  //   await page.getByRole('button', { name: 'All home types' }).click();
  //   await page.getByRole('menuitem', { name: 'Houses' }).click();

  const medianRent = await locateByTitle(page, medianRentTitle);
  const monthlyChange = await locateByTitle(page, monthlyChangeTitle);
  const yearlyChange = await locateByTitle(page, yearlyChangeTitle);
  const avgMarketDays = await locateByTitle(page, availableRentalsTitle);
  const availableRentals = await locateByTitle(page, avgDaysOnMarketTitle);
  
  context.close();
  browser.close();

  return {
    medianRent: pureNumber(medianRent),
    monthlyChange: pureNumber(monthlyChange),
    yearlyChange: pureNumber(yearlyChange),
    avgDaysOnMarket: pureNumber(avgMarketDays),
    availableRentals: pureNumber(availableRentals),
  };
};

main(33129).then((res) => console.log(res));
