/*
  Finds exact matches.
  For fuzzy matches, see ./autocomplete.js

  Note: This file currently relies on being a submodule of Ylhýra.
*/
import query from 'server/database'
import sql from 'server/database/functions/SQL-template-literal'
import classify from 'server/inflection/tables/classify'
import FuzzySearch from './fuzzy_search'
// import { IcelandicCharacters } from 'server/inflection/tables/functions'
const IcelandicCharacters = /^[a-záéíóúýðþæö ]+$/i

/*
  Find possible base words and tags for a given word
*/
export default (word, fuzzy, callback) => {
  if (!word ||
    word.length > 100 ||
    !IcelandicCharacters.test(word)
  ) {
    return callback(null)
    // return res.status(400).send({ error: 'Invalid string' })
  }
  word = word.trim().toLowerCase().replace(/\s+/g, ' ')
  if (fuzzy) {
    return FuzzySearch(word, callback)
  } else {
    query(sql `
      SELECT BIN_id, base_word, inflectional_form, word_class, grammatical_tag, prescriptive FROM inflection
      WHERE inflectional_form_lowercase = ${word}
      ORDER BY
      prescriptive DESC,
      correctness_grade_of_inflectional_form DESC
      LIMIT 100
    `, (err, results) => {
      if (err) {
        callback(null)
      } else {
        let grouped = []
        results.forEach(row => {
          let index = grouped.findIndex(i => i.BIN_id === row.BIN_id)
          if (index < 0) {
            grouped.push({
              BIN_id: row.BIN_id,
              urls: {
                nested: `https://ylhyra.is/api/inflection?id=${row.BIN_id}`,
                flat: `https://ylhyra.is/api/inflection?id=${row.BIN_id}&type=flat`,
                html: `https://ylhyra.is/api/inflection?id=${row.BIN_id}&type=html`,
              },
              base_word: row.base_word,
              word_class: classify(row, 'word_class'),
              matches: [],
            })
            index = grouped.length - 1
          }
          grouped[index].matches.push({
            inflectional_form: row.inflectional_form,
            form_classification: classify(row, 'form_classification'),
            prescriptive: row.prescriptive,
          })
        })
        callback(grouped)
      }
    })
  }
}
