import {defineConfig,devices} from '@playwright/test';

const port=4183;
const root=process.env.KANA_AUDIO_REVIEW_DIR;
if(!root)throw Error('KANA_AUDIO_REVIEW_DIR is required for isolated audio review');

export default defineConfig({
 testDir:'./prototypes/kana-foundations/audio-review',
 fullyParallel:false,
 reporter:'list',
 retries:0,
 workers:1,
 use:{baseURL:'http://127.0.0.1:'+port,trace:'retain-on-failure'},
 projects:[
  {name:'audio-chromium',use:{...devices['Desktop Chrome']}},
  {name:'audio-firefox',use:{...devices['Desktop Firefox']}},
  {name:'audio-webkit',use:{...devices['Desktop Safari']}},
 ],
 webServer:{
  command:'python3 -m http.server '+port+' --bind 127.0.0.1 --directory '+JSON.stringify(root),
  url:'http://127.0.0.1:'+port+'/index.html',
  reuseExistingServer:false,
  timeout:20000
 }
});
