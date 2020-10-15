import link, { ucfirst } from './link'
import Word, { WordFromTree } from './word'
import RenderTable, { renderCell } from './render_table'
import { types } from './classification/classification'

/**
 * getTables - Prints all tables for a given word
 *
 * @memberof Word
 * @return {string} HTML as string
 */
export default function getTables() {
  return TraverseTree(this.getTree(), this)
}

/**
 * TraverseTree - Recursively goes through the tree from ./tree.js and prints all tables
 *
 * @param {object} leaf - Leaf from ./tree.js on the form { tag: 'nominative', values: [] }
 * @param {Word} original_word
 * @return {string} HTML as string
 */
const TraverseTree = (leaf, original_word) => {
  let table = null
  const word = WordFromTree(leaf, original_word)
  /* Nouns */
  if (word.is('noun') && types['plurality'].includes(leaf.tag)) {
    table = RenderTable(leaf.values, original_word, {
      column_names: types['article'],
      row_names: types['cases'],
    })
  }
  /* Pronouns */
  else if ((word.is('pronoun') || word.is('article')) && types['plurality'].includes(leaf.tag)) {
    table = RenderTable(leaf.values, original_word, {
      column_names: types['gender'],
      row_names: types['cases']
    })
  }
  /* Personal pronouns */
  else if (word.is('personal pronoun')) {
    table = RenderTable(leaf.values, original_word, {
      column_names: types['plurality'],
      row_names: types['cases']
    })
  }
  /* Reflexive pronouns */
  else if (word.is('reflexive pronoun')) {
    table = RenderTable(leaf.values, original_word, {
      column_names: [null],
      row_names: types['cases']
    })
  }
  /* Adjectives */
  else if (
    (word.is('adjective') ||
      word.is('past participle') ||
      word.is('ordinal number') ||
      word.is('numeral')
    ) && types['plurality'].includes(leaf.tag)
  ) {
    table = RenderTable(leaf.values, original_word, {
      column_names: types['gender'],
      row_names: types['cases']
    })
  }
  /* Verbs */
  else if (
    word.is('verb') && types['tense'].includes(leaf.tag) &&
    !word.is('question form')
  ) {
    /* Dummy subjects */
    if (word.is('impersonal with dummy subject')) {
      table = RenderTable(leaf.values, original_word, {
        column_names: ['singular'],
        row_names: ['3rd person']
      })
    }
    /* Regular table */
    else {
      table = RenderTable(leaf.values, original_word, {
        column_names: types['plurality'],
        row_names: types['person']
      })
    }
  }
  /* Imperative */
  else if (
    leaf.tag === 'imperative'
  ) {
    table = RenderTable(leaf.values, original_word, {
      column_names: [null],
      row_names: ['singular', 'plural', 'clipped imperative']
    })
  } else if (
    word.is('question form') &&
    types['tense'].includes(leaf.tag)
  ) {
    table = RenderTable(leaf.values, original_word, {
      column_names: types['plurality'],
      row_names: ['2nd person']
    })
  }

  const output = table || (leaf.values ?
    leaf.values.map(i => TraverseTree(i, original_word)).join('') :
    `<table class="table not-center"><tbody><tr>${renderCell(new Word([leaf], original_word))}</tr></tbody></table>`
  )

  if (leaf.tag) {
    return `<dl class="indent">
      <dt>${link(ucfirst(leaf.tag))}</dt>
      <dd>${output}</dd>
    </dl>`
  } else {
    return output
  }
}
