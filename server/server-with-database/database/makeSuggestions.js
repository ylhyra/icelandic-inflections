/*

  Generator for variations and autocompletion.

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

    }
  });

  lr.on('end', () => {
    process.exit()
  });
})




const makeSuggestions = ({ entry_id, keywords }) => {
  return new Promise(async resolve => {

    await Promise.all(keywords.map(keyword => (
      new Promise(async resolve => {

        /*
          Insert keyword
        */
        let skipSuggestions = false
        const keyword_id = await new Promise(async resolve_1 => {
          const lowercase = keyword.text.toLowerCase()
          const original = (keyword.text !== lowercase) ? keyword.text : null

          /*
            Check if keyword with a similar score already exists
            (no need to recalculate suggestions)
          */
          await new Promise((resolve_2) => {
            query(`
              SELECT keywords.id FROM keywords
              LEFT JOIN keyword_to_entry
              ON keyword_to_entry.keyword_id = keywords.id
              WHERE keyword_lowercase = ?
                AND (score < ? OR score > ?)
              ORDER BY score DESC
              LIMIT 1
            `, [lowercase, keyword.score + 10, keyword.score - 10], (err, results) => {
              if (err) {
                console.error(err)
                throw (err)
              } else {
                if (results.length > 0) {
                  skipSuggestions = true
                  resolve_2()
                  resolve_1(results[0].id)
                } else {
                  resolve_2()
                }
              }
            })
          })

          if (!skipSuggestions) {
            query(`INSERT INTO keywords SET keyword = ?, keyword_lowercase = ?`, [original, lowercase], (err, results) => {
              if (err) {
                console.error(err)
                throw (err)
              } else {
                resolve_1(results.insertId)
              }
            })
          }
        })

        /*
          Keyword to entry
        */
        await new Promise(resolve_1 => {
          query(`INSERT INTO keyword_to_entry SET keyword_id = ?, entry_id = ?, score = ?`, [keyword_id, entry_id, keyword.score], (err, results) => {
            if (err) {
              console.error(err)
              throw (err)
            } else {
              resolve_1()
            }
          })
        })

        if (!skipSuggestions) {

          let inputs
          inputs = UniqueByMaxScore(await findVariations({
            ...keyword,
            text: keyword.text.toLowerCase(),
          }))
          inputs = UniqueByMaxScore(clean(inputs))
          inputs = UniqueByMaxScore(autocomplete(inputs))
          inputs = UniqueByMaxScore(addPhoneticAndSpellingErrors(inputs))
          inputs = inputs.filter(input => input.score >= 3)

          /*
            Input to keyword
          */
          await new Promise(resolve_1 => {
            const values = flattenArray(inputs.map(input => ([input.text, input.score, keyword_id])))
            query(`INSERT INTO input_to_keyword SET input = ?, score = ?, keyword_id = ?;`.repeat(inputs.length), values, (err, results) => {
              if (err) {
                console.error(err)
                throw (err)
              } else {
                resolve_1()
              }
            })
          })
        }

        resolve()
      })
    )))


    resolve()
  })
}



export default makeSuggestions




const findVariations = (keyword) => {
  return new Promise(resolve => {
    if (keyword.lang !== 'isl') {
      resolve([keyword])
    } else {
      query(`
        SELECT DISTINCT t2.lowercase
        FROM word_variations t1
        LEFT JOIN word_variations t2
        ON t2.belongs_to = t1.belongs_to
        WHERE t1.language = ?
          AND t1.lowercase = ?`, [
        keyword.lang,
        keyword.text.toLowerCase()
      ], (err, results) => {
        if (err) {
          console.error(err)
          throw (err)
        } else {
          resolve([
            keyword,
            ...results.map(result => ({
              text: result.lowercase,
              score: keyword.score * 0.7,
            }))
          ])
        }
      })
    }
  })
}


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
        score: 0.2 * score +  0.7 * (score * (i / characters.length))
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
