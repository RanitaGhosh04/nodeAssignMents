const axios = require('axios');
const fs = require('fs'); // Using fs.promises for async file operations
const cheerio = require('cheerio');
const xlsx = require('xlsx')

const getData = async () => {
    try {
        // const response = await axios.get('https://internshala.com/jobs/software-development-jobs/');
        
        // const html = response.data;
        const html = fs.readFileSync('Data.txt','utf8')

        // console.log(html);

        const $ = cheerio.load(html); // Load HTML content using Cheerio (if needed for further parsing)

        // fs.writeFileSync('Data.txt', html); // Write HTML content to jobsDatas.txt
        
        // console.log('File written successfully.');

        const jobTitles = $('.job-internship-name')

        // console.log(jobName.length);

        const jobTitlesData = []
        const companyNamesData = []
        const locationData = []
        const postedDateData = []
        const experiencesData = []

        jobTitles.each((index,element)=> {
            const jobTitle = $(element).text()
            // console.log(jobTitle);
            jobTitlesData.push(jobTitle)
        })
        
        const companyNames = $('.company-name')
        companyNames.each((index,element)=> {
            const companyName = $(element).text()
            // console.log(companyName);
            companyNamesData.push(companyName)
        })
        
        const locations = $('.row-1-item.locations')
        locations.each((index,element)=> {
            const location = $(element).text()
            // console.log(location);
            locationData.push(location)
        })

        const postedDates = $('.status-inactive  span')
        postedDates.each((index,element)=> {
            const postedDate = $(element).text()
            // console.log(postedDate);
            postedDateData.push(postedDate)
        })

        const experiences = $('.item_body.desktop-text')
        experiences.each((index,element)=> {
            const experience = $(element).text()
            // console.log(experience);
            experiencesData.push(experience)
        })

        const objectJobs = jobTitlesData.map((jobTitle,index)=>{
            return{
                jobTitle,
                companyName : companyNamesData[index],
                location : locationData[index],
                postedDate : postedDateData[index],
                experience : experiencesData[index]
            }
        })

        // console.log(objectJobs);

        const workbook = xlsx.utils.book_new();
    const sheet = xlsx.utils.json_to_sheet(objectJobs);

    xlsx.utils.book_append_sheet(workbook, sheet, "objectJobs");
    xlsx.writeFile(workbook, "objectJobs.xlsx");

    console.log("XLSX file created successfully!");

    } catch (error) {
        console.error('Error:', error);
    }
}

getData();
