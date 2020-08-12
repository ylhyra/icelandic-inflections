import link from './link'
import Table from './table'
import tree from './tree'
import { getHelperWordsBefore, getHelperWordsAfter } from './helperWords'
import { endsInVowel, endsInConsonant } from './functions'

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
    this.original = original || rows
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
        return classification.find(i => [
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
        ].includes(i))
      case 'plurality':
        return classification.find(i => ['singular', 'plural'].includes(i))
      case 'article':
        return classification.find(i => ['with definite article', 'without definite article'].includes(i))
    }
  }
  getHelperWordsBefore() {
    return getHelperWordsBefore(this)
  }
  getHelperWordsAfter() {
    return getHelperWordsAfter(this)
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
  getId() {
    return this.original[0].BIN_id
  }
  getBaseWord() {
    // console.log(this.original)
    return this.original[0].base_word
  }
  getTable() {
    return Table(this)
  }
  getRows() {
    return this.rows
  }
  getTree() {
    return tree(this.rows)
  }
  render() {
    const value = this.rows.map((row, index) => {
      return `<b>${row.inflectional_form}</b>`
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
    this.form_classification = rows[0].form_classification
    this.word_class = rows[0].word_class
    return this
  }
  isStrong() {
    if (this.is('verb')) {
      const word = this.without(
        'impersonal with accusative subject',
        'impersonal with dative subject',
        'impersonal with genitive subject',
        'impersonal with dummy subject',
      ).get('active voice')

      const past_tense = word.get('indicative', 'past tense', '1st person', 'singular')
      /* Does not end in "-i" */
      return !/i$/.test(past_tense.getFirstValue())
    } else if (this.is('noun')) {
      return this.get('singular', 'without definite article').getCases().some(endsInConsonant)
    }
  }
  /* Principal parts (kennimyndir) */
  getPrincipalParts() {
    if (this.is('verb')) {
      const word = this.without(
        'impersonal with accusative subject',
        'impersonal with dative subject',
        'impersonal with genitive subject',
        'impersonal with dummy subject',
      ).get('active voice')

      let principalParts = [
        word.get('infinitive'),
        word.get('indicative', 'past tense', '1st person', 'singular'),
        word.isStrong() && word.get('indicative', 'past tense', '1st person', 'plural'),
        word.get('supine'),
      ]
      return principalParts.filter(Boolean).map(i => i.render()).join(', ')
    }
    return ''
  }
}

export default Word
