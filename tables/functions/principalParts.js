/**
 * Principal parts (kennimyndir)
 * @memberof Word
 * @return {?boolean}
 */
export function getPrincipalParts() {
  if (this.is('verb')) {
    /* Todo: Remove. Not needed as "get first" gets the first */
    // const word = this.getOriginal().without(
    //   'impersonal with accusative subject',
    //   'impersonal with dative subject',
    //   'impersonal with genitive subject',
    //   'impersonal with dummy subject'
    // ).get('active voice')

    let principalParts = [
      this.get('infinitive'),
      this.get( /*'indicative', */ 'past tense', /* '1st person', 'singular'*/ ),
      this.isStrong() && this.get( /*'indicative',*/ 'past tense', /*'1st person',*/ 'plural'),
      this.get('supine'),
    ]
    // console.log(this.getFirst().render())
    // console.log(this.get('past tense').rows.length/*.getFirst()/*.render()*/)
    return principalParts.filter(Boolean).map(i => i.getFirstAndItsVariants().render()).join(', ')
  }
  return ''
}
