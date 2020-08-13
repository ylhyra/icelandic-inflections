const express = require('express')
const app = express()
const router = express.Router()
const cors = require('cors')
const port = 4545
const axios = require('axios');
import render from './../../tables'
import tree from './../../tables/tree'
import withLicense from './../server-with-database/license'
import path from 'path'
var doT = require('express-dot')
var fs = require('fs')

doT.setGlobals({
  load: function (file) {
    return fs.readFileSync(path.join(path.dirname(process.argv[1]), file));
  }
});
app.engine('dot', doT.__express)
app.set('views', path.join(__dirname, '/../views'))
app.set('view engine', 'dot')


app.set('json spaces', 2)
router.get('/api/inflection', cors(), (req, res) => {
  let { id, type, autocomplete } = req.query

  if (req.query.search) {
    axios.get(`https://ylhyra.is/api/inflection?search=${encodeURIComponent(req.query.search)}&autocomplete=${encodeURIComponent(autocomplete)}`)
      .then(function ({ data }) {
        res.send(data)
      })
      .catch(function (error) {
        res.send('error')
        console.log(error);
      })
  } else if (id) {
    axios.get(`https://ylhyra.is/api/inflection?id=${id}&type=flat`)
      .then(function ({ data }) {
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
      .catch(function (error) {
        res.send('error')
        console.log(error);
      })

  } else {
    return res.status(400).send({ error: 'Parameters needed' })
    // return res.sendFile(path.resolve(__dirname, `./../docs/README.md`))
  }
})

router.get('/', cors(), (req, res) => {
  let { q, id } = req.query
  if (id) {
    axios.get(`https://ylhyra.is/api/inflection?id=${id}&type=flat`)
      .then(function ({ data }) {
        const rows = data.results

        res.render('index', {
          layout: false,
          string: q,
          results: render(rows)
        })

      })
      .catch(function (error) {
        res.send('error')
        console.log(error);
      })
  } else {
    axios.get(`https://ylhyra.is/api/inflection?search=${encodeURIComponent(q)}&autocomplete=true`)
      .then(function ({ data }) {
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
      .catch(function (error) {
        res.send('error')
        console.log(error);
      })
  }
})

app.use('/styles', express.static(path.join(__dirname, '/../../styles')))
app.use('/', router)
app.listen(port, null, (err) => {
  if (err) {
    console.log(err.message)
  }
})
