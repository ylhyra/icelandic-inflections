import { splitOnVowels, removeVowellikeClusters, splitOnAll, isVowellikeCluster } from './../functions/vowels'
import { removeCommonWordEndings } from './patterns'
import _ from 'lodash'



/*
TODO: what if there are no consonants
*/


/**
 * @memberof Word
 */
export function FindIrregularities() {
  let word = this
  // let hasUmlaut, isIrregular
  // let output = form
  let stem = word.getStem({ masculinizeAdjectiveStem: true })
  if (!stem) {
    if (process.env.NODE_ENV === 'development') {
      throw new Error('Stem not found')
    }
    return;
  }

  word.rows.forEach(row => {
    const form = row.inflectional_form

    /**
     * To find the difference from the stem we start by only looking at the consonants of the word
     */
    let consonants_in_stem = removeVowellikeClusters(stem)
    let consonants_in_form = removeVowellikeClusters(form)
    // console.log({ consonants_in_stem, consonants_in_form })

    /**
     * We then remove common inflectional endings if they come *after* the consonants of the stem.
     * This prevents the "s" from being removed from "til pils"
     */
    if (consonants_in_form.startsWith(consonants_in_stem)) {
      let remaining_after_stem_part = ''
      let current_consonant_index = 0
      let done = false
      splitOnAll(form).forEach(letter => {
        if (!done) {
          if (!isVowellikeCluster(letter)) {
            current_consonant_index++
            if (current_consonant_index > consonants_in_stem.length) {
              done = true
            }
          }
        } else {
          remaining_after_stem_part += letter
        }
      })
      console.log(removeCommonWordEndings(remaining_after_stem_part, word))
    } else {
      /**
       * TODO:
       * When inflection is highly irregular, check other siblings to see where vowel change is
       */
      if (process.env.NODE_ENV === 'development') {
        // throw new Error('')
      }
    }
  })
}



const getStuffRemainingAfterStem = (form, consonants_in_stem) => {

}
