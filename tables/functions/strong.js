import { endsInConsonant } from './vowels'

/**
 * Strong or weak inflection
 * TODO: Pronouns
 *
 * @memberof Word
 * @return {?boolean}
 */
export function isStrong() {
  /* Noun */
  if (this.is('noun')) {
    /* TODO! What about where singular doesn't exist? */
    const table_to_check = this.getOriginal().get('singular', 'without definite article', '1').getForms()
    if (table_to_check.length === 0) return;
    return table_to_check.some(endsInConsonant)
  }
  /* Verb */
  else if (this.is('verb')) {
    const word = this.getOriginal().without(
      'impersonal with accusative subject',
      'impersonal with dative subject',
      'impersonal with genitive subject',
      'impersonal with dummy subject'
    ).get('active voice')

    const past_tense = word.get('indicative', 'past tense', '1st person', 'singular')
    /* Does not end in "-i" */
    return !/i$/.test(past_tense.getFirstValue())
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
  if (strong !== undefined) {
    return !strong
  }
}
