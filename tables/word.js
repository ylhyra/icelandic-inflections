import getTables from './tables_all'
import getSingleTable from './tables_single'
import tree, { isNumber } from './tree'
import { getHelperWordsBefore, getHelperWordsAfter } from './functions/helperWords'
/* TODO: Remove */
import { highlightIrregularities } from './functions/highlightIrregularities'
import { getPrincipalParts } from './functions/principalParts'
import { getWordDescription } from './functions/wordDescription'
import { getWordNotes } from './functions/wordNotes'
import { getStem } from './functions/stem'
import { isStrong, isWeak } from './functions/strong'
import { removeIncorrectVariants } from './functions/incorrectVariants'
import { types } from './classification/classification'
import { uniq } from 'lodash'
import { FindIrregularities } from './irregularities/irregularities'

class Word {
  constructor(rows, original) {
    if (!Array.isArray(rows) && rows !== undefined) {
      throw new Error(`Class "Word" expected parameter "rows" to be an array or undefined, got ${typeof rows}`)
    }
    rows = rows || []

    /* Test for broken input */
    if (!original) {
      if (!rows.every(row => {
          return typeof row === 'object' && 'inflectional_form_categories' in row
        })) throw new Error('Malformed input to Word');
    }

    rows = removeIncorrectVariants(rows)
    this.rows = rows
    if (original instanceof Word) {
      this.original = original.original
    } else {
      this.original = original || rows
    }

    if (rows && !original) {
      this.setup()
    }
  }
  setup() {
    if ('wordHasUmlaut' in this) {
      throw new Error('Has already been set up')
    }
    this.FindIrregularities()
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
  getIsWordIrregular() {
    return this.wordIsIrregular
  }
  getWordHasUmlaut() {
    return this.wordHasUmlaut
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
    if (!values) return this;
    if (values.some(value => !(typeof value === 'string' || value === null))) {
      /* Todo: Would be good to also support array passes */
      // console.log(values)
      throw new Error('You must pass parameters as spread into get()')
    }
    return new Word(this.rows.filter(row => (
      values.filter(Boolean).every(value =>
        row.inflectional_form_categories.includes(value)
        // || row.word_categories.includes(value) // Should not be needed
      )
    )), this.original)
  }
  /*
    Returns all that meet *any* of the input values
  */
  getMeetingAny(...values) {
    if (!values) return this;
    if (values.filter(Boolean).length === 0) return this;
    return new Word(this.rows.filter(row => (
      values.filter(Boolean).some(value =>
        row.inflectional_form_categories.includes(value)
      )
    )), this.original)
  }
  getOriginal() {
    return new Word(this.original)
  }
  getFirst() {
    return new Word(this.rows.slice(0, 1))
  }
  getFirstAndItsVariants() {
    return this.get(...this.getFirstClassification())
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
   * Three values are inputted, a value is returned
   * based on the gender of the word.
   * Used when generating helper words
   * @param  {...array} values
   */
  dependingOnGender(...values) {
    return values[['masculine', 'feminine', 'neuter'].indexOf(this.getType('gender'))]
  }
  /**
   * Five values are inputted, a value is returned
   * based on the subject type of the verb
   * Used when generating helper words
   * @param  {...array} values
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
  /* Returns array */
  renderForms() {
    let word = this
    return this.rows.map(row => {
      return highlightIrregularities(row.inflectional_form, word)
    })
  }
  /* Returns string with helper words */
  render() {
    let output =
      this.getHelperWordsBefore() + ' ' +
      this.renderForms().map(i => `<b>${i}</b>`).join(' / ') +
      this.getHelperWordsAfter()
    return output.trim()
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
    this.setup()
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
Word.prototype.getWordDescription = getWordDescription
Word.prototype.getWordNotes = getWordNotes
Word.prototype.FindIrregularities = FindIrregularities

export default Word
