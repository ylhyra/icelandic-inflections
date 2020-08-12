import link from './link'
import Word from './word'
import { highlightIrregularities } from './functions'
export default (word) => {
  const original_word = word
  return TraverseTree(word.getTree(), word, original_word)
}

const TraverseTree = (row, word, original_word) => {
  let table = null
  word = (new Word()).importTree(row, original_word)
  // console.log(word)
  /* Nouns */
  if (word.is('noun') && ['singular', 'plural'].includes(row.tag)) {
    table = GenerateTable(row.values, original_word, {
      column_names: ['without definite article', 'with definite article'],
      row_names: ['nominative', 'accusative', 'dative', 'genitive']
    })
  }
  /* Pronouns */
  else if (word.is('pronoun') && ['singular', 'plural'].includes(row.tag)) {
    table = GenerateTable(row.values, original_word, {
      column_names: ['masculine', 'feminine', 'neuter'],
      row_names: ['nominative', 'accusative', 'dative', 'genitive']
    })
  }
  /* Personal pronouns */
  else if (word.is('personal pronoun')) {
    table = GenerateTable(row.values, original_word, {
      column_names: ['singular', 'plural'],
      row_names: ['nominative', 'accusative', 'dative', 'genitive']
    })
  }
  /* Reflexive pronouns */
  else if (word.is('reflexive pronoun')) {
    table = GenerateTable(row.values, original_word, {
      column_names: [null],
      row_names: ['nominative', 'accusative', 'dative', 'genitive']
    })
  }
  /* Adjectives */
  else if (
    (word.is('adjective') && ['singular', 'plural'].includes(row.tag)) ||
    (word.is('past participle') && ['singular', 'plural'].includes(row.tag))
  ) {
    table = GenerateTable(row.values, original_word, {
      column_names: ['masculine', 'feminine', 'neuter'],
      row_names: ['nominative', 'accusative', 'dative', 'genitive']
    })
  }
  /* Verbs */
  else if (
    word.is('verb') && ['present tense', 'past tense'].includes(row.tag) &&
    !word.is('question form')
  ) {
    /* Dummy subjects */
    if (word.is('impersonal with dummy subject')) {
      table = GenerateTable(row.values, original_word, {
        column_names: ['singular'],
        row_names: ['3rd person']
      })
    }
    /* Regular table */
    else {
      table = GenerateTable(row.values, original_word, {
        column_names: ['singular', 'plural'],
        row_names: ['1st person', '2nd person', '3rd person']
      })
    }
  }
  /* Imperative */
  else if (
    row.tag === 'imperative'
  ) {
    table = GenerateTable(row.values, original_word, {
      column_names: [null],
      row_names: ['singular', 'plural', 'clipped imperative']
    })
  }

  const output = table ? table :
    (row.values ?
      row.values.map(i => TraverseTree(i, word)).join('') :
      `<table className="wikitable"><tbody><tr>${renderCell(new Word([row]))}</tr></tbody></table>`
    )

  if (row.tag) {
    return `<dl className="indent">
      <dt>${row.tag}</dt>
      <dd>${output}</dd>
    </dl>`
  } else {
    return output
  }
}

/* Expects nested array of Columns -> Rows -> Values */
const GenerateTable = (input, original_word, structure) => {
  const { column_names, row_names } = structure
  let word = (new Word()).importTree(input, original_word)
  // console.log(word)
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

const TableHTML = (input, highlight = []) => {
  return `
    <table className="wikitable">
      <tbody>
        ${input.map((row, index) => `
          <tr>
            ${row.map((cell, index2) => {
              if(cell instanceof Word) {
                const shouldHighlight = true //highlight.length > 0 && cell.is(...highlight)
                return renderCell(cell, shouldHighlight)
              } else {
                return `<th colSpan="2">${cell || ''}</th>`
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
    return '<td></td><td>–</td>'
  }
  const value = word.rows.map((row, index) => {
    return `<span>`+
      highlightIrregularities(row.inflectional_form, word) +
      (index + 1 < word.rows.length ? `<span className="light-gray"> / </span>` : '') +
    `</span>`
  }).join('')
  return `
    <td className="right ${shouldHighlight ? 'highlight' : ''}"><span className="gray">${word.getHelperWordsBefore()}</span></td>
    <td className="left ${shouldHighlight ? 'highlight' : ''}">
      <b>${value}</b><span className="gray">${word.getHelperWordsAfter()}</span>
    </td>
  `
}
