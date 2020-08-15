/*
  Note: This file currently relies on being a submodule of Ylhýra.
*/
import query from 'server/database'
import sql from 'server/database/functions/SQL-template-literal'
import classify, { sort_by_classification } from 'server/inflection/tables/classify'

/*
  Full table for id
*/
export default (id, callback) => {
  query(sql `
    SELECT
      BIN_id,
      base_word,
      inflectional_form,
      word_class,
      BIN_domain,
      correctness_grade_of_base_word,
      register_of_base_word,
      grammar_group,
      cross_reference,
      descriptive,
      grammatical_tag,
      correctness_grade_of_word_form,
      register_of_word_form,
      only_found_in_idioms,
      alternative_entry
    FROM inflection
    WHERE BIN_id = ${id}
    -- AND descriptive = 1
  `, (err, results) => {
    if (err) {
      // res.send(err)
      callback(null)
    } else {
      let output = results.map(i => classify(i)).sort(sort_by_classification)
      callback(output)
    }
  })
}
