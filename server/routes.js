/*

  This file contains the routes for both the inflection site and the API.
  It both supports sending requests to the database or the database-less backends.
  For that reason, the "Search" and "Get_by_id" functions are passed as parameters.

*/
import express from 'express'
const router = express.Router()
import cors from 'cors'
import render from './../tables'
import tree from './../tables/tree'
import withLicense from './server-with-database/license'
import layout from './views/layout'

/**
 * @param {boolean} use_database
 */
export default (Search, Get_by_id) => {

  /*
    API
  */
  router.get('/api/inflections?', cors(), (req, res) => {
    res.setHeader('X-Robots-Tag', 'noindex')
    let { id, type, search, fuzzy, return_rows_if_only_one_match } = req.query
    if (search) {
      return Search({ word: search, fuzzy, return_rows_if_only_one_match }, results => {
        res.json({ results })
      })
    } else if (id) {
      Get_by_id(id, (rows) => {
        /* Flat */
        if (type === 'flat') {
          return res.json(withLicense(rows, id))
        }
        /* HTML */
        else if (type === 'html') {
          return res.send(render(rows))
        }
        /* Nested */
        else {
          return res.send(withLicense(tree(rows), id))
        }
      })
    } else {
      return res.status(400).send({ error: 'Parameters needed' })
      // return res.sendFile(path.resolve(__dirname, `./../docs/README.md`))
    }
  })

  /*
    Website
  */
  router.get(['/robots.txt', '/favicon.ico', '/sitemap.xml'], (req, res) => {
    res.send('')
  })
  router.get(['/', '/:id(\\d+)/', '/:word?/:id(\\d+)?'], cors(), (req, res) => {
    const id = req.query.id || req.params.id
    const word = req.query.q || req.params.word
    const embed = 'embed' in req.query

    const sendError = (e) => {
      console.error(e)
      return res.send(layout({
        title: word,
        string: word,
        results: 'There was an error. Please <a href="mailto:ylhyra@ylhyra.is">click here</a> to report this error.' +
          `<br><br><small class=gray>Error message: ${e.message}</small>`
      }))
    }

    if (id) {
      Get_by_id(id, (rows) => {
        if (!rows || rows.length === 0) {
          return res.send(layout({
            title: word,
            string: word,
            results: rows === null ? 'Internal network error. Try reloading.' : 'No matches'
          }))
        }
        try {
          // console.log(rows)
          res.send(layout({
            title: rows[0].base_word || '',
            string: word,
            results: render(rows, req.query),
            id,
            embed,
          }))
        } catch (e) {
          sendError(e)
        }
      })
    } else if (word) {
      Search({
          word: word,
          fuzzy: true,
          return_rows_if_only_one_match: true
        },
        results => {
          try {
            /*
              No results
            */
            if (!results || results === 'Error') {
              return res.send(layout({
                title: word,
                string: word,
                results: results === 'Error' ? 'Error, try reloading' : 'No matches'
              }))
            }

            // console.log(results)

            const {
              perfect_matches,
              did_you_mean,
            } = results

            let output = ''
            if (perfect_matches.length > 0) {
              output += `<ul class="results">
                  ${perfect_matches.map(renderItemOnSearchPage).join('')}
                </ul>`
            }
            if (did_you_mean.length > 0) {
              output += `
                <h4 class="did-you-mean">${perfect_matches.length>0 ? 'Or did you mean:' : 'Did you mean:'}</h4>
                <ul class="results">
                  ${did_you_mean.map(renderItemOnSearchPage).join('')}
                </ul>`
            }

            /*
              One result
            */
            if (perfect_matches.length === 1) {
              const { rows } = results
              res.send(layout({
                title: rows[0].base_word || '',
                string: word,
                results: render(rows, req.query),
                id: rows[0].BIN_id,
                embed,
              }))
            }
            /*
              Many results
            */
            else {
              res.send(layout({
                title: word,
                string: word,
                results: output
              }))
            }
          } catch (e) {
            sendError(e)
          }
        })
    } else {
      res.send(layout({}))
    }
  })

  return router
}

const renderItemOnSearchPage = (i) => `
  <li>
    <a href="/${i.base_word ? encodeURIComponent(i.base_word) + '/' : ''}${i.BIN_id}">
      ${i.snippet ?
        `<div class="snippet">${i.snippet}</div>` :
        `<div><strong>${i.base_word}</strong></div>`
      }
      <div class="description">${i.description}</div>
    </a>
  </li>`
