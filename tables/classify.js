import { isNumber } from './tree'

/**
 *  Turns BÍN's classifications into English
 *
 *  Descriptions from:
 *  - https://bin.arnastofnun.is/gogn/k-snid and
 *  - https://bin.arnastofnun.is/gogn/greiningarstrengir/
 *  © Árni Magnússon Institute for Icelandic Studies, CC BY-SA 4.0
 *
 * @param {object} input
 *   Input is a raw row from the database with original values from the KRISTINsnid.csv file.
 *   The parameter mapping from the original file is shown in "server/server-with-database/database/ImportToDatabase.js".
 *   The following attributes of the input object are taken into consideration:
 *   - word_class
 *   - grammatical_tag
 *   - BIN_domain
 *
 * @param {array} i_am_only_interested_in
 *   Can be one of:
 *   - word_class
 *   - form_classification
 *   If selected, an array is returned
 *
 * @returns {object|array}
 *   Returns the inputted object with the following keys removed:
 *   - word_class
 *   - grammatical_tag
 *   - BIN_domain
 *   And the following keys added:
 *   - word_class - An array of values that apply to all the forms of the word (a noun, adjective...)
 *   - form_classification - An array of values that only apply to certain forms of the word (plurality, case...)
 */
const classify = (input, i_am_only_interested_in) => {
  let { word_class, grammatical_tag, BIN_domain, ...rest } = input
  if (!word_class && !grammatical_tag) return input;

  let word_class_output = (word_classes[word_class]).split(', ')

  if (relevant_BIN_domains[BIN_domain]) {
    word_class_output.push(relevant_BIN_domains[BIN_domain])
  }

  let form_classification = []
  /* Adjectives: Arrange plurality before gender */
  grammatical_tag = grammatical_tag.replace(/(KK|KVK|HK)-(NF|ÞF|ÞGF|EF)(ET|FT)/, '$3-$1-$2')
  /* Nouns: Arrange plurality before case */
  grammatical_tag = grammatical_tag.replace(/(NF|ÞF|ÞGF|EF)(ET|FT)/, '$2-$1')
  const regex = Object.keys(short_tags).sort((a, b) => (b.length - a.length)).join('|')
  grammatical_tag.split((new RegExp(`(${regex})`, 'g'))).filter(Boolean).forEach(tag => {
    if (tag === '-') return;
    if (short_tags[tag]) {
      form_classification.push(short_tags[tag])
    } else if (isNumber(tag)) {
      form_classification.push(tag)
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.error('Unknown tag in classify.js: ' + tag)
      }
    }
  })

  form_classification = form_classification.join(', ').split(', ')

  /* Add "without definite article" to nouns */
  if (word_class_output.includes('noun') && !form_classification.includes('with definite article')) {
    form_classification.push('without definite article')
  }

  // /* Add "personal use" to verbs */
  // if (word_class_output.includes('verb') !form_classification.find(i => i.startsWith('impersonal')) {
  //   form_classification.push('without definite article')
  // }

  /* If it ends in a number it is an alternative version */
  const variantNumber = (grammatical_tag.match(/(\d)$/) ? grammatical_tag.match(/(\d)$/)[0] : 1).toString()
  form_classification.push(variantNumber)

  // form_classification = form_classification.join(', ')

  if (i_am_only_interested_in === 'form_classification') {
    return form_classification
  }
  if (i_am_only_interested_in === 'word_class') {
    return word_class_output
  }
  return {
    word_class: word_class_output,
    form_classification,
    original_grammatical_tag: grammatical_tag,
    ...rest,
    // ...input,
  }
}
export default classify

const word_classes = {
  kk: 'noun, masculine',
  kvk: 'noun, feminine',
  hk: 'noun, neuter',
  fs: 'preposition',
  ao: 'adverb',
  gr: 'article',
  lo: 'adjective',
  nhm: 'infinitive particle',
  so: 'verb',
  st: 'conjunction',
  uh: 'interjection',
  to: 'numeral',
  rt: 'ordinal number',

  /* Pronouns */
  fn: 'pronoun',
  afn: 'reflexive pronoun',
  pfn: 'personal pronoun',
}

const short_tags = {
  '1P': '1st person',
  '2P': '2nd person',
  '3P': '3rd person',

  'BH': 'imperative',
  'EF': 'genitive',
  'ET': 'singular',
  'FH': 'indicative',

  'FST': 'positive degree', // frumstig
  'FSB': 'positive degree, strong declension',
  'FVB': 'positive degree, weak declension',
  'MST': 'comparative degree', // miðstig
  'EST': 'superlative degree', // efsta stig
  'EVB': 'superlative degree, weak declension',
  'ESB': 'superlative degree, strong declension',

  'FT': 'plural',
  'GM': 'active voice',
  'gr': 'with definite article',
  'KK': 'masculine',
  'KVK': 'feminine',
  'HK': 'neuter',
  'LHNT': 'present participle',
  'LHÞT': 'past participle',
  'MM': 'mediopassive',
  'NF': 'nominative',
  'NH': 'infinitive',
  'NT': 'present tense',
  'OSKH': 'optative',
  'SAGNB': 'supine',
  'SB': 'strong declension',
  'SERST': 'not used in a noun phrase',
  'SP': 'question form',
  'ST': 'clipped imperative', // Stýfður boðháttur
  'VB': 'weak declension',
  'VH': 'subjunctive',
  'ÞF': 'accusative',
  'ÞGF': 'dative',
  'ÞT': 'past tense',
  'OP-ÞF': 'impersonal with accusative subject',
  'OP-ÞGF': 'impersonal with dative subject',
  'OP-EF': 'impersonal with genitive subject',
  'OP-það': 'impersonal with dummy subject',
  'OP': 'impersonal',
  'OBEYGJANLEGT': 'indeclinable',
}


const categories = [{
  category_names: ['person'],
  values: [
    '1st person',
    '2nd person',
    '3rd person',
  ]
}, {
  category_names: ['gender'],
  values: [
    'masculine',
    'feminine',
    'neuter',
  ]
}, {
  category_names: ['case', 'cases'],
  values: [
    'nominative',
    'accusative',
    'dative',
    'genitive',
  ]
}, {
  category_names: ['tense'],
  values: [
    'present tense',
    'past tense',
  ]
}, {
  category_names: ['plurality', 'number'],
  values: [
    'singular',
    'plural',
  ]
}, {
  category_names: ['article', 'articles'],
  values: [
    'without definite article',
    'with definite article',
  ]
}, {
  category_names: ['degree'],
  values: [
    'positive degree', // frumstig
    'comparative degree', // miðstig
    'superlative degree', // efsta stig
  ]
}, {
  category_names: ['strong or weak'],
  values: [
    'strong declension',
    'weak declension',
  ]
}, ]

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


/*
  Other tags that we haven't yet added to `categories` above
*/
sorted_tags = sorted_tags.concat([
  /* Verbs */
  'infinitive',
  'indicative', // Framsöguháttur
  'subjunctive', // Viðtengingarháttur

  // 'voice'
  'active voice', // Germynd
  'mediopassive', // Miðmynd
  'imperative', // Boðháttur
  'clipped imperative', // Stýfður boðháttur
  'present participle',
  'supine',
  'past participle',
  'question form',

  'optative', // "Von"?
  'not used in a noun phrase',
  'indefinite', // Is this used?
  'personal',
  'impersonal',
  'impersonal with accusative subject',
  'impersonal with dative subject',
  'impersonal with genitive subject',
  'impersonal with dummy subject',
  'indeclinable',
])




export const sort_by_classification = (a, b) => {
  /* Sort by single tag */
  if (a.tag) {
    return sorted_tags.indexOf(a.tag) - sorted_tags.indexOf(b.tag)
  }

  /* Sort by full array of classification */
  for (let i = 0; i < a.form_classification.length; i++) {
    if (!b.form_classification[i])
      break;
    if (a.form_classification[i] === b.form_classification[i])
      continue;
    return sorted_tags.indexOf(a.form_classification[i]) - sorted_tags.indexOf(b.form_classification[i])
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
