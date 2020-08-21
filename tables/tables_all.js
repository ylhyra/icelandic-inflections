import link, { ucfirst } from './link'
import Word from './word'
import { highlightIrregularities } from './functions/highlightIrregularities'
import { tags } from './classify'

/**
 * renderTables - Prints all tables for a given word
 *
 * @memberof Word
 * @return {string} HTML as string
 */
export default function renderTables() {
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
    table = GenerateTable(leaf.values, original_word, {
      column_names: tags['article'],
      row_names: tags['cases'],
    })
  }
  /* Pronouns */
  else if (word.is('pronoun') && tags['plurality'].includes(leaf.tag)) {
    table = GenerateTable(leaf.values, original_word, {
      column_names: tags['gender'],
      row_names: tags['cases']
    })
  }
  /* Personal pronouns */
  else if (word.is('personal pronoun')) {
    table = GenerateTable(leaf.values, original_word, {
      column_names: tags['plurality'],
      row_names: tags['cases']
    })
  }
  /* Reflexive pronouns */
  else if (word.is('reflexive pronoun')) {
    table = GenerateTable(leaf.values, original_word, {
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
    table = GenerateTable(leaf.values, original_word, {
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
      table = GenerateTable(leaf.values, original_word, {
        column_names: ['singular'],
        row_names: ['3rd person']
      })
    }
    /* Regular table */
    else {
      table = GenerateTable(leaf.values, original_word, {
        column_names: tags['plurality'],
        row_names: tags['person']
      })
    }
  }
  /* Imperative */
  else if (
    leaf.tag === 'imperative'
  ) {
    table = GenerateTable(leaf.values, original_word, {
      column_names: [null],
      row_names: ['singular', 'plural', 'clipped imperative']
    })
  }
  // else if (
  //   word.is('question form')
  // ) {
  //   table = GenerateTable(row.values, original_word, {
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

/**
 * GenerateTable - Converts description of table structure into a table
 *
 * @param {object|Word} input
 *   Can either be:
 *   - a leaf from ./tree.js on the form { tag: 'nominative', values: [] }
 *   - a Word
 * @param {Word} original_word
 *   If the first parameter is a leaf, we need to pass the original word
 *   as well so that we have all the information needed
 * @param {object} structure
 *   An object with the keys `column_names` and `row_names`,
 *   which are arrays describing what  they should contain:
 *   {
 *     column_names: tags['plurality'],
 *     row_names: tags['person']
 *   }
 * @returns {string} HTML string
 */
export const GenerateTable = (input, original_word, structure) => {
  const { column_names, row_names } = structure
  let word
  if (input instanceof Word) {
    word = input
  } else {
    word = (new Word()).importTree(input, original_word)
  }
  let table = []
  row_names.forEach((row_name, row_index) => {
    /* Add column names */
    if (row_index === 0 && column_names[0] !== null) {
      let column = []
      column.push(null)
      column_names.forEach((column_name, column_index) => {
        column.push(column_name)
      })
      table.push(column)
    }

    /* Loop over data */
    let column = []
    column_names.forEach((column_name, column_index) => {
      /* Add row names */
      if (column_index === 0) {
        column.push(row_name)
      }
      column.push(word.get(column_name, row_name))
    })
    table.push(column)
  })
  return TableHTML(table)
}


const TableHTML = (rows, highlight = []) => {
  return `
    <table class="table">
      <tbody>
        ${rows.map((row, row_index) => `
          <tr>
            ${row.map((cell, column_index) => {
              if(cell instanceof Word) {
                const shouldHighlight = true //highlight.length > 0 && cell.is(...highlight)
                return renderCell(cell, shouldHighlight)
              } else {
                let isCellToTheLeftEmpty =
                  rows[row_index][column_index - 1] === null
                let isCellAboveEmpty =
                  rows[row_index - 1] && (rows[row_index - 1][column_index] === null)
                let css_class = (
                  isCellAboveEmpty || isCellToTheLeftEmpty
                ) ? 'first-top' : ''
                return `<th colSpan="2" class="${css_class}">${link(ucfirst(cell)) || ''}</th>`
              }
            }).join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>
  `
}

export const renderCell = (word, shouldHighlight) => {
  /* No value */
  if(word.rows.length ===0 ){
    return '<td colSpan="2">–</td>'
  }
  const value = word.rows.map((row, index) => {
    return `<span>`+
      highlightIrregularities(row.inflectional_form, word) +
      (index + 1 < word.rows.length ? `<span class="light-gray"> / </span>` : '') +
    `</span>`
  }).join('')
  return `
    <td class="right ${shouldHighlight ? 'highlight' : ''}"><span class="gray">${word.getHelperWordsBefore()}</span></td>
    <td class="left ${shouldHighlight ? 'highlight' : ''}">
      <b>${value}</b><span class="gray">${word.getHelperWordsAfter()}</span>
    </td>
  `
}
