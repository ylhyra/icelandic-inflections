import { removeLastVowelCluster } from './vowels'

/**
 * Gets the stem of a word. See: https://is.wikipedia.org/wiki/Stofn_(málfræði)
 *
 * @memberof Word
 * @return {?string}
 */
export function getStem() {
  if (this.is('noun')) {
    if (this.isStrong()) {
      return this.getOriginal().get('accusative', 'without definite article', 'singular').getFirstValue()
    } else {
      const output = this.getOriginal().get('nominative', 'without definite article', 'singular').getFirstValue()
      return removeLastVowelCluster(output)
    }
  }
  if (this.is('adjective')) {
    return this.getOriginal().get('feminine', 'nominative', 'singular', 'positive degree', 'strong declension').getFirstValue()
  }
  if (this.is('numeral')) {
    return this.getOriginal().get('feminine', 'nominative', 'singular').getFirstValue()
  }
  if (this.is('verb')) {
    const output = this.getOriginal().get('clipped imperative', 'active voice').getFirstValue()
    /* Remove last vowel */
    if (this.isWeak()) {
      return removeLastVowelCluster(output)
    } else {
      return output
    }
  }
}
