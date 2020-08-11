// var http = require('http');
const express = require('express')
const app = express()
const router = express.Router()
const cors = require('cors')
const port = 4545
const request = require('request');
import render from './../../tables'

router.get('/inflection', cors(), (req, res) => {
  let { id, type } = req.query

  request(`https://ylhyra.is/api/inflection?id=${id}&type=flat`, (error, response, body) => {
    if(error) return error;
    console.log(body)
    res.send(render(body))
  });

  // if (req.query.search) {
  //   return search(req.query.search, res)
  // } else if (id) {
  //   get_by_id(id, res, (rows) => {
  //     /* Flat */
  //     if (type === 'flat') {
  //       return res.json(withLicense(rows, id))
  //     }
  //     /* HTML */
  //     else if (type === 'html') {
  //       return res.send(render(rows))
  //     }
  //     /* Nested */
  //     else {
  //       return res.send(withLicense(tree(rows), id))
  //     }
  //   })
  // } else {
  //   return res.status(400).send({ error: 'Parameters needed' })
  //   // return res.sendFile(path.resolve(__dirname, `./../docs/README.md`))
  // }
})

app.use('/api', router)
app.listen(port, null, (err) => {
  if (err) {
    console.log(err.message)
  }
})
