import { splitOnVowels, removeVowellikeClusters, splitOnAll } from './../functions/vowels'
const splittableRegexEndingsFromArray = string => {
  return new RegExp(`(${string.sort((a, b) => (b.length - a.length)).join('|')})$`)
}


/**
 * Input given is the part that comes *after* the stem region of the word, such as "inum" for the word "hamrinum".
 * Removes inflectional patterns and returns the rest.
 * @param {string} input
 * @param {word} Word
 * @return {?string}
 */
export const findInflectionalPattern = (input, word) => {
  if (!input) return;
  let stripped = input;

  if (word.is('adjective') || word.is('past participle') || word.is('with definite article')) {
    stripped = input.replace(adjectiveEndings, '')
  } else if (word.is('verb')) {
    stripped = input.replace(verbEndings, '')
  } else if (word.is('noun')) {
    stripped = input.replace(nounEndings, '')
  }

  return stripped
}






const beygingarendingar = {
  // Karlkyn
  m: [
    // EINTALA
    // "bróðir"
    ['(ir)', '(ur)', '(ur)', '(ur)'],
    ['(ir)inn', '(ur)inn', '(ur)num', '(ur)ins'],
    // "plástur"
    ['(ur)', '(ur)', '(r)i', '(ur)s'],
    ['(ur)inn', '(ur)inn', '(ur)inum', '(ur)sins'],
    // "bátur"
    ['ur', '', 'i', 's'],
    ['urinn', 'inn', 'num', 'sins'],
    // "gangur"
    ['urinn', 'inn', 'inum', 'sins'],
    // "hringur"
    ['ur', '', '', 's'],
    // "vinur"
    ['ur', '', 'i', 'ar'],
    ['urinn', 'inn', 'inum', 'arins'],
    // "lækur"
    ['ur', '', '', 'jar'],
    ['urinn', 'inn', 'num', 'jarins'],
    // "matur"
    ['ur', '', '', 'ar'],
    ['urinn', 'inn', 'num', 'arins'],
    // "skjár"
    ['r', '', '', 's'],
    ['rinn', 'inn', 'num', 'sins'],
    // "pabbi"
    ['i', 'a', 'a', 'a'],
    ['inn', 'ann', 'anum', 'ans'],
    // "ofn"
    ['', '', 'i', 's'],
    ['inn', 'inn', 'inum', 'sins'],
    // "bíll"
    ['', '', '', 's'],
    ['inn', 'inn', 'num', 'sins'],
    // "morgunn"
    ['unn', 'un', 'ni', 'uns'],
    ['unninn', 'uninn', 'ninum', 'unsins'],
    // "bær"
    ['r', '', '', 'jar'],
    ['rinn', 'inn', 'num', 'jarins'],
    // FLEIRTALA
    // bátar" / "strákar"
    ['ar', 'a', 'um', 'a'],
    ['arnir', 'ana', 'unum', 'anna'],
    // "feður"
    ['ur', 'ur', 'rum', 'ra'],
    ['urnir', 'urna', 'runum', 'ranna'],
    // "hringur"
    ['ir', 'i', 'jum', 'ja'],
    ['irnir', 'ina', 'junum', 'janna'],
    // "vinir"
    ['ir', 'i', 'um', 'a'],
    ['irnir', 'ina', 'unum', 'anna'],
    // "morgunn"
    ['nar', 'na', 'num', 'na'],
    ['narnir', 'nana', 'nunum', 'nanna'],
    // "bændur"
    ['ur', 'ur', 'um', 'a'],
    ['urnir', 'urna', 'unum', 'anna'],
    // "menn"
    ['', '', 'um', 'a'],
    // "bæir"
    ['ir', 'i', 'jum', 'ja'],
    ['irnir', 'ina', 'junum', 'janna'],
  ],
  // Kvenkyn
  f: [
    // EINTALA
    // systir
    ['ir', 'ur', 'ur', 'ur'],
    ['irin', 'urina', 'urinni', 'urinnar'],
    // "búð"
    ['', '', '', 'ar'],
    ['in', 'ina', 'inni', 'arinnar'],
    //  "kona"
    ['a', 'u', 'u', 'u'],
    ['an', 'una', 'unni', 'unnar'],
    // "elding"
    ['', 'u', 'u', 'ar'],
    ['in', 'una', 'unni', 'arinnar'],
    // "mjólk"
    ['', '', '', 'ur'],
    ['in', 'ina', 'inni', 'urinnar'],
    // "keppni"
    ['i', 'i', 'i', 'i'],
    ['in', 'ina', 'inni', 'innar'],
    // FLEIRTALA
    // "stúlkur"
    ['ur', 'ur', 'um', 'na'],
    ['urnar', 'urnar', 'unum', 'nanna'],
    // "keppnir"
    ['nir', 'nir', 'num', 'na'],
    ['nirnar', 'nirnar', 'nunum', 'nanna'],
    // "búðir"
    ['ir', 'ir', 'um', 'a'],
    ['irnar', 'irnar', 'unum', 'anna'],
    // "persónur"
    ['ur', 'ur', 'um', 'a'],
    ['urnar', 'urnar', 'unum', 'anna'],
    // "vélar"
    ['ar', 'ar', 'um', 'a'],
    ['arnar', 'arnar', 'unum', 'anna'],
    // "bækur"
    ['ur', 'ur', 'um', 'a'],
    ['urnar', 'urnar', 'unum', 'anna'],
    // "dyr"
    ['', '', 'um', 'a'],
    ['nar', 'nar', 'unum', 'anna'],
  ],
  // Hvorugkyn
  n: [
    // EINTALA
    // "ríki"
    ['i', 'i', 'i', 's'],
    // "barn"
    ['', '', 'i', 's'],
    ['ið', 'ið', 'inu', 'sins'],
    // "hjarta"
    ['a', 'a', 'a', 'a'],
    ['að', 'að', 'anu', 'ans'],
    // FLEIRTALA
    // "augu"
    ['u', 'u', 'um', 'na'],
    ['un', 'un', 'unum', 'nanna'],
    // "epli"
    ['i', 'i', 'um', 'a'],
    ['in', 'in', 'unum', 'anna'],
    // "börn"
    ['', '', 'um', 'a'],
    ['in', 'in', 'unm', 'anna'],
    // "hjörtu"
    ['u', 'u', 'um', 'a'],
    ['un', 'un', 'unum', 'anna'],
  ],
}

const nounEndings = splittableRegexEndingsFromArray([
  'ri',
  'rið',
  'rinu',
  'rinum',
  'rum',
])

const adjectiveEndings = splittableRegexEndingsFromArray([
  'an',
  'anna',
  'ið',
  'in',
  'inn',
  'inna',
  'innar',
  'inni',
  'ins',
  'inu',
  'inum',
  'na',
  'nar',
  'ni',
  'nir',
  'nu',
  'num',
  'una',
  'unnar',
  'unni',
  'unum',
])

const verbEndings = splittableRegexEndingsFromArray([
  'ðu',
  'ið',
  'iði',
  'ir',
  'ist',
  'ju',
  'juð',
  'jum',
  'jumst',
  'just',
  'st',
  'uði',
  'um',
  'umst',
  'uð',
  'u',
  'i',
  'irðu',
  'juði',
  'usti',
  'justi',
  'istu',
  'andi',
  // Mediopassive
  'isti',
  'usti',
])











export const highlyIrregularNouns = [
  /* Masculine */
  'bróðir',
  'faðir',
  'fingur',
  'fótur',
  'maður',
  'vetur',
  /* Feminine */
  'ær',
  'dóttir',
  'hönd',
  'kýr',
  'lús',
  'mær',
  'móðir',
  'mús',
  'sýr',
  'systir',
]
