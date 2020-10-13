import Word from './word'
import link from './link'
import { normalizeTag, types } from './classification/classification'

export default (rows, options) => {
  let give_me = options.give_me
  let column_names = options.columns || options.column_names
  let row_names = options.rows || options.row_names

  // console.log(rows.slice(0,1))
  // rows = rows.filter(row => row.correctness_grade_of_inflectional_form == '1')
  let word = (new Word(rows))
  // const word = (new Word()).importTree(rows)

  let table;
  if (give_me || column_names || row_names) {
    give_me = clean__temporary(give_me)
    column_names = cleanRowOrColum__temporary(column_names)
    row_names = cleanRowOrColum__temporary(row_names)
    console.log(row_names)
    word = word.get(...give_me)
    if (word.rows.length > 0) {
      table = word.getSingleTable({ give_me, column_names, row_names })
    } else {
      table = `<b>Error:</b> No rows found with the requested values`
    }
  } else {
    table = word.getTables()
  }

  return `
    <div class="inflection">
      <div class="main">
        <h4>${(word.getBaseWord())}</h4>
        <div>${word.getWordDescription()}</div>
        <div>${word.getWordNotes()}</div>
        <div>${word.getPrincipalParts()}</div>

        ${table}
      </div>
      <div class="license">
        <a href="https://bin.arnastofnun.is/beyging/${word.getId()}" target="_blank">View on BÍN</a> •
        <a href="https://ylhyra.is/Project:Inflections" class="info" target="_blank">About</a> •
        <a href="https://github.com/ylhyra/icelandic-inflections#readme" target="_blank">API</a>
        <hr/>
        <div>Data from the <em><a href="https://bin.arnastofnun.is/DMII/LTdata/k-format/" rel="nofollow">Database of Modern Icelandic Inflection</a></em> (DMII), or <em>Beygingarlýsing íslensks nútímamáls</em> (BÍN), by the Árni Magnússon Institute for Icelandic Studies. The author and editor of DMII is <a href="https://www.arnastofnun.is/is/stofnunin/starfsfolk/kristin-bjarnadottir" rel="nofollow">Kristín Bjarnadóttir</a>. (<a href="https://creativecommons.org/licenses/by-sa/4.0/" rel="nofollow">CC BY-SA 4.0</a>)</div>
      </div>
    </div>
  `
}


const cleanRowOrColum__temporary = (string) => {
  if (!string) return;
  /* If someone enters "cases" the rest is filled out */
  if (string in types) return types[string];
  // /* Should be made to work in the future */
  // return string.split(';').map(clean__temporary)
  return clean__temporary(string)
}

const clean__temporary = (string) => {
  if (!string) return [];
  return string.replace(/_/g, ' ').split(',').map(normalizeTag).filter(Boolean)
}
