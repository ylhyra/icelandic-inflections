import { splitOnVowels, removeVowellikeClusters, splitOnAll, isVowellikeCluster } from './vowels'
import { stripBeforeComparingToStem } from './commonEndings_OLD'
import { removeCommonWordEndings } from './commonEndings'
import _ from 'lodash'

/**
 * highlightIrregularities - Highlights umlauts in red and other irregularities by wrapping in italics
 *
 * @param {string} form
 * @param {Word} word
 * @param {boolen} returnDescription
 * @return {string|object}
 *   If returnDescription is false, return a formatted HTML string with irregularities highlighted
 *   If returnDescription is true, return { hasUmlaut, isIrregular }
 */
export function highlightIrregularities(form, word, returnDescription = false) {
  let hasUmlaut, isIrregular
  let output = form
  let stem = word.getStem({ masculinizeAdjectiveStem: true })
  if (!stem) return form;


  /*
   *
   *  testing....
   */
  if (true || word.is('nominative', 'singular', 'without definite article')) {

    // let stem_split2 = splitOnAll(stem)
    // let form_split2 = splitOnAll(form)

    // attemptToFindUnchangeableRegion(word)


    /**
     * To find the difference from the stem we start by only looking at the consonants of the word
     */
    let consonants_in_stem = removeVowellikeClusters(stem)
    let consonants_in_form = removeVowellikeClusters(form)
    console.log({ consonants_in_stem, consonants_in_form })

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
  }






  /**
   * Highlight sound shifts.
   * Looks at the last and second-last vowel of the stem and
   * sees if it's different from the relevant vowel in the form
   */
  let umlauted_vowel_index;
  const stem_split = splitOnVowels(stripBeforeComparingToStem(stem, word))
  /* Split on vowels to reconstruct later */
  let form_split_original = splitOnVowels((form))
  /* Split on vowels *after* stripping endings, used to compare vowel changes */
  let form_split_stripped = splitOnVowels(stripBeforeComparingToStem(form, word))

  const last_stem_vowel_index = stem_split.length - 2
  const second_last_stem_vowel_index = stem_split.length - 4
  if (last_stem_vowel_index >= 0 &&
    form_split_stripped[last_stem_vowel_index] &&
    stem_split[last_stem_vowel_index] !== form_split_stripped[last_stem_vowel_index]) {
    umlauted_vowel_index = last_stem_vowel_index
  } else if (second_last_stem_vowel_index >= 0 &&
    form_split_stripped[second_last_stem_vowel_index] &&
    stem_split[second_last_stem_vowel_index] !== form_split_stripped[second_last_stem_vowel_index]) {
    umlauted_vowel_index = second_last_stem_vowel_index
  }
  if (umlauted_vowel_index) {
    // Add umlaut to stripped variant and then append the rest to support words like „sæir“
    const letters = form_split_stripped.join('').length
    const letters_remaining_after_stripped = form_split_original.join('').split('').slice(letters).join('')
    form_split_stripped[umlauted_vowel_index] = `<span class="umlaut">${form_split_stripped[umlauted_vowel_index]}</span>`
    output = form_split_stripped.join('') + letters_remaining_after_stripped
    hasUmlaut = true
  }


  /*
   * Highlight in entirety if word is considerably different from the stem
   * Skip over umlauted or last vowel since it was already checked above
   */
  const form_without_umlautable_vowel = removeItemAtIndex(form_split_stripped, umlauted_vowel_index).join('')
  const stem_without_umlautable_vowel = removeItemAtIndex(stem_split, umlauted_vowel_index).join('')
  if (!form_without_umlautable_vowel.startsWith(stem_without_umlautable_vowel)) {
    output = `<em class="irregular">${output}</em>`
    isIrregular = true
  }

  if (returnDescription) {
    return { hasUmlaut, isIrregular }
  } else {
    return output
  }
}

const removeItemAtIndex = (array, index_to_remove) => {
  if (index_to_remove === undefined) {
    return array
  }
  let output = array
  output.splice(index_to_remove, 1)
  return output
}




/*
  Testing...
*/
const attemptToFindUnchangeableRegion = (word) => {
  let x = word.getOriginal().rows.map(i => i.inflectional_form).map(removeVowellikeClusters)
  let shortest = Math.min(...x.map(i => i.length))
  let cut = x.map(i => i.slice(0, shortest))
  var mostCommonBeginning = _.head(_(cut).countBy().entries().maxBy(_.last));

  console.log({ x, shortest, cut, mostCommonBeginning })
}
