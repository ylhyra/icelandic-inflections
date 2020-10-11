/*
  Note: This file currently relies on being a submodule of Ylhýra.
*/
import query from 'server/database'
import sql from 'server/database/functions/SQL-template-literal'
import classify from 'server/inflection/tables/classification/BIN_classification'
import { sort_by_classification } from 'server/inflection/tables/classification/sort_by_classification'

/*
  Full table for id
*/
export default (id, callback) => {
  query(sql `
    SELECT
      BIN_id,
      base_word,
      inflectional_form,
      word_categories,
      BIN_domain,
      correctness_grade_of_word,
      word_register,
      grammar_group,
      cross_reference,
      should_be_taught,
      grammatical_tag,
      correctness_grade_of_inflectional_form,
      register_of_inflectional_form,
      various_feature_markers,
      alternative_entry
    FROM inflection
    WHERE BIN_id = ${id}
    -- AND should_be_taught = 1
  `, (err, results) => {
    if (err) {
      callback(null)
    } else {
      let output = results.map(i => classify(i)).sort(sort_by_classification)
      callback(output)
    }
  })
}
