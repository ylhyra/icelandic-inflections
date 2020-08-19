import link from './link'
import renderTables from './tables_all'
import renderSingleTable from './tables_single'
import tree from './tree'
import { getHelperWordsBefore, getHelperWordsAfter } from './functions/helperWords'
import { highlightIrregularities } from './functions/highlightIrregularities'
import { getPrincipalParts } from './functions/principalParts'
import { getStem } from './functions/stem'
import { isStrong, isWeak } from './functions/strong'
import { BIN_domains } from './classify'

class Word {
  constructor(rows, original) {
    this.form_classification = []
    this.word_class = []
    this.rows = []
    this.original = []

    Array.isArray(rows) && rows.forEach(({ word_class, form_classification }) => {
      this.form_classification = form_classification || []
      this.word_class = word_class || []
    })
    this.rows = rows
    if (original instanceof Word) {
      this.original = original.original
    } else {
      this.original = original || rows
    }
  }
  getId() {
    return this.original[0] && this.original[0].BIN_id
  }
  getBaseWord() {
    return this.original[0] && this.original[0].base_word || ''
  }
  is(...values) {
    return values.every(value => (
      this.form_classification.includes(value) ||
      this.word_class.includes(value)
    ))
  }
  get(...values) {
    return new Word(this.rows.filter(row => (
      values.filter(Boolean).every(value => row.form_classification.includes(value))
    )), this.original)
  }
  getOriginal() {
    return new Word(this.original)
  }
  getFirstValue() {
    return this.rows.length > 0 && this.rows[0].inflectional_form
  }
  without(...values) {
    return new Word(this.rows.filter(row => (
      values.filter(Boolean).every(value => !row.form_classification.includes(value))
    )), this.original)
  }
  getCases() {
    return [
      this.get('nominative'),
      this.get('accusative'),
      this.get('dative'),
      this.get('genitive'),
    ]
  }
  getType(type) {
    const classification = [...this.word_class, ...this.form_classification]
    switch (type) {
      case 'gender':
        return classification.find(i => ['masculine', 'feminine', 'neuter'].includes(i))
      case 'class':
        return [
          ...BIN_domains,
          'noun',
          'verb',
          'adjective',
          'preposition',
          'adverb',
          'article',
          'adjective',
          'infinitive particle',
          'verb',
          'conjunction',
          'interjection',
          'numeral',
          'ordinal number',
          'pronoun',
          'reflexive pronoun',
          'personal pronoun',
        ].find(i => classification.includes(i))
      case 'plurality':
        return classification.find(i => ['singular', 'plural'].includes(i))
      case 'article':
        return classification.find(i => ['with definite article', 'without definite article'].includes(i))
    }
  }
  dependingOnGender(...values) {
    return values[['masculine', 'feminine', 'neuter'].indexOf(this.getType('gender'))]
  }
  dependingOnSubject(...values) {
    /* Input is a list of [nom, acc, dat, get, dummy] */
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
    // console.log(this.word_class)
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
    // TODO: Does not make sense, needs restructuring
    this.form_classification = rows[0] && rows[0].form_classification || []
    this.word_class = rows[0] && rows[0].word_class || []
    return this
  }
}

Word.prototype.getHelperWordsBefore = getHelperWordsBefore
Word.prototype.getHelperWordsAfter = getHelperWordsAfter
Word.prototype.getPrincipalParts = getPrincipalParts
Word.prototype.getStem = getStem
Word.prototype.isStrong = isStrong
Word.prototype.isWeak = isWeak
Word.prototype.highlightIrregularities = highlightIrregularities
Word.prototype.renderTables = renderTables
Word.prototype.renderSingleTable = renderSingleTable

export default Word
