import { splitOnVowelRegions, removeVowellikeClusters, splitOnAll } from './vowels'

/**
 * Certain words are too difficult to stem without
 * knowing what word endings are common.
 * Turns "farinn" into "far"
 * Notes:
 *   - Only runs for adjectives, since this trick does not work for "asni"
 * TODO This is a total hack, needs a complete revamp
 * @param {string} input
 * @param {word} Word
 * @return {?string}
 */
export const stripBeforeComparingToStem = (input, word) => {
  if (!input) return;
  let stripped

  if (word.is('adjective') || word.is('past participle') || word.is('with definite article')) {
    stripped = input.replace(adjectiveEndings, '')
  } else if (word.is('verb')) {
    stripped = input.replace(verbEndings, '')
  } else if (word.is('noun')) {
    stripped = input.replace(nounEndings, '')
  }
  // if(input==='sæir'){
  //   console.log({input,stripped})
  // }
  /* Check to see if there is at least one vowel left in stipped output */
  if (stripped && splitOnVowelRegions(stripped).length > 1) {
    return stripped
  } else {
    return input
  }
}



const splittableRegexEndingsFromArray = string => {
  return new RegExp(`(${string.sort((a, b) => (b.length - a.length)).join('|')})$`)
}



const beygingarendingar = {
  // Karlkyn
  m: [
    // EINTALA
    // "bróðir"
    ['irinn', 'urinn', 'urnum', 'urins'],
    ['ir', 'ur', 'ur', 'ur'],
    // "plástur"
    ['urinn', 'urinn', 'rinum', 'sins'],
    ['ur', 'ur', 'ri', 's'],
    // "bátur"
    ['urinn', 'inn', 'num', 'sins'],
    ['ur', '', 'i', 's'],
    // "gangur"
    ['urinn', 'inn', 'inum', 'sins'],
    // "hringur"
    ['ur', '', '', 's'],
    // "vinur"
    ['urinn', 'inn', 'inum', 'arins'],
    ['ur', '', 'i', 'ar'],
    // "lækur"
    ['urinn', 'inn', 'num', 'jarins'],
    ['ur', '', '', 'jar'],
    // "matur"
    ['urinn', 'inn', 'num', 'arins'],
    ['ur', '', '', 'ar'],
    // "skjár"
    ['rinn', 'inn', 'num', 'sins'],
    ['r', '', '', 's'],
    // "pabbi"
    ['inn', 'ann', 'anum', 'ans'],
    ['i', 'a', 'a', 'a'],
    // "ofn"
    ['inn', 'inn', 'inum', 'sins'],
    ['', '', 'i', 's'],
    // "bíll"
    ['inn', 'inn', 'num', 'sins'],
    ['', '', '', 's'],
    // "morgunn"
    ['unninn', 'uninn', 'ninum', 'unsins'],
    ['unn', 'un', 'ni', 'uns'],
    // "bær"
    ['', '', '', 'jar'],
    ['', '', '', 'jarins'],
    // FLEIRTALA
    // bátar" / "strákar"
    ['arnir', 'ana', 'unum', 'anna'],
    ['ar', 'a', 'um', 'a'],
    // "feður"
    ['urnir', 'urna', 'runum', 'ranna'],
    ['ur', 'ur', 'rum', 'ra'],
    // "hringur"
    ['irnir', 'ina', 'junum', 'janna'],
    ['ir', 'i', 'jum', 'ja'],
    // "vinir"
    ['irnir', 'ina', 'unum', 'anna'],
    ['ir', 'i', 'um', 'a'],
    // "morgunn"
    ['narnir', 'nana', 'nunum', 'nanna'],
    ['nar', 'na', 'num', 'na'],
    // "bændur"
    ['urnir', 'urna', 'unum', 'anna'],
    ['ur', 'ur', 'um', 'a'],
    // "menn"
    ['', '', 'um', 'a'],
    // "bæir"
    ['irnir', 'ina', 'junum', 'janna'],
    ['ir', 'i', 'jum', 'ja'],
  ],
  // Kvenkyn
  f: [
    // EINTALA
    // systir
    ['irin', 'urina', 'urinni', 'urinnar'],
    ['ir', 'ur', 'ur', 'ur'],
    // "búð"
    ['in', 'ina', 'inni', 'arinnar'],
    ['', '', '', 'ar'],
    //  "kona"
    ['an', 'una', 'unni', 'unnar'],
    ['a', 'u', 'u', 'u'],
    // "elding"
    ['in', 'una', 'unni', 'arinnar'],
    ['', 'u', 'u', 'ar'],
    // "mjólk"
    ['in', 'ina', 'inni', 'urinnar'],
    ['', '', '', 'ur'],
    // "keppni"
    ['in', 'ina', 'inni', 'innar'],
    ['i', 'i', 'i', 'i'],
    // FLEIRTALA
    // "stúlkur"
    ['urnar', 'urnar', 'unum', 'nanna'],
    ['ur', 'ur', 'um', 'na'],
    // "keppnir"
    ['nirnar', 'nirnar', 'nunum', 'nanna'],
    ['nir', 'nir', 'num', 'na'],
    // "búðir"
    ['irnar', 'irnar', 'unum', 'anna'],
    ['ir', 'ir', 'um', 'a'],
    // "persónur"
    ['urnar', 'urnar', 'unum', 'anna'],
    ['ur', 'ur', 'um', 'a'],
    // "vélar"
    ['arnar', 'arnar', 'unum', 'anna'],
    ['ar', 'ar', 'um', 'a'],
    // "bækur"
    ['urnar', 'urnar', 'unum', 'anna'],
    ['ur', 'ur', 'um', 'a'],
    // "dyr"
    ['nar', 'nar', 'unum', 'anna'],
    ['', '', 'um', 'a'],
  ],
  // Hvorugkyn
  n: [
    // EINTALA
    // "ríki"
    ['i', 'i', 'i', 's'],
    // "barn"
    ['ið', 'ið', 'inu', 'sins'],
    ['', '', 'i', 's'],
    // "hjarta"
    ['að', 'að', 'anu', 'ans'],
    ['a', 'a', 'a', 'a'],
    // FLEIRTALA
    // "augu"
    ['un', 'un', 'unum', 'nanna'],
    ['u', 'u', 'um', 'na'],
    // "epli"
    ['in', 'in', 'unum', 'anna'],
    ['i', 'i', 'um', 'a'],
    // "börn"
    ['in', 'in', 'unm', 'anna'],
    ['', '', 'um', 'a'],
    // "hjörtu"
    ['un', 'un', 'unum', 'anna'],
    ['u', 'u', 'um', 'a'],
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
