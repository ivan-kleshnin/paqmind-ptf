let FS = require("fs")
let P = require("path")
let CSV = require("fast-csv")

process.stdin
  .pipe(CSV.parse({headers: true}))
  .pipe(CSV.format({headers: true}))
  .transform((row, next) => {
    return next(null, {
      fullName: row["first name"] + " " + row["last name"],
      github: row.github.replace("github.com/", ""),
      title: row.title,
      industry: row.industry,
    })
  })
  .pipe(process.stdout)
