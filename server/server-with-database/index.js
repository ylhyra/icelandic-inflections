
import express from 'express'

const router = express.Router()
import cors from 'cors'
import Search from './search'
import Get_by_id from './get_by_id'
import tree from 'server/inflection/tables/tree'
import render from 'server/inflection/tables/index'
import path from 'path'
import layout from './../views/layout'
import withLicense from './../server-with-database/license'
// var compression = require('compression')
// app.use(compression({}))


/*
  Find possible base words and tags for a given word
*/
router.get('/api/inflection', cors(), (req, res) => {
  res.setHeader('X-Robots-Tag', 'noindex')
  let { id, type, search, autocomplete } = req.query
  if (search) {
    return Search(search, autocomplete, res)
  } else if (id) {
    Get_by_id(id, res, (rows) => {
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

router.get('/', cors(), (req, res) => {
  let { q, id } = req.query
  if (id) {
    Get_by_id(id, res, rows => {
      res.send(layout({
        string: q,
        results: render(rows)
      }))
    })
  } else {
    Search(search, true, (data) => {
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


export default router
