const request = require('request')
const siteSelectors = require('./trackerslist.js')

const search = (tracker, searchQuery, callback) => {

    const customUserAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36"
    const headers = {'User-Agent': customUserAgent}

    let trackerFound = siteSelectors.find((element) => element.tracker === tracker)

    if (!trackerFound){
        callback('No tracker with this name (failed in piratebay.js)', undefined)
        return
    }

    const fullSearchString = trackerFound.searchURL + encodeURIComponent(searchQuery)
    const {resultsPageExtractor, individualResultParser} = trackerFound

    request({uri: fullSearchString, headers}, (error, response) => {
        if (error){
            console.log(error)
            callback('Error connecting to tracker. Site may be down.', undefined)
        } else if (error){
            console.log('unknown error')
        } else {

            let resultsArray = []

            if (resultsPageExtractor.type === 'regex'){

                let RegexResultsPattern = new RegExp(resultsPageExtractor.regex, "gs")
                let resultsMatches = response.body.match(RegexResultsPattern)

                // Building regexps for parsing individual search results
                let ResultPatternDesc = new RegExp(individualResultParser.description.regularExpression, "s")
                let ResultPatternSize = new RegExp(individualResultParser.size.regularExpression, "s")
                let ResultPatternMagnetLink = new RegExp(individualResultParser.magnetLink.regularExpression, "s")
                let ResultPatternSeeders = new RegExp(individualResultParser.seeders.regularExpression, "gs")
                let ResultPatternLeechers = new RegExp(individualResultParser.leechers.regularExpression, "gs")

                for (let result in resultsMatches){
                    
                    let resultObject = {
                        description: resultsMatches[result].match(ResultPatternDesc)[1] || "ERROR",
                        magnetLink: resultsMatches[result].match(ResultPatternMagnetLink)[1] || "ERROR",
                        size: resultsMatches[result].match(ResultPatternSize)[1] || "ERROR",
                        seeders: resultsMatches[result].match(ResultPatternSeeders)[0] || "ERROR",
                        leechers: resultsMatches[result].match(ResultPatternLeechers)[1] || "ERROR",
                    }

                    // Perform any additional "post transforms" on the extracted fields
                    // These come from the postTransforms property on the trackers in the JSON
                    for (let individualResultField of Object.keys(individualResultParser)){

                        if (individualResultParser[individualResultField].postTransforms){
                            
                            for (let postTransform of individualResultParser[individualResultField].postTransforms){
                                if (postTransform.type === 'replace'){
                                    resultObject[individualResultField] = resultObject[individualResultField].replace(postTransform.match, postTransform.substitution)
                                }
                                if (postTransform.type === 'prepend'){
                                    resultObject[individualResultField] = postTransform.value + resultObject[individualResultField] 
                                }
                                if (postTransform.type === 'append'){
                                    resultObject[individualResultField] = resultObject[individualResultField] + postTransform.value
                                }
                            }

                        }
                    }

                    // Add this search result item onto the result set
                    resultsArray.push(resultObject)
                }
            }
            
            callback(undefined, resultsArray)
        }
    })
}

module.exports = search