const { chromium } = require('playwright-extra');

const stealth = require('puppeteer-extra-plugin-stealth')();

chromium.use(stealth)

const main = async (zipCode) => {
  const browser = await chromium.launch({
    headless: false,
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://www.zillow.com/rental-manager/market-trends/');
  await page.goto(
    `https://www.zillow.com/rental-manager/market-trends/${zipCode}/?propertyTypes=house`
  );

  //   await page.getByPlaceholder('Search by city or ZIP').click();
  //   await page.getByPlaceholder('Search by city or ZIP').fill(zipCode.toString());
  //   await page.getByText(zipCode.toString()).click();
  //   await page.getByRole('button', { name: 'All home types' }).click();
  //   await page.getByRole('menuitem', { name: 'Houses' }).click();

  const medianRent = await page
    .locator('.styles__StatContainer-sc-1wabw3l-0.dlstUI:nth-child(1)  > p')
    .textContent();
  const monthly = await page
    .locator('.styles__StatContainer-sc-1wabw3l-0.dlstUI:nth-child(2)  > p')
    .textContent();
  const yearly = await page
    .locator('.styles__StatContainer-sc-1wabw3l-0.dlstUI:nth-child(3)  > p')
    .textContent();
  const avgMarketDays = await page
    .locator('.styles__StatContainer-sc-1wabw3l-0.dlstUI:nth-child(4)  > p')
    .textContent();
  const availableRentals = await page
    .locator('.styles__StatContainer-sc-1wabw3l-0.dlstUI:nth-child(5)  > p')
    .textContent();

  return { medianRent, monthly, yearly, avgMarketDays, availableRentals };
};

main(33129).then((res) => console.log(res));
