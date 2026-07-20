import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.text().includes('RECEIVED EVENT') || msg.text().includes('SOCKET CONNECTED') || msg.type() === 'error') {
      console.log('BROWSER LOG:', msg.text());
    }
  });

  console.log('Navigating to signup...');
  await page.goto('http://localhost:5173/signup');
  
  console.log('Waiting for inputs...');
  await page.waitForSelector('#name');
  
  console.log('Registering new user...');
  await page.type('#name', 'Test User');
  await page.type('#email', `test_${Date.now()}@example.com`);
  await page.type('#password', 'password123');
  await page.click('button[type="submit"]');

  console.log('Waiting for dashboard navigation...');
  await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 15000 }).catch(e => console.log('Navigation timeout, continuing...'));
  
  console.log('URL is now:', page.url());

  // Wait 15 seconds to collect console logs from React app
  console.log('Waiting 15 seconds to observe React Socket events...');
  await new Promise(r => setTimeout(r, 15000));
  
  await browser.close();
  console.log('Done.');
})();
