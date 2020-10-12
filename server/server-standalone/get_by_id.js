import axios from 'axios';

export default (id, callback) => {
  axios.get(`https://ylhyra.is/api/inflection?id=${id}&type=flat`)
    .then(function ({ data }) {
      // console.log(data.results)
      callback(data.results)
    })
    .catch(function (error) {
      console.log(error)
      callback(null)
    })
}
