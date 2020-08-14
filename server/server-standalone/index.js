const express = require('express')
const app = express()
const port = 4545
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



app.use('/styles', express.static(path.join(__dirname, '/../../styles')))
app.use('/', require(path.join(__dirname, './../routes')).default)

app.listen(port, null, (err) => {
  if (err) {
    console.log(err.message)
  }
})
