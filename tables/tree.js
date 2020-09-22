import { sort_by_classification } from './classify'

/**
 * Turns rows into nested tree, with each leaf containing a collection of items that have the same classification
 *
 * @param {array} rows - Raw list of rows with classifications from ./classify.js
 * @returns {object}
 * The tree is on the form:
 *   {
 *     values: [{
 *       tag: 'singular',
 *       values: [{
 *         tag: 'nominative',
 *         values: []
 *       }]
 *     }]
 *   }
 *
 */
const tree = (rows) => {
  let output = {
    BIN_id: rows[0] && rows[0].BIN_id,
    base_word: rows[0] && rows[0].base_word,
    correctness_grade_of_base_word: rows[0] && rows[0].correctness_grade_of_base_word,
    register_of_base_word: rows[0] && rows[0].register_of_base_word,
    word_class: rows[0] && rows[0].word_class,
    values: [],
  }

  rows.forEach(row => {
    let currentArray = output.values
    row.form_classification.forEach(tag => {
      const alreadyExists = currentArray.find(i => i.tag === tag)
      if (alreadyExists) {
        currentArray = alreadyExists.values
      } else if (!isNumber(tag)) {
        currentArray.push({
          tag,
          values: []
        })
        currentArray = currentArray[currentArray.length - 1].values
      } else {
        /* Tag is number, indicating variant */
        currentArray.push({
          form_classification: row.form_classification,
          word_class: row.word_class,
          variant_number: parseInt(tag),
          inflectional_form: row.inflectional_form,
          prescriptive: row.prescriptive,
          correctness_grade_of_inflectional_form: row.correctness_grade_of_inflectional_form,
          register_of_inflectional_form: row.register_of_inflectional_form,
          // various_feature_markers: row.various_feature_markers,
        })
      }
    })
  })

  output = TraverseAndSort(output)

  return output
}

/**
 * Sort tree based on the list `sorted_tags` array in ./classify.js
 */
const TraverseAndSort = (input) => {
  if (Array.isArray(input)) {
    return input.sort(sort_by_classification).map(TraverseAndSort)
  } else if (input.values) {
    return {
      ...input,
      values: input.values.sort(sort_by_classification).map(TraverseAndSort)
    }
  } else {
    return input
  }
}

export const isNumber = (string) => {
  return /^\d+$/.test(string + '')
}

export default tree
