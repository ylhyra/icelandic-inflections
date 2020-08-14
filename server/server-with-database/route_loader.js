import routes from './../routes'
import Search from './search'
import Get_by_ids from './get_by_id'

export default (Search, Get_by_id) => {
  return routes(Search, Get_by_id)
}
