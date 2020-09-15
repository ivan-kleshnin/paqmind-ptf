let ChildProcess = require("child_process")
let P = require("path")
let fetch = require("node-fetch")
let CSV = require("fast-csv")
let {fetchGraphQL} = require("./lib")

let QUERY = `
  query { 
    search(type: USER, query: "location:usa", first: 50) {
      pageInfo {
        endCursor
      }
      nodes {
        ...on User {
          login
          location
        }  
      }
    }
  }
`

let scraper = ChildProcess.spawn("node", [P.join(__dirname, "2.scrape.js")], {
  stdio: ["pipe", "inherit", "inherit"],
  encoding: "utf-8",
})

fetchGraphQL({
  query: QUERY,
})
  .then(async (data) => {
    scraper.stdin.write("fullName,title,industry,github\n")
    for (let node of data.search.nodes) {
      let row = {fullName: "", title: "", industry: "", github: node.login}
      scraper.stdin.write(`${row.fullName},${row.title},${row.industry},${row.github}\n`)
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    console.log("")
    scraper.stdin.end()
  })
  .catch(err => console.error(err))
