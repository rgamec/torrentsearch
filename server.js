const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const trackersearch = require('./lib/trackersearch.js')
const responseTime = require('response-time') // to test Redis performance

app.set('view engine', 'hbs')
const  urlencodedParser = bodyParser.urlencoded({ extended: false })

const viewConfig = {
    applicationPath: '/torrentsearch/'
}

app.use(responseTime());


app.get('/', (req, res) => {
    res.render('index', {viewConfig})
})

app.post('/search', urlencodedParser, (req, res) => {
    console.log("Received response from form: " + req.body.search)

    trackersearch('piratebay', req.body.search, (error, response) => {
        if (error){
            res.send("Error:", error)
        } else {
            console.log(response.length + " results retrieved from " + "the piratebay" + " (showing top five): ")
            res.render('searchresults', {searchquery: req.body.search, searchresults: response})
        }
    })
})

app.get('*', (req, res) => {
    res.status(404).send("File not found - tried to retrieve " + req.path)
})

app.listen(process.env.PORT || 3000)