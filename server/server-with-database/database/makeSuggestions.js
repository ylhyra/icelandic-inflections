/*

  Generates an index for autocompletion and fuzzy search

  Setup:

  Fetch ordalisti.csv from BÍN.
  Then generate a simple list of unique lowercase words with:

  > awk -F ';' '{print $1}' ordalisti.csv | tr '[:upper:]' '[:lower:]' | sort -u > ordalisti_unique.csv

  Then run:
  > node build/ylhyra_server.js --generate-suggestions

*/
import query from 'server/database'
import sql from 'server/database/functions/SQL-template-literal'
import { cleanInput, phonetic, with_spelling_errors } from './../autocomplete'
import path from 'path'
import _ from 'underscore'
import flattenArray from 'project/frontend/App/functions/flattenArray'
var LineByLineReader = require('line-by-line')
const CSV_FILE_NAME = 'ordalisti_unique.csv'
const CSV_FILE_LINES = 289374 // Number of lines, calculated with "wc -l"
let count = 0

query(`TRUNCATE TABLE autocomplete;`, (err, res) => {
  var lr = new LineByLineReader(path.resolve(__dirname, `./${CSV_FILE_NAME}`))
  lr.on('error', (err) => {
    console.error(err)
  });

  lr.on('line', (line) => {
    lr.pause()
    if (line.trim() == '') {
      lr.resume()
    } else {
      const word = line
      let inputs
      inputs = [{
        text: cleanInput(word),
        score: word === cleanInput(word) ? 100 : 90,
      }]
      inputs = UniqueByMaxScore(autocomplete(inputs))
      inputs = UniqueByMaxScore(addPhoneticAndSpellingErrors(inputs))
      inputs = inputs.filter(input => input.score >= 3)

      const values = flattenArray(inputs.map(input => ([input.text, word, input.score])))
      query(`INSERT INTO autocomplete SET input = ?, output = ?, score = ?;`.repeat(inputs.length), values, (err, results) => {
        if (err) {
          console.error(err)
          throw (err)
        } else {

          count++
          if (count % 100 === 1) {
            process.stdout.write(`\x1Bc\r${(count / CSV_FILE_LINES * 100).toFixed(1)}% ${word}`)
          }

          lr.resume()
        }
      })
    }
  });

  lr.on('end', () => {
    process.exit()
  });
})





const clean = (words) => words.map(word => ({
  text: cleanInput(word.text),
  score: word.score,
}))



/*

  Calculates autocomplete for all strings.

  For the input "Example" it will return:
  - "Ex"
  - "Exa"
  - "Exam"
  - "Examp"
  - "Exampl"
  - "Example"

*/
const autocomplete = (inputs) => {
  let additions = []

  inputs.forEach(({ text, score }) => {
    // At what character should we start?
    let start = 1
    const characters = text.split('')
    if (characters.length > 10)
      start = 3;
    else if (characters.length > 5)
      start = 2;

    for (var i = start; i <= characters.length; i++) {
      if (score < 100 && i === 1) continue;
      if (characters[i - 1] === ' ') continue; // TEMP
      additions.push({
        text: characters.slice(0, i).join(''),
        score: 0.2 * score + 0.7 * (score * (i / characters.length))
      })
    }
  })

  return [
    ...inputs,
    ...additions,
  ]
}



const addPhoneticAndSpellingErrors = (inputs) => {
  let additions = []

  inputs.forEach(({ text, score }) => {
    if (with_spelling_errors(text).length > 1) {
      additions.push({
        text: with_spelling_errors(text),
        score: score / 4,
      })
    }
    if (phonetic(text).length > 1) {
      additions.push({
        text: phonetic(text),
        score: score / 7,
      })
    }
  })

  return [
    ...inputs,
    ...additions,
  ]
}



const UniqueByMaxScore = (inputs) => {
  const sorted = inputs.sort((a, b) => b.score - a.score)
  const texts = sorted.map(word => word.text)
  return sorted
    .filter((word, index) => index === texts.indexOf(word.text))
    .map(word => ({
      text: word.text,
      score: Math.round(word.score),
    }))
}


// const demo = async () => {
//   let inputs
//   inputs = UniqueByMaxScore(await findVariations({ text: 'egill', score: 100, lang: 'isl', }))
//   inputs = UniqueByMaxScore(clean(inputs))
//   inputs = UniqueByMaxScore(autocomplete(inputs))
//   inputs = UniqueByMaxScore(addPhoneticAndSpellingErrors(inputs))
//   inputs = inputs.filter(input => input.score >= 3)
//
//   console.log(inputs)
// }
// demo()
