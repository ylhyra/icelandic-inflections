import axios from 'axios';

export default (word, fuzzy, callback) => {
  axios.get(`https://ylhyra.is/api/inflection?search=${encodeURIComponent(word)}&fuzzy=${encodeURIComponent(fuzzy)}`)
    .then(function({ data }) {
      callback(data.results)
    })
    .catch(function(error) {
      callback(null)
      console.log(error);
    })
}
