/* See https://is.wikipedia.org/wiki/Stofn_(m%C3%A1lfr%C3%A6%C3%B0i) */
/* NOTE: This is not the "real" stem, it is simplified for the purpose of finding irregularities, it removes the last vowel which should be included for certain weak verbs  */
export function getStem(word) {
  if (word.is('noun')) {
    if (word.isStrong()) {
      return word.getOriginal().get('accusative', 'without definite article', 'singular').getFirstValue()
    } else {
      const x = word.getOriginal().get('nominative', 'without definite article', 'singular').getFirstValue()
      return x && x.replace((new RegExp(`([${vowels}]+)$`, 'i')), '')
    }
  }
  if (word.is('adjective')) {
    return word.getOriginal().get('feminine', 'nominative', 'singular', 'positive degree', 'strong declension').getFirstValue()
  }
  if (word.is('verb')) {
    const x = word.getOriginal().get('clipped imperative', 'active voice').getFirstValue()
    return x && x.replace((new RegExp(`([${vowels}]+)$`, 'i')), '')
  }
}
