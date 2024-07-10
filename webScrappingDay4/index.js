const cheerio = require("cheerio");
const xlsx = require("xlsx");
const axios = require("axios");

const getData = async () => {
    

    const response = await axios.get('https://www.amazon.in/s?k=phone&crid=1FXBLMMMSPCUV&sprefix=phone%2Caps%2C313&ref=nb_sb_ss_pltr-sample-20_2_5')

    const data = response.data

    const $ = cheerio.load(data.toString());

    const titles = $(".a-size-medium.a-color-base.a-text-normal"); // Input -> document.querySelector("TARGETING INFORMATION")

    const titlesData = [];

    titles.each((index, element) => {
      const title = $(element).text();
      titlesData.push(title);
      // products.push({
      //   name: title,
      // });
    });

    const pricesData = [];

    const prices = $(".a-price-whole");
    // console.log(prices);
    prices.each((index, element) => {
      const price = $(element).text();
      // console.log(price);
      pricesData.push(price);
    });

    const ratingsData = [];

    const ratings = $(".a-icon-star-small .a-icon-alt");
        ratings.each((index, element) => {
            const rating = $(element).text().trim();
            ratingsData.push(rating);
        });

        const availabilityData = [];

        const availability = $(".a-color-price");
        availability.each((index, element) => {
            const avail = $(element).text().trim();
            availabilityData.push(avail);
        });

    // console.log(titlesData);
    // console.log(pricesData);

    const productsJson = titlesData.map((title, index) => {
      return {
        title,
        price: pricesData[index],
        rating: ratingsData[index],
        // availability: availabilityData[index]
      };
    });

    // console.log(productsJson);

    const workbook = xlsx.utils.book_new();
    const sheet = xlsx.utils.json_to_sheet(productsJson);

    xlsx.utils.book_append_sheet(workbook, sheet, "Products");
    xlsx.writeFile(workbook, "products.xlsx");


}

getData()