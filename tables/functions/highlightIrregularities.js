import { splitOnVowels, removeVowellikeClusters, splitOnAll } from './vowels'
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


  // /*
  //  *
  //  *  testing....
  //  */
  // if (word.is('nominative', 'singular', 'without definite article')) {
  //
  //   let stem_split2 = splitOnAll(stem)
  //   let form_split2 = splitOnAll(form)
  //
  //   attemptToFindUnchangeableRegion(word)
  //
  //
  //
  //
  // }








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
  var mostCommonBeginning = _.head(_(cut)
  .countBy()
  .entries()
  .maxBy(_.last));

  console.log({ x, shortest, cut ,mostCommonBeginning})
}








/**
 * Certain words are too difficult to stem without
 * knowing what word endings are common.
 * Turns "farinn" into "far"
 * Notes:
 *   - Only runs for adjectives, since this trick does not work for "asni"
 * TODO This is a total hack, needs a complete revamp
 * @param {string} input
 * @param {word} Word
 * @return {?string}
 */
export const stripBeforeComparingToStem = (input, word) => {
  if (!input) return;
  let stripped

  if (word.is('adjective') || word.is('past participle') || word.is('with definite article')) {
    stripped = input.replace(adjectiveEndings, '')
  } else if (word.is('verb')) {
    stripped = input.replace(verbEndings, '')
  } else if (word.is('noun')) {
    stripped = input.replace(nounEndings, '')
  }
  // if(input==='sæir'){
  //   console.log({input,stripped})
  // }
  /* Check to see if there is at least one vowel left in stipped output */
  if (stripped && splitOnVowels(stripped).length > 1) {
    return stripped
  } else {
    return input
  }
}



const splittableRegexEndingsFromArray = string => {
  return new RegExp(`(${string.sort((a, b) => (b.length - a.length)).join('|')})$`)
}

const nounEndings = splittableRegexEndingsFromArray([
  'ri',
  'rið',
  'rinu',
  'rinum',
  'rum',
])

const adjectiveEndings = splittableRegexEndingsFromArray([
  'an',
  'anna',
  'ið',
  'in',
  'inn',
  'inna',
  'innar',
  'inni',
  'ins',
  'inu',
  'inum',
  'na',
  'nar',
  'ni',
  'nir',
  'nu',
  'num',
  'una',
  'unnar',
  'unni',
  'unum',
])

const verbEndings = splittableRegexEndingsFromArray([
  'ðu',
  'ið',
  'iði',
  'ir',
  'ist',
  'ju',
  'juð',
  'jum',
  'jumst',
  'just',
  'st',
  'uði',
  'um',
  'umst',
  'uð',
  'u',
  'i',
  'irðu',
  'juði',
  'usti',
  'justi',
  'istu',
  'andi',
  // Mediopassive
  'isti',
  'usti',
])
