import { removeLastVowel } from './vowels'

/**
 * Gets the stem of a word. See: https://is.wikipedia.org/wiki/Stofn_(málfræði)
 *
 * @memberof Word
 * @param  {?boolean} trimVowelFromWeakVerbs
 *   The real stem of certain weak verbs ends in a vowel.
 *   We want to trim it for the purpose of finding irregularities.
 * @return {?string}
 */
export function getStem(trimVowelFromWeakVerbs) {
  if (this.is('noun')) {
    if (this.isStrong()) {
      return this.getOriginal().get('accusative', 'without definite article', 'singular').getFirstValue()
    } else {
      const output = this.getOriginal().get('nominative', 'without definite article', 'singular').getFirstValue()
      return removeLastVowel(output)
    }
  }
  if (this.is('adjective')) {
    return this.getOriginal().get('feminine', 'nominative', 'singular', 'positive degree', 'strong declension').getFirstValue()
  }
  if (this.is('verb')) {
    const output = this.getOriginal().get('clipped imperative', 'active voice').getFirstValue()
    /* Remove last vowel */
    if (trimVowelFromWeakVerbs && !this.isStrong()) {
      return removeLastVowel(output)
    } else if (this.isStrong() || !trimVowelFromWeakVerbs) {
      return output
    }
  }
}
