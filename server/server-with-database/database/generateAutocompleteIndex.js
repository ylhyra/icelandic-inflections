/*

  Generates an index for autocompletion and fuzzy search

  Setup:

  Fetch ordalisti.csv from BÍN.
  Then generate a simple list of unique lowercase words with:

  > awk -F ';' '{print $1}' ordalisti.csv | tr '[:upper:]' '[:lower:]' | sort -u > ordalisti_unique.csv

  Then run:
  > node build/ylhyra_server.js --generate-autocomplete-index


*/
import query from 'server/database'
import sql from 'server/database/functions/SQL-template-literal'
import {
  cleanInput,
  phonetic,
  without_special_characters,
  with_spelling_errors,
  removeTemporaryMarkers,
  WITHOUT_SPECIAL_CHARACTERS_MARKER,
  WITH_SPELLING_ERROR_MARKER,
  PHONETIC_MARKER,
} from './../autocomplete'
import path from 'path'
import _ from 'underscore'
import flattenArray from 'project/frontend/App/functions/flattenArray'
var LineByLineReader = require('line-by-line')

const CSV_FILE_NAME = 'ordalisti_unique.csv'
const CSV_FILE_LINES = 289374 // Number of lines, calculated with "wc -l"
let count = 0
// import { compareTwoStrings } from 'string-similarity'

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
        score: word === cleanInput(word) ? 100 : 80,
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

  Scoring:

  * 100 - original word
  * 90 - without special characters
  * 85 - major spelling errors
  * 80 - phonetic
  * 70 - last letter missing

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
        score: 0.2 * score + 0.7 * (score * ((i / characters.length) ** 2))
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
    additions.push({
      text: without_special_characters(text),
      score: 0.90 * (score)
    })
    /* Extreme spelling errors only for the full word and without last letter, not all autocompletes */
    if (score >= 70) {
      additions.push({
        text: with_spelling_errors(text),
        score: 0.85 * score
      })
    }
    /* Phonetic algorithm just for full word */
    if (score >= 90) {
      additions.push({
        text: phonetic(text),
        score: 0.8 * score,
      })
    }
  })
  // console.log([
  //   ...inputs,
  //   ...additions,
  // ])

  return [
    ...inputs,
    ...additions,
  ]
}



const UniqueByMaxScore = (inputs) => {
  const sorted = inputs.sort((a, b) => b.score - a.score)
  /* Store array of texts so that we can filter out already-seen ones in the next step */
  const texts = sorted.map(word => removeTemporaryMarkers(word.text))
  return sorted
    .filter((word, index) => index === texts.indexOf(removeTemporaryMarkers(word.text)))
    .map(word => ({
      text: word.text,
      score: Math.round(word.score),
    }))
}

// const demo = async () => {
//   const word = 'Þórsmörk'
//   let inputs = [{
//     text: cleanInput(word),
//     score: word === cleanInput(word) ? 100 : 90,
//   }]
//   inputs = UniqueByMaxScore(autocomplete(inputs))
//   inputs = UniqueByMaxScore(addPhoneticAndSpellingErrors(inputs))
//   inputs = inputs.filter(input => input.score >= 3)
//
//   console.log(inputs)
//   process.exit()
// }
// demo()
