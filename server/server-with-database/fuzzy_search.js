/*
  Fuzzy search. Finds items with typos and auto-completes.

  Note: This file currently relies on being a submodule of Ylhýra.
*/
import express from 'express'
const router = express.Router()
import query from 'server/database'
import sql from 'server/database/functions/SQL-template-literal'

import { colognePhonetic } from 'cologne-phonetic'


import { remove as remove_diacritics } from 'diacritics'
export const WITHOUT_SPECIAL_CHARACTERS_MARKER = '@'
export const WITH_SPELLING_ERROR_MARKER = '^'
export const PHONETIC_MARKER = '~'

export default (word, callback) => {
  query(sql `
    SELECT score, inflectional_form, base_word, BIN_id, word_class, grammatical_tag FROM (
      SELECT score, output FROM autocomplete
        WHERE input = ${word}
        OR input = ${without_special_characters(word)}
        OR input = ${with_spelling_errors(word)}
        OR input = ${phonetic(word)}
        ORDER BY
        autocomplete.score DESC
        LIMIT 20
    ) a
    LEFT JOIN inflection
      ON a.output = inflectional_form_lowercase
    GROUP BY BIN_id
    ORDER BY
      a.score DESC,
      descriptive DESC,
      correctness_grade_of_word_form DESC,
      inflectional_form ASC;
  `, (err, results) => {
    if (err) {
      console.error(err)
      callback(null)
      // return res.status(404).send({ error: 'No results' })
    } else {
      callback(results)
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
