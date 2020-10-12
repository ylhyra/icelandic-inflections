import link from './../link'

/**
 * @memberof Word
 * @return {?string}
 */
export function getWordDescription() {
  let output = ''

  if (this.is('noun')) {
    output += link(this.getType('gender')) + ' '
  }
  output += link(this.getType('class'))

  const isStrong = this.isStrong()
  if (isStrong === true) {
    output += ', ' + link('strongly conjugated')
  } else if (isStrong === false) {
    output += ', ' + link('weakly conjugated')
  }

  const { hasUmlaut, isIrregular } = this.isWordIrregular()
  if (isIrregular) {
    output += ', ' + link('irregular inflection')
  }
  if (hasUmlaut) {
    output += ', ' + link('includes a sound change')
  }
  if (!isIrregular && !hasUmlaut) {
    output += ', ' + link('regular inflection')
  }

  return output
}
