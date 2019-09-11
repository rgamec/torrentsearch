#!/usr/bin/env node
const yargs = require('yargs')
const chalk = require('chalk')
const commandExistsSync = require('command-exists').sync
const fs = require('fs')
const trackersearch = require('./lib/trackersearch.js')
const prompts = require('prompts')


const version = '0.0.9'
console.log("Now starting TorrentSearch", version)

// Define a couple logging types
const error = (str) => console.log(chalk.red(str))
const verbose = (str) => console.log(str)
const warning = (str) => console.log(str)

// Check if aria2c is available on the system
if (commandExistsSync('aria2c')) {
    //verbose("Aria2c is installed!")
} else {
    error("Sorry, you don't have aria2c installed. Visit https://github.com/aria2/aria2/releases/latest to get it.")
    process.exit(1)
}

// Attempt to open .torrentsearch in home directory
const configFilePath = require('os').homedir() + '/.torrentsearch';

try {
    const configurationDataRaw = fs.readFileSync(configFilePath)
    //verbose("Successfully loaded configuration from " + configFilePath)
    const configurationData = JSON.parse(configurationDataRaw)
    //verbose("Download directory configured: " + configurationData.downloadDirectory)
} catch (e) {
    warning(`Config file at ${configFilePath} could not be found. Beginning initial setup...`)
    // TODO: Add validation (e.g. validate: fs.lstatSync(directory).isDirectory())
    const func = (async () => {
        const response = await prompts({
        type: 'text',
        name: 'directory',
        message: 'Where do you want retrieved .torrent files to be saved to?'
        });
    
        verbose("User entered: " + response.directory);

        // Save above directory to config file
        const torrentSearchInitialConfig = {
            downloadDirectory: response.directory
        }
    
        fs.writeFileSync(configFilePath, JSON.stringify(torrentSearchInitialConfig))

        verbose("Initial configuration written to " + configFilePath)

    })();
}


const searchTracker = (tracker, query) => {
    query = query.slice(1)
                 .join(' ')
    console.log(`Now searching on ${tracker} for "${query}"`)

    trackersearch(tracker, query, (error, response) => {
        if (error){
            console.log("Error:", error)
        } else {
            console.log(response.length + " results retrieved from " + tracker + " (showing top five): ")
            const outputResults = (amount, resultsArray) => {
                let displayed = 1
                for (let result of resultsArray){
                   
                    console.log(`${displayed}. ${result.description} (${result.size}) (S: ${result.seeders} L: ${result.leechers})`)
                    
                    if (displayed++ == amount-1) break
                }
            }
            outputResults(6, response)
        }
    })
}

yargs.version(version)
     .scriptName('Torrentsearch')
     .usage('$0 [search term]')
     .help()
     .argv

yargs.command({
    command: 'piratebay',
    describe: 'Search the Pirate Bay',
    demandOption: true,
    type: 'string'
    ,
    handler(argv){
        searchTracker('piratebay', argv._)
    }
})

yargs.parse()


//  check if aria2c is installed, if not advise how - done
//  Warn if default download dir not set, allow user to enter dir 
//  warn if dir not writeable
//  dir to be saved to .torrentsearch dotfile, warn if unable
//  make request to piratebay with search terms
//  attempt above several times if unsuccessful
//  once we have result, parse page for results
//  if no results, advise and quit
//  otherwise display list of top five results and let user select between them
//  when result selected, call aria2c on the magnet URL and dump torrent file to download dir
//  then rtorrent picks up the rest

// # Parse command line arguments
// # support -feelinglucky switch to download top result
