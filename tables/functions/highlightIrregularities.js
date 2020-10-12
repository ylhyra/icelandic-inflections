import { endsInConsonant, splitOnVowels, splitOnAll } from './vowels'

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

  /**
   * Highlight sound shifts.
   * Looks at the last and second-last vowel of the stem and
   * sees if it's different from the relevant vowel in the form
   */
  let umlauted_vowel_index;
  const stem_split = splitOnVowels(stem)
  let form_split = splitOnVowels(form)
  const last_stem_vowel_index = stem_split.length - 2
  const second_last_stem_vowel_index = stem_split.length - 4
  if (last_stem_vowel_index >= 0 &&
    form_split[last_stem_vowel_index] &&
    stem_split[last_stem_vowel_index] !== form_split[last_stem_vowel_index]) {
    umlauted_vowel_index = last_stem_vowel_index
  } else if (second_last_stem_vowel_index >= 0 &&
    form_split[second_last_stem_vowel_index] &&
    stem_split[second_last_stem_vowel_index] !== form_split[second_last_stem_vowel_index]) {
    umlauted_vowel_index = second_last_stem_vowel_index
  }
  if (umlauted_vowel_index) {
    form_split[umlauted_vowel_index] = `<span class="umlaut">${form_split[umlauted_vowel_index]}</span>`
    output = form_split.join('')
    hasUmlaut = true
  }


  /*
   * Highlight in entirety if word is considerably different from the stem
   * Skip over umlauted or last vowel since it was already checked above
   */
  const form_without_umlautable_vowel = removeItem(form_split, umlauted_vowel_index).join('')
  const stem_without_umlautable_vowel = removeItem(stem_split, umlauted_vowel_index).join('')
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

const removeItem = (array, index_to_remove) => {
  if (index_to_remove === undefined) {
    return array
  }
  let output = array
  output.splice(index_to_remove, 1)
  return output
}
