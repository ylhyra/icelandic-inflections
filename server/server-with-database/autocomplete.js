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

export default (word, res) => {
  query(sql `
    SELECT score, inflectional_form, base_word, BIN_id, word_class, grammatical_tag FROM (
      SELECT score, output FROM autocomplete
        WHERE input = ${word}
        OR input = ${with_spelling_errors(word)}
        OR input = ${phonetic(word)}
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

export const with_spelling_errors = (string) => {
  string = string.replace(/ð/g, 'd')
  return diacritics(string)
    .replace(/y/g, 'i')
    .replace(/au/g, 'o')
    .replace(/sg/g, 'sk')
    .replace(/hv/g, 'kv')
    .replace(/aeg/g, 'ag')
    .replace(/([aeiou])v/g, '$1f')
    .replace(/([^\w\s])|(.)(?=\2)/g, '')
    .replace(/([a-z])j([aeiou])/g, '$1$2')
}

export const phonetic = (string) => {
  return colognePhonetic(diacritics(string))
}
