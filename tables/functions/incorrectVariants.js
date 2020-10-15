import { last } from 'lodash'

/* Remove incorrect variants */
export const removeIncorrectVariants = (rows) => {
  return rows.filter(row => {
    // console.log(row)
    // /* Note: Commented out as "hendi" is marked with this */
    // if (row.should_be_taught) {
    //   return true
    // }
    /* Leave the first item */
    if (last(row.inflectional_form_categories) === 1) {
      return true
    }
    /* Leave subsequent items if they are correct */
    if (row.correctness_grade_of_inflectional_form == 1) {
      return true
    }
    return false
  })
}
