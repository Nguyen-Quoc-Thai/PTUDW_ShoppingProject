require("dotenv").config();

const request = require("request-promise");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

const connectDB = require("./config/db");
const Product = require("./models/product.model");

const BASE_URL = "https://phongvu.vn";

process.setMaxListeners(0);

(async () => await connectDB())();

const getAllCategory = async () => {
  try {
    const html = await request.get(BASE_URL);
    const $ = cheerio.load(html);

    return $("div[data-content-region-name='megaMenu']")
      .map((index, item) => {
        const el = $(item);

        return {
          category: el.attr("data-content-name"),
          href: BASE_URL + el.children("a").attr("href"),
        };
      })
      .get()
      .reverse()
      .slice(1);
  } catch (error) {
    console.log(error.message);
  }
};

const getAllLinkProductOfPage = async (url, nthPage) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);
    await page.goto(url + `&page=${nthPage}`, { waitUntil: "networkidle2" });
    const html = await page.content();
    await page.close();

    const $ = cheerio.load(html);

    return $("a.css-1rhapru")
      .map((index, item) => {
        const el = $(item);
        return BASE_URL + el.attr("href");
      })
      .get();
  } catch (error) {
    console.log(error.message);
  }
};

const getProductDetails = async (url) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);
    await page.goto(url, { waitUntil: "networkidle2" });
    const html = await page.content();
    await page.close();

    const $ = cheerio.load(html);

    const result = {};

    // Images
    result.images = $("div.css-bkflzc")
      .children()
      .map((index, item) => {
        const el = $(item);
        return el.children("img").attr("src");
      })
      .get();

    // Basic info
    result.name = $("div.css-1jpdzyd").text();
    result.producer = $("div.css-5nimvs").children("a").text();
    result.code = $("div.css-5nimvs").text().split(" ").reverse()[0];

    result.price = $("div.css-1etdbj7").children("span").text();
    result.oldPrice = $("span.css-11dop4x").text();

    result.quantity = $("div.css-1wn7dgo").text().split(" ")[2] || 0;
    result.promotion = {
      code: $("div.css-1rggx5t").find("strong").text(),
      desc: $("span.css-15lsrru").text(),
      link: $("div.css-1rggx5t").find("a").attr("href"),
    };

    // Details info
    result.details = {};
    const details = $("span.css-6z2lgz")
      .map((index, item) => {
        const el = $(item);

        const elKey = el.text();
        const elVal = el.parent().find("div.css-111s35w").text();

        return {
          [elKey]: elVal,
        };
      })
      .get();

    details.forEach((item) => {
      result.details[Object.keys(item)[0]] = item[Object.keys(item)[0]];
    });

    // Description
    result.descriptions = $("div.css-111s35w")
      .children()
      .map((index, item) => {
        const el = $(item);

        if (!["h2", "h3"].includes(el["0"].name)) return 0;

        let content = "";
        let cursorContent = el.next();

        while (cursorContent["0"] && cursorContent["0"].name === "p") {
          content += cursorContent.text();
          content += "\n";
          cursorContent = cursorContent.next();
        }

        return {
          title: el.find("strong").text() || el.text(),
          content,
          img: cursorContent.find("img").attr("src") || "",
        };
      })
      .get()
      .filter((ele) => ele !== 0);

    return result;
  } catch (error) {
    console.log(error.message);
  }
};
