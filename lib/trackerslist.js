const trackerlist = [
    {
        tracker: 'piratebay',
        searchURL: "https://thepiratebay.org/s/?q=",
        resultsPageExtractor: {
            type: 'regex',
            regex: '<div class="detName">(.*?)<[\\/]tr>'
        },
        individualResultParser: {
            description: {
                regularExpression: 'title="Details for (.*?)"'
            },
            magnetLink: {
                regularExpression: '<a href="magnet:(.*?)" ',
                postTransforms: [
                    {
                        type: 'prepend',
                        value: 'magnet:'
                    }
                ]
            },
            size: {
                regularExpression: 'Size (.*?), ULed ',
                postTransforms: [
                    {
                        type: 'replace',
                        match: '&nbsp;',
                        substitution: ' '
                    }
                ]
            },
            seeders: {
                regularExpression: '<td align="right">(.*?)</td>',
                postTransforms: [
                    {
                        type: 'replace',
                        match: '<td align="right">',
                        substitution: ''
                    },
                    {
                        type: 'replace',
                        match: '</td>',
                        substitution: ''
                    }
                ]
            },
            leechers: {
                regularExpression: '<td align="right">(.*?)</td>',
                postTransforms: [
                    {
                        type: 'replace',
                        match: '<td align="right">',
                        substitution: ''
                    },
                    {
                        type: 'replace',
                        match: '</td>',
                        substitution: ''
                    }
                ]
            }
        }
    },
    {
        tracker: 'rutracker',
        searchURL: ""
    }
]

module.exports = trackerlist