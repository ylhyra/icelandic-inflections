const axios = require('axios');

module.exports = (word, autocomplete, callback) => {
  axios.get(`https://ylhyra.is/api/inflection?search=${encodeURIComponent(word)}&autocomplete=${encodeURIComponent(autocomplete)}`)
    .then(function({ data }) {
      callback(data)
    })
    .catch(function(error) {
      callback(null)
      console.log(error);
    })
}
