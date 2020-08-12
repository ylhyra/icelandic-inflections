/*
  Fuzzy search. Finds items with typos and auto-completes.

  Note: This file currently relies on being a submodule of Ylhýra.
*/
import express from 'express'
const router = express.Router()
import query from 'server/database'
import sql from 'server/database/functions/SQL-template-literal'
const { colognePhonetic  } = require('cologne-phonetic')
const diacritics = require('diacritics').remove

export default (word, callback) => {
  /*
    TODO GROUP BY AFTER SORTING
    so that "ugla" is selected before "Ugla"

    TODO! TODO!
    Þetta er hræðilega ljót skipun!!!!
    Hver kann að joina og velja bara maxið?
  */
  query(`
    SELECT * FROM (
      SELECT score, keyword, keyword_lowercase FROM (
        SELECT score, keywords.*
        FROM input_to_keyword AS input
        LEFT JOIN keywords
        ON input.keyword_id = keywords.id
        WHERE input = ?
          OR input = ?
          OR input = ?
        ORDER BY
        	input.score DESC,
        	keyword ASC
        LIMIT 100
      ) c
      GROUP BY keyword_lowercase
      ORDER BY score ASC
      ) d
      ORDER BY score DESC
      LIMIT 20
  `, [
    word,
    with_spelling_errors(word),
    phonetic(word),
  ], (err, results) => {
    if (err) {
      console.error(err)
      callback(null)
    } else {
      callback(results)
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
