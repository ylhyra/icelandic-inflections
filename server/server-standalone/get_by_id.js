const axios = require('axios');

module.exports = (id, callback) => {
  axios.get(`https://ylhyra.is/api/inflection?id=${id}&type=flat`)
    .then(function({ data }) {
      callback(data)
    })
    .catch(function(error) {
      callback(null)
      console.log(error);
    })
}
