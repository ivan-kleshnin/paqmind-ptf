let FS = require("fs")
let P = require("path")
let CSV = require("fast-csv")
let {fetchGraphQL} = require("./lib")

let QUERY = `
  query(
    $login: String!
  ) {
    user(login: $login) {
      name
      followers {
        totalCount
      }
      following {
        totalCount
      }
    }
  }
`

process.stdin
  .pipe(CSV.parse({headers: true}))
  .pipe(CSV.format({headers: true}))
  .transform((row, next) => {
    fetchGraphQL({query: QUERY, variables: {
      login: row.github,
    }})
      .then(({user}) => {
        next(null, {
          ...row,
          fullName: user.name,
          followers: user.followers.totalCount,
          following: user.following.totalCount,
        })
      })
      .catch(err => {
        console.error(err)
        next(null)
      })
  })
  .pipe(process.stdout)
