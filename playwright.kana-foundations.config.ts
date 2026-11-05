import {defineConfig,devices} from '@playwright/test';

const origin='http://127.0.0.1:4177';
export default defineConfig({
 testDir:'./prototypes/kana-foundations/e2e',
 fullyParallel:true,retries:process.env.CI?1:0,reporter:'list',
 use:{baseURL:origin,trace:'retain-on-failure'},
 projects:[
  {name:'desktop-chromium',use:{...devices['Desktop Chrome']}},
  {name:'android-mobile',use:{...devices['Pixel 7']}},
  {name:'compact-mobile',use:{browserName:'chromium',viewport:{width:320,height:700},isMobile:true,hasTouch:true}},
  {name:'desktop-firefox',use:{...devices['Desktop Firefox']}},
  {name:'desktop-webkit',use:{...devices['Desktop Safari']}},
  {name:'ios-webkit',use:{...devices['iPhone 13']}}
 ],
 webServer:{
  command:'python3 -m http.server 4177 --bind 127.0.0.1 --directory prototypes/kana-foundations',
  url:origin+'/index.html',reuseExistingServer:!process.env.CI,timeout:20_000
 }
});