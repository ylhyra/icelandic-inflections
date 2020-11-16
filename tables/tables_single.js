import RenderTable from 'tables/render_table'
import { without, flatten } from 'lodash'
import { types } from 'tables/classification/classification'
import link, { ucfirst_link } from 'tables/link'

/**
 * Finds a single relevant table
 *
 * @memberof Word
 * @return {string} HTML as string
 */
export default function getSingleTable({
  returnAsString,
  give_me,
  column_names,
  row_names,
}) {
  let word = this
  let description = ''
  let table = ''

  if (!column_names && !row_names) {
    /* Nouns */
    if (word.is('noun')) {
      row_names = types['cases']
    } else if (word.is('adjective')) {
      if (word.getFirst().is('nominative')) {
        row_names = types['genders']
      } else {
        row_names = types['cases']
      }
    }
  }

  column_names = column_names || [null]
  row_names = row_names || [null]

  if (give_me && give_me.length > 0) {
    word = word.get(...give_me)
  } else {
    word = word.getMeetingAny(...row_names, ...column_names)
  }

  const sibling_classification = without(word.getFirstClassification(), ...flatten(row_names), ...flatten(column_names))
  const siblings = word.getOriginal().get(sibling_classification)

  /* As string */
  if (returnAsString) {
    return row_names.map(c => siblings.get(c)).map(i => i.render({ highlight: give_me })).filter(Boolean).join(', ')
  }
  /* As table */
  else {
    table = RenderTable(siblings, word.getOriginal(), { column_names, row_names }, give_me)
    description = ucfirst_link(sibling_classification.map(i => link(i)).join(', '))
    let output
    if (description) {
      output = `<dl class="indent">
        <dt>${description}</dt>
        <dd>${table}</dd>
      </dl>`
    } else {
      output = table
    }
    return output + `<a href="https://inflections.ylhyra.is/${encodeURIComponent(word.getBaseWord())}/${word.getId()}"><b>Show all tables</b></a>`
  }
}
