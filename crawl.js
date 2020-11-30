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
