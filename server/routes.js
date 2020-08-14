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
import layout from './../views/layout'

/**
 * @param {boolean} use_database
 */
export default (Search, Get_by_id) => {

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

        res.send(layout({
          string: q,
          results: render(rows)
        }))

      })
    } else {
      Search(q, autocomplete, (data) => {
        if (!data) {
          return res.send(':(')
        }
        res.send(layout({
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
        }))
      })
    }
  })

  return router
}
