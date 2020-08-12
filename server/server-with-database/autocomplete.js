/*
  Fuzzy search. Finds items with typos and auto-completes.

  Note: This file currently relies on being a submodule of Ylhýra.
*/
import express from 'express'
const router = express.Router()
import query from 'server/database'
import sql from 'server/database/functions/SQL-template-literal'
const { colognePhonetic } = require('cologne-phonetic')
const diacritics = require('diacritics').remove
export const WITHOUT_SPECIAL_CHARACTERS_TAG = '@'
export const WITH_SPELLING_ERROR_TAG = '^'
export const PHONETIC_TAG = '~'

export default (word, res) => {
  query(sql `
    SELECT score, inflectional_form, base_word, BIN_id, word_class, grammatical_tag FROM (
      SELECT score, output FROM autocomplete
        WHERE input = ${word}
        OR input = ${WITHOUT_SPECIAL_CHARACTERS_TAG + without_special_characters}
        OR input = ${WITH_SPELLING_ERROR_TAG + with_spelling_errors(word)}
        OR input = ${PHONETIC_TAG + phonetic(word)}
        ORDER BY
        autocomplete.score DESC,
        autocomplete.output ASC
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
      return res.status(404).send({ error: 'No results' })
    } else {
      res.json({ results })
    }
  })
}

export const cleanInput = (input) => {
  return input && input.toLowerCase().replace(/[^a-zA-ZÀ-ÿ0-9]/g, '')
}

export const without_special_characters = (string) => {
  string = string
    .replace(/þ/g, 'th')
    .replace(/ð/g, 'd')
    .replace(/ö/g, 'o')
  return diacritics(string)
}

export const with_spelling_errors = (string) => {
  return without_special_characters(string)
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
  return colognePhonetic(
    removeTemporaryMarkers(with_spelling_errors(string))
  )
}

export const removeTemporaryMarkers = (input) => {
  return input
    .replace(WITHOUT_SPECIAL_CHARACTERS_TAG, '')
    .replace(WITH_SPELLING_ERROR_TAG, '')
    .replace(PHONETIC_TAG, '')
}
