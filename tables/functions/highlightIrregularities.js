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
  const stem = word.getStem(true)
  if (!stem) return form;

  /**
   * Highlight sound shifts.
   * Looks at the last vowel of the stem and sees if it's different from the relevant vowel in the form
   */
  const stem_split = splitOnVowels(stem)
  let form_split = splitOnVowels(form)
  /* Gets the position of the last vowel of the stem */
  const relevant_wovel_index = stem_split.length - 2
  if (form_split[relevant_wovel_index] && stem_split[relevant_wovel_index] !== form_split[relevant_wovel_index]) {
    form_split[relevant_wovel_index] = `<span class="umlaut" style="color:#b00030">${form_split[relevant_wovel_index]}</span>`
    output = form_split.join('')
    hasUmlaut = true
  }

  /*
   * Highlight in entirety if word is considerably different from the stem
   * Skip over first vowel since it was already checked above
   */
  const form_without_umlautable_vowel = removeItem(form_split, relevant_wovel_index)
  const stem_without_umlautable_vowel = removeItem(stem_split, relevant_wovel_index)
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

const removeItem = (input, index) => {
  let output = input
  output.splice(index, 1)
  return output.join('')
}
