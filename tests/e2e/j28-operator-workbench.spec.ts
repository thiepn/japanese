import {expect,test} from '@playwright/test';
import {DOMAINS,renderOperatorHtml} from '../../scripts/j28-independent-custody.mjs';
const report={
 schema:'thiepn-japanese-j28-operator-workbench',version:1,
 candidateCommit:'a'.repeat(40),j27ReportDigest:'c'.repeat(64),j27MachineChainRoot:'d'.repeat(64),
 domains:DOMAINS.map(kind=>({kind,label:kind,status:'OPEN'})),
 humanAcceptanceGranted:false,releaseAuthorized:false,mergeAuthorized:false,deploymentAuthorized:false,
 decision:'BLOCKED_INDEPENDENT_EXTERNAL_ACCEPTANCE_AND_RELEASE_AUTHORITY'
};
test('J28 read-only workbench shows nine open gates and no release controls',async({page})=>{
 await page.setContent(renderOperatorHtml(report));
 await expect(page.getByRole('heading',{name:'Japanese · J28 operator acceptance'})).toBeVisible();
 await expect(page.getByRole('status')).toContainText('BLOCKED');
 await expect(page.getByRole('table')).toBeVisible();
 await expect(page.getByRole('row')).toHaveCount(10);
 await expect(page.getByText('0 / 42 cases; 0 / 126 PNGs')).toBeVisible();
 expect(await page.getByRole('button').count()).toBe(0);
 await expect(page.getByRole('heading',{name:'Required human decision'})).toBeVisible();
});
test('J28 operator workbench stays readable on mobile and under 200% zoom',async({page})=>{
 await page.setViewportSize({width:320,height:700});
 await page.setContent(renderOperatorHtml(report));
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
 expect(overflow).toBeLessThanOrEqual(1);
 await page.evaluate(()=>{document.documentElement.style.zoom='2'});
 await expect(page.getByRole('heading',{name:'Japanese · J28 operator acceptance'})).toBeVisible();
 expect(await page.getByRole('button').count()).toBe(0);
});
