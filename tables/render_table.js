import link, { ucfirst } from './link'
import Word from './word'
import { highlightIrregularities } from './functions/highlightIrregularities'

/**
 * RenderTable - Converts description of table structure into a table
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
export const RenderTable = (input, original_word, structure, highlight) => {
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
  return TableHTML(table, highlight)
}


const TableHTML = (rows, highlight = []) => {
  return `
    <table class="table">
      <tbody>
        ${rows.map((row, row_index) => `
          <tr>
            ${row.map((cell, column_index) => {
              if(cell instanceof Word) {
                const shouldHighlight = (highlight && highlight.length > 0) ? cell.is(...highlight) : true
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