import link from './link'
import Word from './word'
import { tags } from './classify'
import { RenderTable, renderCell } from './render_table'

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
  const word = (new Word()).importTree(leaf, original_word)
  /* Nouns */
  if (word.is('noun') && tags['plurality'].includes(leaf.tag)) {
    table = RenderTable(leaf.values, original_word, {
      column_names: tags['article'],
      row_names: tags['cases'],
    })
  }
  /* Pronouns */
  else if (word.is('pronoun') && tags['plurality'].includes(leaf.tag)) {
    table = RenderTable(leaf.values, original_word, {
      column_names: tags['gender'],
      row_names: tags['cases']
    })
  }
  /* Personal pronouns */
  else if (word.is('personal pronoun')) {
    table = RenderTable(leaf.values, original_word, {
      column_names: tags['plurality'],
      row_names: tags['cases']
    })
  }
  /* Reflexive pronouns */
  else if (word.is('reflexive pronoun')) {
    table = RenderTable(leaf.values, original_word, {
      column_names: [null],
      row_names: tags['cases']
    })
  }
  /* Adjectives */
  else if (
    (word.is('adjective') ||
      word.is('past participle') ||
      word.is('ordinal number') ||
      word.is('numeral')
    ) && tags['plurality'].includes(leaf.tag)
  ) {
    table = RenderTable(leaf.values, original_word, {
      column_names: tags['gender'],
      row_names: tags['cases']
    })
  }
  /* Verbs */
  else if (
    word.is('verb') && tags['tense'].includes(leaf.tag) &&
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
        column_names: tags['plurality'],
        row_names: tags['person']
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
  }
  // else if (
  //   word.is('question form')
  // ) {
  //   table = RenderTable(row.values, original_word, {
  //     column_names: [null],
  //     row_names: ['singular', 'plural', 'clipped imperative']
  //   })
  // }

  const output = table || (leaf.values ?
    leaf.values.map(i => TraverseTree(i, original_word)).join('') :
    `<table class="table not-center"><tbody><tr>${renderCell(new Word([leaf], original_word))}</tr></tbody></table>`
  )

  if (leaf.tag) {
    return `<dl class="indent">
      <dt>${link(leaf.tag)}</dt>
      <dd>${output}</dd>
    </dl>`
  } else {
    return output
  }
}
