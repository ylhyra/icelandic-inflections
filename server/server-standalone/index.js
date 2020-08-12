const express = require('express')
const app = express()
const router = express.Router()
const cors = require('cors')
const port = 4545
const axios = require('axios');
import render from './../../tables'
import tree from './../../tables/tree'
import withLicense from './../server-with-database/license'

app.set('json spaces', 2)
router.get('/inflection', cors(), (req, res) => {
  res.setHeader('X-Robots-Tag', 'noindex')
  let { id, type, search, autocomplete } = req.query
  if (search) {
    axios.get(`https://ylhyra.is/api/inflection?search=${encodeURIComponent(req.query.search)}&autocomplete=${encodeURIComponent(autocomplete)}`)
      .then(function({ data }) {
        res.send(data)
      })
      .catch(function(error) {
        res.send('error')
        console.log(error);
      })
  } else if (id) {
    axios.get(`https://ylhyra.is/api/inflection?id=${id}&type=flat`)
      .then(function({ data }) {
        const rows = data.results

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
          return res.json(withLicense(tree(rows), id))
        }
      })
      .catch(function(error) {
        res.send('error')
        console.log(error);
      })

  } else {
    return res.status(400).send({ error: 'Parameters needed' })
    // return res.sendFile(path.resolve(__dirname, `./../docs/README.md`))
  }
})

app.use('/api', router)
app.listen(port, null, (err) => {
  if (err) {
    console.log(err.message)
  }
})
