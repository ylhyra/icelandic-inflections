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
    let { id, type, search, fuzzy } = req.query
    if (search) {
      return Search(search, fuzzy, results => {
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
    const give_me = req.query.give_me
    if (id) {
      GetById_inner(res, Get_by_id, id, word, give_me)
    } else if (word) {
      Search(word, true, results => {
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

        const {
          perfect_matches,
          did_you_mean,
        } = results

        let output = ''
        if (perfect_matches.length > 0) {
          output += `<ul>
            ${perfect_matches.map(renderItem).join('')}
          </ul>`
        }
        if (did_you_mean.length > 0) {
          output += `
          <h4 class="did-you-mean">${perfect_matches.length>0 ? 'Or did you mean:' : 'Did you mean:'}</h4>
          <ul>
            ${did_you_mean.map(renderItem).join('')}
          </ul>`
        }

        /*
          One result
          TODO: Should not be necessary to make two requests for this!
        */
        if (perfect_matches.length === 1) {
          const i = perfect_matches[0];
          GetById_inner(res, Get_by_id, i.BIN_id, word, give_me)
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
      })
    } else {
      res.send(layout({}))
    }
  })

  return router
}

const GetById_inner = (res, Get_by_id, id, word, give_me) => {
  Get_by_id(id, (rows) => {
    if (!rows || rows.length === 0) {
      return res.send(layout({
        title: word,
        string: word,
        results: rows === null ? 'Error. Try reloading.' : 'No matches'
      }))
    }

    res.send(layout({
      title: rows[0].base_word || '',
      string: word,
      results: render(rows, give_me),
      id,
    }))
  })
}

const renderItem = (i) => `
  <li>
    <a href="/${i.base_word ? encodeURIComponent(i.base_word) + '/' : ''}${i.BIN_id}">
      <strong>${i.base_word}</strong>
      – ${i.description}
    </a>
  </li>`
