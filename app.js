const xlsx = require("xlsx");
const cheerio = require("cheerio")
const { log } = console;
const excelfile = xlsx.readFile(
    "C:/Users/miewone/Documents/카카오톡 받은 파일/instagram_review_1_가공.xlsx"
);
const fs =require("fs");
const puppeteer = require("puppeteer")

const sheetName = excelfile.SheetNames[0];
const firstSheet = excelfile.Sheets[sheetName];

const jsonData = xlsx.utils.sheet_to_json(firstSheet, { defval: "" });

const go = async(data) => {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const returnValue= [];
    // await page.click("#search\\.keyword\\.query");
    for(let obj=0;obj<data.length;obj++)
    {
        await page.goto("https://map.kakao.com/");
        if(!(data[obj]['관광상품명']))
        {
            continue;
        }
        log(data[obj]['관광상품명'],"검색 >>>>\n");
        const tt = data[obj]['관광상품명'];
        await page.evaluate( () => document.getElementById("search.keyword.query").value = "")
        await page.type("#search\\.keyword\\.query",tt)
        await page.keyboard.press("Enter");
        await page.waitForTimeout(100);
        // page.on('request', req => {
        //     if (req.resourceType() === 'xhr')
        //         log(req);
        //     else if(req.resourceType() ==='script')
        //         log(req);
        // });
        page.on('response',async res => {
            
            if (res.request().resourceType() === 'xhr') {
                res.text().then((text) => {
                    const replaceText = text.replace(/(\\r)(\\n)|\\/gm,"");
                    returnValue.push(
                        text
                    )
                })
            }
            else if(res.request().resourceType() === 'script') {
                log(res.url())
                if(res.url().includes("https://search.map.daum.net/mapsearch")){
                    res.text().then((text) => {
                        const replaceText = text.replace(/(\\r)(\\n)|\\/gm,"");
                        returnValue.push(
                            JSON.stringify()
                        )
                    })
                }

            }
        });


        const html = await page.content();
        log("===========================\n ")
    }
    log(returnValue);
    const file = "restaurnat.txt";
    fs.createWriteStream(file);
    returnValue.forEach((ele) => {
        fs.appendFileSync(file,JSON.stringify(ele)+"\n");
    })
    await browser.close();
    return returnValue;
}
const restaurant = []
const rooms = []
const event = []
const tourist = []
jsonData.forEach((ele) => {
    switch(ele['관광상품분류'])
    {
        case "음식점" :
            restaurant.push(ele)
            break;
        case "관광지" :
            tourist.push(ele)
            break;
        case "행사" :
            event.push(ele)
            break;
        case "숙소" :
            rooms.push(ele)
            break;
    }
});

const writeData = go(restaurant);

