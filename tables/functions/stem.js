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



/**
 * Certain words are too difficult to stem without
 * knowing what word endings are common.
 * Turns "farinn" into "far"
 * Notes:
 *   - Only runs for adjectives, since this trick does not work for "asni"
 * @param {string} input
 * @param {word} Word
 * @return {?string}
 */
export const stripBeforeComparingToStem = (input, word) => {
  if (!input) return;
  let stripped

  if (word.is('adjective') || word.is('past participle')) {
    stripped = input.replace(adjectiveEndings, '')
  } else if (word.is('verb')) {
    stripped = input.replace(verbEndings, '')
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

/* Common endings for definite articles and for adjectives */
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
