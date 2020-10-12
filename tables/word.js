import link from './link'
import getTables from './tables_all'
import getSingleTable from './tables_single'
import tree, { isNumber } from './tree'
import { getHelperWordsBefore, getHelperWordsAfter } from './functions/helperWords'
import { highlightIrregularities } from './functions/highlightIrregularities'
import { getPrincipalParts } from './functions/principalParts'
import { getStem } from './functions/stem'
import { isStrong, isWeak } from './functions/strong'
import { BIN_domains } from './classification/BIN_classification'
import { types } from './classification/classification'
import { uniq, last } from 'lodash'

class Word {
  constructor(rows, original, options) {
    if (!Array.isArray(rows) && rows !== undefined) {
      throw `Class "Word" expected parameter "rows" to be an array or undefined, got ${typeof rows}`
    }
    rows = rows || []

    /* Remove incorrect variants */
    if (true) {
      rows = rows.filter(row => {
        /* Leave the first item */
        if(last(row.inflectional_form_categories) === '1') {
          return true
        }
        /* Leave subsequent items if they are correct */
        if (row.correctness_grade_of_inflectional_form == '1'){
          return true
        }
        return false
      })
    }

    this.rows = rows
    if (original instanceof Word) {
      this.original = original.original
    } else {
      this.original = original || rows
    }
  }
  getId() {
    return this.original.length > 0 && this.original[0].BIN_id
  }
  getBaseWord() {
    return this.original.length > 0 && this.original[0].base_word || ''
  }
  /**
    A snippet is a short example of a conjugation to display in search results
  */
  getSnippet() {
    if (this.is('verb')) {
      return this.getPrincipalParts()
    }
    return this.getSingleTable({ returnAsString: true })
  }
  isWordIrregular() {
    let hasUmlaut, isIrregular
    const word = this
    const all_forms = uniq(this.getOriginal().get('1').rows.map(row => row.inflectional_form))
    all_forms.forEach(form => {
      const results = highlightIrregularities(form, word, true)
      hasUmlaut = results.hasUmlaut || hasUmlaut
      isIrregular = results.isIrregular || isIrregular
    })
    return { hasUmlaut, isIrregular }
  }
  is(...values) {
    return values.every(value => {
      /* Test word_categories */
      if (this.getWordCategories().includes(value)) {
        return true
      }
      /* Test inflectional_form_categories */
      return this.rows.length > 0 && this.rows.every(row => (
        row.inflectional_form_categories.includes(value)
      ))
    })
  }
  get(...values) {
    return new Word(this.rows.filter(row => (
      values.filter(Boolean).every(value => row.inflectional_form_categories.includes(value))
    )), this.original)
  }
  getOriginal() {
    return new Word(this.original)
  }
  getFirst() {
    return new Word(this.rows.slice(0, 1))
  }
  getFirstValue() {
    return this.rows.length > 0 && this.rows[0].inflectional_form
  }
  getForms() {
    return this.rows.map(row => row.inflectional_form)
  }
  getWordCategories() {
    return this.original[0] && this.original[0].word_categories || []
  }
  getFirstClassification() {
    return this.rows.length > 0 && this.rows[0].inflectional_form_categories.filter(i => !isNumber(i)) || []
  }
  without(...values) {
    return new Word(this.rows.filter(row => (
      values.filter(Boolean).every(value => !row.inflectional_form_categories.includes(value))
    )), this.original)
  }
  /**
   * Used to ask "which case does this word have?"
   * E.g. getType('case') returns 'nominative'
   *
   * @param  {string} type
   * @return {?string}
   */
  getType(type) {
    const classification = [
      ...this.getWordCategories(),
      // TODO: Should we get first class or that which applies to all?
      ...this.getFirstClassification(),
    ]
    let relevantTypes = types[type]
    if (!relevantTypes) return;
    return classification.find(i => relevantTypes.includes(i))
  }

  /**
   * @param  {...array} values - Three values are inputted,
   * a value is returned based on the gender of the word
   */
  dependingOnGender(...values) {
    return values[['masculine', 'feminine', 'neuter'].indexOf(this.getType('gender'))]
  }
  /**
   * @param  {...array} values - Five values are inputted,
   * a value is returned based on the subject type of the verb
   */
  dependingOnSubject(...values) {
    if (this.is('impersonal with accusative subject')) {
      return values[1]
    } else if (this.is('impersonal with dative subject')) {
      return values[2]
    } else if (this.is('impersonal with genitive subject')) {
      return values[3]
    } else if (this.is('impersonal with dummy subject')) {
      return values[4]
    } else {
      return values[0]
    }
  }
  getRows() {
    return this.rows
  }
  getTree() {
    return tree(this.rows)
  }
  getWordDescription() {
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
  render() {
    let word = this
    const value = this.rows.map((row, index) => {
      return `<b>${highlightIrregularities(row.inflectional_form, word)}</b>`
    }).join(' / ')
    return this.getHelperWordsBefore() + ' ' + value + this.getHelperWordsAfter()
  }
  importTree(input, original_word) {
    let rows = []
    const traverse = (x) => {
      if (Array.isArray(x)) {
        x.map(traverse)
      } else if (x.values) {
        x.values.map(traverse)
      } else {
        rows.push(x)
      }
    }
    traverse(input)
    this.rows = rows
    this.original = (original_word && original_word.original) || rows
    return this
  }
}

Word.prototype.getHelperWordsBefore = getHelperWordsBefore
Word.prototype.getHelperWordsAfter = getHelperWordsAfter
Word.prototype.getPrincipalParts = getPrincipalParts
Word.prototype.getStem = getStem
Word.prototype.isStrong = isStrong
Word.prototype.isWeak = isWeak
Word.prototype.getTables = getTables
Word.prototype.getSingleTable = getSingleTable

export default Word
