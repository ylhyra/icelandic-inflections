import assert from 'assert'
import { removeLastVowelCluster, splitOnVowels } from './vowels'
import Word from './../word'

/**
 * Gets the stem of a word. See: https://is.wikipedia.org/wiki/Stofn_(málfræði)
 *
 * @memberof Word
 * @param {object} options
 *   - masculinizeAdjectiveStem {boolean}
 * @return {?string}
 */
export function getStem(options) {
  if (this.is('noun')) {
    // TODO: Test words that don't have plural
    if (this.isStrong()) {
      return this.getOriginal().get('accusative', /*'without definite article', 'singular' */ ).getFirstValue()
    } else {
      const output = this.getOriginal().get('nominative', /*'without definite article', 'singular' */ ).getFirstValue()
      return removeLastVowelCluster(output)
    }
  }
  if (this.is('adjective')) {
    let stem = this.getOriginal().get('feminine',/* 'nominative', 'singular', 'positive degree', 'strong declension'*/).getFirstValue()
    if(!stem) return;
    /*
      For the purpose of highlighting umlauts,
      we want to get the stem with the vowel that's
      used in the masculine gender
    */
    if (options.masculinizeAdjectiveStem) {
      const stemLength = splitOnVowels(stem).filter(Boolean).length
      let masculine = this.getOriginal().get('masculine', 'nominative', 'singular', 'positive degree', 'strong declension').getFirstValue()
      return splitOnVowels(masculine).filter(Boolean).slice(0, stemLength).join('')
    } else {
      return stem
    }
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
