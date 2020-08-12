const express = require('express')
const router = express.Router()
import cors from 'cors'
import Search from './search'
import Get_by_id from './get_by_id'
import tree from 'server/inflection/tables/tree'
import render from 'server/inflection/tables/index'
import path from 'path'
import withLicense from './../server-with-database/license'

/*
  Find possible base words and tags for a given word
*/
router.get('/inflection', cors(), (req, res) => {
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
export default router
