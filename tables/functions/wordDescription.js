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

  if (this.getIsWordIrregular()) {
    output += ', ' + link('irregular inflection')
  }
  if (this.getWordHasUmlaut()) {
    output += ', ' + link('includes a sound change')
  }
  if (!this.is('indeclinable') && this.getIsWordIrregular() === false && this.getWordHasUmlaut() === false) {
    output += ', ' + link('regular inflection')
  }

  return output
}
