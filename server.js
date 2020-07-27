const express = require('express')
const request = require('request')
const bodyParser =require('body-parser')

const app = express()

const apiKey = '661f54576e18a9d0a1566c9d5d534e78'
let units = 'metric'

app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended:true}))

app.set('view-engine', 'ejs')
app.get('/', (reg, res) => {
    res.render('index.ejs',{
        tempInfo: null,
        error: null,
        description:null,
        images: null
    })
})

app.post('/', (req, res) => {
    let city = req.body.city
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`

    request(url, (err, response, body) => {
        if(err) {
            console.log('ERROR MIT API CONNECTION', err)
            res.render('index.ejs', {
                tempInfo:null,
                error:"Connection ERROR, PLEASE TRY AGAIN",
                description: null,
                images: null
            })
        }else{
                let weather = JSON.parse(body)
            if (weather.main === undefined){
                res.render('index.ejs', {
                    error: 'Error, your city is not defiendet',
                    tempInfo: null,
                    description: null,
                    images: null
                })
            }else {
                  console.log(weather)
                let temp = weather.main.temp
                let description = weather.weather[0].description
                const images = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
            res.render('index.ejs', {
                tempInfo: temp,
                description: `Your Weather in ${city} is ${temp} C° and ${description}`,
                images: images,
                error: null
            })
            }
        }
    })
})

app.listen(3000, () => {
    console.log('server is running')
})