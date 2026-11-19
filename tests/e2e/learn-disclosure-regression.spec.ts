import {expect,test} from "@playwright/test";
import {openFullCourse,openOtherLessons} from "./helpers/learn-disclosure";

test("Learn keeps deliberately expanded practice tools when returning from a lesson",async({page})=>{
 await page.goto("./");
 await page.getByRole("button",{name:"Learn",exact:true}).click();
 const details=page.locator("details.beginner-explore");
 await expect(details).toBeVisible();
 await expect(details).not.toHaveAttribute("open","");
 await openFullCourse(page);
 await expect(page.getByRole("heading",{name:"Your Japanese journey"})).toBeVisible();
 await page.locator(".j4-landmark").first().getByRole("button",{name:/Enter landmark|Continue landmark|Review landmark|Study anyway/}).click();
 await expect(page.locator("main.j5-study-shell")).toBeVisible();
 await page.getByRole("button",{name:"Exit"}).click();
 await expect(details).toHaveAttribute("open","");
 await expect(page.getByRole("heading",{name:"Your Japanese journey"})).toBeVisible();
 await details.locator(":scope > summary").click();
 await expect(details).not.toHaveAttribute("open","");
 await page.getByRole("button",{name:"Today",exact:true}).click();
 await page.getByRole("button",{name:"Learn",exact:true}).click();
 await expect(details).not.toHaveAttribute("open","");
 await openOtherLessons(page);
 await expect(page.getByRole("region",{name:"Your learning path"})).toBeVisible();
});
