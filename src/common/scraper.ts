const puppeteer = require('puppeteer');

export const scraper:any = async (url: string) => {
  return await new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(url);
      resolve(page)
    } catch (error) {
      reject(error)
    }
  });
}