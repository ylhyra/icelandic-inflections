/*
  Fuzzy search. Finds items with typos and auto-completes.

  Note: This file currently relies on being a submodule of Ylhýra.
*/
import express from 'express'
const router = express.Router()
import query from 'server/database'
import sql from 'server/database/functions/SQL-template-literal'
require('array-sugar')
import { colognePhonetic } from 'cologne-phonetic'
import { remove as remove_diacritics } from 'diacritics'
import Word from './../../tables/word'
import { removeLinks } from './../../tables/link'
export const WITHOUT_SPECIAL_CHARACTERS_MARKER = '@'
export const WITH_SPELLING_ERROR_MARKER = '^'
export const PHONETIC_MARKER = '~'
import classify from 'server/inflection/tables/classify'

export default (word, callback) => {
  query(sql `
    SELECT
        score, i2.BIN_id, i2.BIN_domain, i2.grammatical_tag, i2.inflectional_form, i2.word_class, i2.base_word,
        inner_table.inflectional_form as matched_term,
        (CASE WHEN inner_table.score >= 4 THEN 1 ELSE 0 END) as word_has_perfect_match
      FROM
      (
       SELECT score, i1.inflectional_form, i1.BIN_id FROM (
         SELECT score, output FROM autocomplete
           WHERE input = ${word}
           OR input = ${without_special_characters(word)}
           OR input = ${with_spelling_errors(word)}
           -- OR input = ${phonetic(word)} -- Temporarily remove phonetic matches
           ORDER BY
           autocomplete.score DESC
           LIMIT 20 -- Necessary?
       ) a
       LEFT JOIN inflection i1
         ON a.output = i1.inflectional_form_lowercase
         GROUP BY BIN_id
       ORDER BY
         a.score DESC,
         i1.descriptive DESC,
         i1.correctness_grade_of_word_form DESC,
         i1.inflectional_form ASC

       ) as inner_table
     LEFT JOIN inflection i2
       ON inner_table.BIN_id = i2.BIN_id
  `, (err, rows) => {
    if (err) {
      console.error(err)
      callback(null)
    } else if(rows.length === 0) {
      callback(null)
    } else {
      let words = []
      let lastBINid = null
      rows.forEach(row => {
        if (lastBINid !== row.BIN_id) {
          words.push([])
        }
        lastBINid = row.BIN_id
        words.last.push(classify(row))
      })

      let output = []
      words.forEach(rows => {
        const word = new Word(rows)
        output.push({
          perfect_match: rows[0].word_has_perfect_match,
          BIN_id: word.getId(),
          base_word: word.getBaseWord(),
          description: removeLinks(word.getWordDescription()),
          principal_parts: removeLinks(word.getPrincipalParts()),
        })
      })

      let perfect_matches = []
      let did_you_mean = []

      output.forEach(item => {
        if (item.perfect_match) {
          perfect_matches.push(item)
        } else {
          did_you_mean.push(item)
        }
      })

      callback({
        perfect_matches,
        did_you_mean,
      })
    }
  })
}

export const cleanInput = (input) => {
  return input && input.toLowerCase().replace(/[^a-zA-ZÀ-ÿ0-9]/g, '')
}

export const without_special_characters = (string) => {
  string = WITHOUT_SPECIAL_CHARACTERS_MARKER + string
    .replace(/þ/g, 'th')
    .replace(/ð/g, 'd')
    .replace(/ö/g, 'o')
  return remove_diacritics(string)
}

export const with_spelling_errors = (string) => {
  return WITH_SPELLING_ERROR_MARKER + removeTemporaryMarkers(without_special_characters(string))
    .replace(/y/g, 'i')
    .replace(/au/g, 'o')
    .replace(/sg/g, 'sk')
    .replace(/hv/g, 'kv')
    .replace(/aeg/g, 'ag')
    .replace(/fnd/g, 'md')
    .replace(/fnt/g, 'mt')
    .replace(/rl/g, 'tl')
    .replace(/rdn/g, 'n')
    .replace(/rn/g, 'n')
    .replace(/dn/g, 'n')
    // .replace(/([aeiou])v/g, '$1f')
    // .replace(/([a-z])j([aeiou])/g, '$1$2')
    .replace(/([^\w\s])|(.)(?=\2)/g, '') // Remove two in a row
}

export const phonetic = (string) => {
  return PHONETIC_MARKER + colognePhonetic(
    removeTemporaryMarkers(with_spelling_errors(string))
  )
}

export const removeTemporaryMarkers = (input) => {
  return input
    .replace(WITHOUT_SPECIAL_CHARACTERS_MARKER, '')
    .replace(WITH_SPELLING_ERROR_MARKER, '')
    .replace(PHONETIC_MARKER, '')
}
