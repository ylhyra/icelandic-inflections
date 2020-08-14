/*

  This file contains the routes for both the inflection site and the API.
  It both supports sending requests to the database or the database-less backends.

*/
import express from 'express'
const router = express.Router()
const cors = require('cors')
import render from './../tables'
import tree from './../tables/tree'
import withLicense from './server-with-database/license'

/**
 * @param {boolean} use_database
 */
export default (use_database) => {
  let Search, Get_by_id
  if (use_database) {
    Search = require('./server-with-database/search')
    Get_by_id = require('./server-with-database/get_by_id')
  } else {
    Search = require('./server-standalone/search')
    Get_by_id = require('./server-standalone/get_by_id')
  }

  /* API */
  router.get('/api/inflection', cors(), (req, res) => {
    res.setHeader('X-Robots-Tag', 'noindex')
    let { id, type, search, autocomplete } = req.query
    if (search) {
      return Search(search, autocomplete, results => {
        res.json(results)
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

  /* Website */
  router.get('/', cors(), (req, res) => {
    let { q, id, autocomplete } = req.query
    if (id) {
      Get_by_id(id, (rows) => {
        res.render('index', {
          layout: false,
          string: q,
          results: render(rows)
        })
      })
    } else {
      Search(q, autocomplete, (data) => {
        // res.send(data)
        res.render('index', {
          layout: false,
          string: q,
          results: `<ul>
            ${data.results.map(i => `
              <li>
                <a href="/?id=${i.BIN_id}">
                  ${i.base_word}
                </a>
                ${i.inflectional_form !== i.base_word ? `<small>${i.inflectional_form}</small>` : ''}
              </li>`).join('')}
          </ul>`
        })
      })
    }
  })

  return router
}
