let fetch = require("node-fetch")

exports.fetchGraphQL = function fetchGraphQL({query, variables = {}}) {
  return fetch(`https://api.github.com/graphql`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "authorization": `bearer ${process.env.GITHUB_TOKEN}`,
    },
    body: JSON.stringify({query, variables})
  })
    .then(res => res.json())
    .then(({data, errors, message}) => {
      if     (message) throw new Error(message)
      else if (errors) throw new Error(errors[0].message)
      else             return data
    })
}
