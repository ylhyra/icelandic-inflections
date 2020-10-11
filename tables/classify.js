import { isNumber } from './tree'

/**
 *  Turns BÍN's classifications into English
 *
 * @param {object} input
 *   Input is a raw row from the database with original values from the KRISTINsnid.csv file.
 *   The parameter mapping from the original file is shown in "server/server-with-database/database/ImportToDatabase.js".
 *   The following attributes of the input object are taken into consideration:
 *   - word_categories
 *   - grammatical_tag
 *   - BIN_domain
 *
 * @param {array} i_am_only_interested_in
 *   Can be one of:
 *   - word_categories
 *   - inflectional_form_categories
 *   If selected, an array is returned
 *
 * @returns {object|array}
 *   Returns the inputted object with the following keys removed:
 *   - word_categories
 *   - grammatical_tag
 *   - BIN_domain
 *   And the following keys added:
 *   - word_categories - An array of values that apply to all the forms of the word (a noun, adjective...)
 *   - inflectional_form_categories - An array of values that only apply to certain forms of the word (plurality, case...)
 */
const classify = (input, i_am_only_interested_in) => {
  let { word_categories, grammatical_tag, BIN_domain, ...rest } = input
  if (!word_categories && !grammatical_tag) return input;

  let word_categories_output = (word_categorieses[word_categories]).split(', ')

  if (relevant_BIN_domains[BIN_domain]) {
    word_categories_output.push(relevant_BIN_domains[BIN_domain])
  }

  let inflectional_form_categories = []
  /* Adjectives: Arrange plurality before gender */
  grammatical_tag = grammatical_tag.replace(/(KK|KVK|HK)-(NF|ÞF|ÞGF|EF)(ET|FT)/, '$3-$1-$2')
  /* Nouns: Arrange plurality before case */
  grammatical_tag = grammatical_tag.replace(/(NF|ÞF|ÞGF|EF)(ET|FT)/, '$2-$1')
  const regex = Object.keys(short_tags).sort((a, b) => (b.length - a.length)).join('|')
  grammatical_tag.split((new RegExp(`(${regex})`, 'g'))).filter(Boolean).forEach(tag => {
    if (tag === '-') return;
    if (short_tags[tag]) {
      inflectional_form_categories.push(short_tags[tag])
    } else if (isNumber(tag)) {
      inflectional_form_categories.push(tag)
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.error('Unknown tag in classify.js: ' + tag)
      }
    }
  })

  inflectional_form_categories = inflectional_form_categories.join(', ').split(', ')

  /* Add "without definite article" to nouns */
  if (word_categories_output.includes('noun') && !inflectional_form_categories.includes('with definite article')) {
    inflectional_form_categories.push('without definite article')
  }

  // /* Add "personal use" to verbs */
  // if (word_categories_output.includes('verb') !inflectional_form_categories.find(i => i.startsWith('impersonal')) {
  //   inflectional_form_categories.push('without definite article')
  // }

  /* If it ends in a number it is an alternative version */
  const variantNumber = (grammatical_tag.match(/(\d)$/) ? grammatical_tag.match(/(\d)$/)[0] : 1).toString()
  inflectional_form_categories.push(variantNumber)

  // inflectional_form_categories = inflectional_form_categories.join(', ')

  if (i_am_only_interested_in === 'inflectional_form_categories') {
    return inflectional_form_categories
  }
  if (i_am_only_interested_in === 'word_categories') {
    return word_categories_output
  }
  return {
    word_categories: word_categories_output,
    inflectional_form_categories,
    original_grammatical_tag: grammatical_tag,
    ...rest,
    // ...input,
  }
}
export default classify


/**
 * Object containing "name => array of tags", used for getting arrays later on
 */
let tags = {}

/**
 * Sorted single-level array of tags, used for sorting rows when constructing the tree
 */
let sorted_tags = []

categories.forEach(({ category_names, values }) => {
  sorted_tags = sorted_tags.concat(values)
  category_names.forEach(category_name => {
    tags[category_name] = values
  })
})

export { tags }





export const sort_by_classification = (a, b) => {
  /* Sort by single tag */
  if (a.tag) {
    return sorted_tags.indexOf(a.tag) - sorted_tags.indexOf(b.tag)
  }

  /* Sort by full array of classification */
  for (let i = 0; i < a.inflectional_form_categories.length; i++) {
    if (!b.inflectional_form_categories[i])
      break;
    if (a.inflectional_form_categories[i] === b.inflectional_form_categories[i])
      continue;
    return sorted_tags.indexOf(a.inflectional_form_categories[i]) - sorted_tags.indexOf(b.inflectional_form_categories[i])
  }

  /* Sort by variant number */
  return a.variant_number - b.variant_number
}

/*
  We are only interested in knowing wether a word is a name or not
  See https://bin.arnastofnun.is/ordafordi/hlutiBIN/
*/
const relevant_BIN_domains = {
  ism: 'human name',
  erm: 'human name', // Foreign human name
  föð: 'patronymic',
  móð: 'matronymic',
  gæl: 'human nickname',
  ætt: 'surname',
  hetja: 'name',

  bær: 'place name',
  göt: 'place name',
  lönd: 'place name',
  þor: 'place name',
  örn: 'place name',
  erl: 'place name',
}
export const BIN_domains = Object.keys(relevant_BIN_domains).map(key => relevant_BIN_domains[key])
