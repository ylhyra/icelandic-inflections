import { removeLastVowelCluster, splitOnVowels } from './vowels'

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
    if (this.isStrong()) {
      return this.getOriginal().get('accusative', 'without definite article', 'singular').getFirstValue()
    } else {
      const output = this.getOriginal().get('nominative', 'without definite article', 'singular').getFirstValue()
      return removeLastVowelCluster(output)
    }
  }
  if (this.is('adjective')) {
    let stem = this.getOriginal().get('feminine', 'nominative', 'singular', 'positive degree', 'strong declension').getFirstValue()
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



/*
  Certain words are too difficult to stem without
  knowing what word endings are common.
  Turns "farinn" into "far"
*/
export const stripBeforeComparingToStem = (input) => {
  if (!input) return;
  const stripped = input.replace(endingsRegex, '')
  /* Check to see if there is at least one vowel left in stipped output */
  if (splitOnVowels(stripped).length > 1) {
    return stripped
  } else {
    return input
  }
}
const endings = [
  'an',
  'anna',
  'ið',
  'in',
  'inn',
  'ins',
  'ins',
  'inu',
  'inum',
  'nir',
  'nar',
  'num',
  'una',
  'unnar',
  'unni',
  'unum',
]
const endingsRegex = (new RegExp(`(${endings.sort((a, b) => (b.length - a.length)).join('|')})^`))
