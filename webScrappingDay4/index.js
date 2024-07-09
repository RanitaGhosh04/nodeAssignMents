const axios = require('axios')
const cheerio = require('cheerio')
const xlsx = require('xlsx')
const fs = require('fs')
const pageUrl = 'https://www.amazon.in/s?k=phone&crid=1UZM8ZZ5KFBY1&sprefix=phon%2Caps%2C236&ref=nb_sb_noss_2'

const getPageData = async () => {
    try{
        const response = await axios.get(pageUrl)
        // console.log(response);
        const data = response.data
        console.log(data);

        const pageData = data
        const $ = cheerio.load(pageData.toString())

        const titles = $('.a-size-medium.a-color-base.a-text-normal')

const prices = $('.a-price-whole')

const ratings = $('.a-icon.a-icon-star-small')

const availabilities = $(".a-color-price");

const titlesData = []
const pricesData = []
const ratingsData = []
const availabilitiesData = []

titles.each((index,element)=>{
    const title = $(element).text()
    // console.log(title);
    titlesData.push(title)
})


prices.each((index,element)=>{
    const price = $(element).text()
    // console.log(price);
    pricesData.push(price)
})

ratings.each((index,element)=>{
    const rating = $(element).text()
    ratingsData.push(rating)
})

availabilities.each((index,element)=>{
    const availability = $(element).text()
    availabilitiesData.push(availability)
})

const productsJson = titlesData.map((title,index)=>{
    return{
        title,
        price : pricesData[index],
        rating : ratingsData[index],
        availability : availabilitiesData[index]
    }
})


// make workbook

const workBook = xlsx.utils.book_new()

// make sheet

const sheet = xlsx.utils.json_to_sheet(productsJson)

// attach workbook to the sheet

xlsx.utils.book_append_sheet(workBook,sheet,'Products')

// make a xlsx file

xlsx.writeFile(workBook,'Products.xlsx')

console.log('File saved successfully to excel!');

    }

    catch (err) {
        console.log(err);
    }
}

 getPageData()
