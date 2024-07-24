import express from 'express'
import { nanoid } from 'nanoid'
import fs from 'fs'
import { fileURLToPath } from "url";
import path from "path";

// check whether valid url
const isUrlValid = (url) => {
  try{
    new URL(url)
    return true
  }
  catch(err)
  {
    return false
  }
}

// create server
const app = express()

// to not get undefined in req.body
app.use(express.json())

// show the html form on the browser using nodejs
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// to get the data of the file 
app.get("/", (req, res) => {

  // send to browser
  res.sendFile(__dirname + "/urlform.html");
});

// 1. Make short Url API
app.post("/shorten",(req,res)=>{

  // is the url valid
  const isValidUrl = isUrlValid(req.body.longUrl);
  if (!isValidUrl) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid longUrl",
    });
  }

  
  // get longUrl from body
  // console.log(req.body.longUrl);
  const shortUrl = nanoid(5)

  // to not loose the previous data store somewhere
   // to not get in buffer form, do in string form
  const urlsFromFile = fs.readFileSync('urls.json',{encoding : 'utf-8'})

  // to get in json format
  const urlsJson = JSON.parse(urlsFromFile)

  // console.log(urlsJson);

  // to identify whic short url belongs to which long url we need to store it somewhere
  // const urls = [
  //   {
  //     // shortUrl : longUrl

  //     // since shorturl is dynamic therefore it is in []
  //     [shortUrl] : req.body.longUrl
  //   }
  // ]

  // the part can be replaced

  // to add the new url
  urlsJson[shortUrl] = req.body.longUrl
  
  // whenever we store in file, we store in the form of string
  // write the updated data in the file
  fs.writeFileSync('urls.json',JSON.stringify(urlsJson))

  res.json({
    success : true,
    data : `http://localhost//10000/${shortUrl}`
  })
})


// 2. Make short to long Url API
app.get('/:shortUrl',(req,res)=>{
  console.log(req.param.shortUrl);

  // to get the long url against the short url
  const {shortUrl} = req.params

  const urls = fs.readFileSync('urls.json',{encoding : 'utf-8'})
  const urlsJson = JSON.parse(urls)

  // get the long url agaist short url
  const longUrl = urlsJson[shortUrl]
  console.log(longUrl);

  // res.json({
  //   success : true,
  //   message : 'Long Url'
  // })

  // redirect the short url to long url
  res.redirect(longUrl)
})


// port joining
app.listen(10000,()=>console.log('Server is up and running at port 10000'))