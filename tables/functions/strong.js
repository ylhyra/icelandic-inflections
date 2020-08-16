import { endsInConsonant } from './vowels'

/**
 * Strong or weak inflection
 *
 * @memberof Word
 * @return {?boolean}
 */
export function isStrong() {
  if (this.is('verb')) {
    const word = this.getOriginal().without(
      'impersonal with accusative subject',
      'impersonal with dative subject',
      'impersonal with genitive subject',
      'impersonal with dummy subject'
    ).get('active voice')

    const past_tense = word.get('indicative', 'past tense', '1st person', 'singular')
    /* Does not end in "-i" */
    return !/i$/.test(past_tense.getFirstValue())
  } else if (this.is('noun')) {
    return this.getOriginal().get('singular', 'without definite article').getCases().some(endsInConsonant)
  }
}

/**
 * Opposite of the above
 *
 * @memberof Word
 * @return {?boolean}
 */
export function isWeak() {
  const strong = this.isStrong()
  if(strong !== undefined) {
    return !strong
  }
}
