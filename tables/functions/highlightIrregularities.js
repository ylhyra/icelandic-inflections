import { endsInConsonant, splitOnVowels, splitOnAll, removeFirstVowel } from './vowels'

/**
 * TODO: Does not work well for compound words
 *
 * @param  {string} form
 * @param  {Word} word
 * @return {?string} HTML string
 */
export function highlightIrregularities(form, word) {
  let output = form
  const baseWord = word.getBaseWord()
  if (!baseWord) return form;

  /* Highlight sound shifts */
  const baseWord_split = splitOnVowels(baseWord)
  let form_split = splitOnVowels(form)
  const baseWord_first_vowel = baseWord_split[1]
  const form_first_vowel = form_split[1]
  if (baseWord_first_vowel !== form_first_vowel) {
    form_split[1] = `<span class="umlaut" style="color:#b00030">${form_split[1]}</span>`
    output = form_split.join('')
  }

  /* Highlight in entirety if word is considerably different from the stem */
  const stem = word.getStem(true)
  if (stem) {
    /*
      Is there a change in the stem region?
      Skip over first vowel since it was already checked above
    */
    if (!removeFirstVowel(form).startsWith(removeFirstVowel(stem))) {
      output = `<em class="irregular">${output}</em>`
    }
  }

  return output
}
