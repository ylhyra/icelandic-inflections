import getTables from './tables_all'
import getSingleTable from './tables_single'
import tree, { isNumber } from './tree'
import { getHelperWordsBefore, getHelperWordsAfter } from './functions/helperWords'
import { getPrincipalParts } from './functions/principalParts'
import { getWordDescription } from './functions/wordDescription'
import { getWordNotes } from './functions/wordNotes'
import { getStem } from './functions/stem'
import { isStrong, isWeak } from './functions/strong'
import { removeIncorrectVariants } from './functions/incorrectVariants'
import { types, normalizeTag } from './classification/classification'
import { uniq } from 'lodash'
import { FindIrregularities } from './irregularities/irregularities'

class Word {
  /**
   * @param {array} rows
   * @param {?Word} original
   */
  constructor(rows, original, skipInitialization) {
    if (!Array.isArray(rows) && rows !== undefined) {
      // console.log(rows)
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
    } else if (original) {
      // console.log(original)
      throw new Error('Expected original to be a Word');
    } else {
      this.original = this
    }


    if (rows && !original) {
      if (this.rows.length === 0) {
        if(process.env.NODE_ENV==='development'){
          throw new Error('Word created with empty rows')
        }
      }
      this.setup()
      // console.log(this.rows.map(r => r.formattedOutput))
    }
  }
  setup() {
    // console.log(this.rows[0])
    if ('alreadySetup' in this) {
      throw new Error('Has already been set up')
    }
    this.FindIrregularities()
    this.alreadySetup = true
  }
  getId() {
    return this.original.rows.length > 0 && this.original.rows[0].BIN_id
  }
  getBaseWord() {
    return this.original.rows.length > 0 && this.original.rows[0].base_word || ''
  }
  getIsWordIrregular() {
    return this.original.wordIsIrregular
  }
  getWordHasUmlaut() {
    return this.original.wordHasUmlaut
  }
  is(...values) {
    return values.every(value => {
      /* Test word_categories */
      if (this.getWordCategories().includes(normalizeTag(value))) {
        return true
      }
      /* Test inflectional_form_categories */
      return this.rows.length > 0 && this.rows.every(row => (
        row.inflectional_form_categories.includes(normalizeTag(value))
      ))
    })
  }
  isAny(...values) {
    return values.some(value => {
      /* Test word_categories */
      if (this.getWordCategories().includes(normalizeTag(value))) {
        return true
      }
      /* Test inflectional_form_categories */
      return this.rows.length > 0 && this.rows.every(row => (
        row.inflectional_form_categories.includes(normalizeTag(value))
      ))
    })
  }
  get(...values) {
    if (!values) return this;
    if (values.some(value => !(typeof value === 'string' || typeof value === 'number' || value === null))) {
      /* Todo: Would be good to also support array passes */
      // console.log(values)
      throw new Error('You must pass parameters as spread into get()')
    }
    return new Word(this.rows.filter(row => (
      values.filter(Boolean).every(value =>
        row.inflectional_form_categories.includes(normalizeTag(value))
        // || row.word_categories.includes(value) // Should not be needed
      )
    )), this)
  }
  /*
    Returns all that meet *any* of the input values
  */
  getMeetingAny(...values) {
    if (!values) return this;
    if (values.filter(Boolean).length === 0) return this;
    return new Word(this.rows.filter(row => (
      values.filter(Boolean).some(value =>
        row.inflectional_form_categories.includes(normalizeTag(value))
      )
    )), this)
  }
  getOriginal() {
    if (this.original.rows.length === 0) throw new Error('Empty original')
    return this.original
  }
  getFirst() {
    return new Word(this.rows.slice(0, 1), this)
  }
  getFirstAndItsVariants() {
    return this.get(...this.getFirstClassification())
  }
  getFirstValue() {
    return this.rows.length > 0 && this.rows[0].inflectional_form || undefined
  }
  getFirstValueRendered() {
    // console.log(this)
    return this.rows.length > 0 && this.rows[0].formattedOutput || undefined
  }
  getValues() {
    return this.rows.map(row => row.inflectional_form)
  }
  getForms() {
    return this.rows.map(row => row.inflectional_form)
  }
  getWordCategories() {
    return this.original.rows[0] && this.original.rows[0].word_categories || []
  }
  getFirstClassification() {
    return this.rows.length > 0 && this.rows[0].inflectional_form_categories.filter(i => !isNumber(i)) || []
  }
  without(...values) {
    return new Word(this.rows.filter(row => (
      values.filter(Boolean).every(value => !row.inflectional_form_categories.includes(normalizeTag(value)))
    )), this)
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
      /* formattedOutput contains umlaut higlights */
      return row.formattedOutput || row.inflectional_form
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
  /**
    A snippet is a short example of a conjugation to display in search results
  */
  getSnippet() {
    if (this.is('verb')) {
      return this.getPrincipalParts()
    }
    return this.getSingleTable({ returnAsString: true })
  }
}

export const WordFromTree = (input, original) => {
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
  return new Word(rows, original)
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
