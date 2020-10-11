/**
 *  Descriptions derived from:
 *  - https://bin.arnastofnun.is/gogn/k-snid and
 *  - https://bin.arnastofnun.is/gogn/greiningarstrengir/
 *  By Árni Magnússon Institute for Icelandic Studies
 */
const labels = [
  /* Person */
  {
    en: '1st person',
    is: '1. persóna',
    type: 'person',
    shortcuts: ['1p'],
    has_article_on_ylhyra: true,
  },
  {
    en: '2nd person',
    is: '2. persóna',
    type: 'person',
    shortcuts: ['2p'],
    has_article_on_ylhyra: true,
  },
  {
    en: '3rd person',
    is: '3. persóna',
    type: 'person',
    shortcuts: ['3p'],
    has_article_on_ylhyra: true,
  },

  /* Case */
  {
    en: 'nominative',
    is: 'nefnifall',
    type: 'case',
    shortcuts: ['nf', 'nom'],
    has_article_on_ylhyra: true,
  },
  {
    en: 'accusative',
    is: 'þolfall',
    type: 'case',
    shortcuts: ['þf', 'acc'],
    has_article_on_ylhyra: true,
  },
  {
    en: 'dative',
    is: 'þágufall',
    type: 'case',
    shortcuts: ['þgf', 'dat'],
    has_article_on_ylhyra: true,
  },
  {
    en: 'genitive',
    is: 'eignarfall',
    type: 'case',
    shortcuts: ['ef', 'gen'],
    has_article_on_ylhyra: true,
  },

  /* Plurality */
  {
    en: 'singular',
    is: 'eintala',
    type: 'plurality',
    shortcuts: ['et', 'sing'],
    has_article_on_ylhyra: true,
  },
  {
    en: 'plural',
    is: 'fleirtala',
    type: 'plurality',
    shortcuts: ['ft', 'plur'],
    has_article_on_ylhyra: true,
  },

  /* Gender */
  {
    en: 'masculine',
    is: 'karlkyn',
    type: 'gender',
    shortcuts: ['kk', 'masc'],
    has_article_on_ylhyra: true,
  },
  {
    en: 'feminine',
    is: 'kvenkyn',
    type: 'gender',
    shortcuts: ['kvk', 'fem'],
    has_article_on_ylhyra: true,
  },
  {
    en: 'neuter',
    is: 'hvorugkyn',
    type: 'gender',
    shortcuts: ['hk', 'hvk', 'neut'],
    has_article_on_ylhyra: true,
  },

  /* Article */
  {
    en: 'without definite article',
    is: 'án greinis',
    type: 'article',
    shortcuts: ['ángr'],
    has_article_on_ylhyra: true,
  },
  {
    en: 'with definite article',
    is: 'með greini',
    type: 'article',
    shortcuts: ['gr', 'meðgr'],
    has_article_on_ylhyra: true,
  },

  /* Tense */
  {
    en: 'present tense',
    is: 'nútíð',
    type: 'tense',
    shortcuts: ['nt', 'present'],
    has_article_on_ylhyra: true,
  },
  {
    en: 'past tense',
    is: 'þátíð',
    type: 'tense',
    shortcuts: ['þt', 'past'],
    has_article_on_ylhyra: true,
  },

  /* Degree */
  {
    en: 'positive degree',
    is: 'frumstig',
    type: 'degree',
    shortcuts: ['fst'],
    has_article_on_ylhyra: true,
  },
  {
    en: 'comparative degree',
    is: 'miðstig',
    type: 'degree',
    shortcuts: ['mst'],
    has_article_on_ylhyra: true,
  },
  {
    en: 'superlative degree',
    is: 'efsta stig',
    type: 'degree',
    shortcuts: ['est'],
    has_article_on_ylhyra: true,
  },

  /* Strong or weak */
  {
    en: 'strong declension',
    is: 'sterk beyging',
    type: 'strong or weak',
    shortcuts: ['sb', 'sterk', 'strong'],
    has_article_on_ylhyra: true,
  },
  {
    en: 'weak declension',
    is: 'veik beyging',
    type: 'strong or weak',
    shortcuts: ['vb', 'veik', 'weak'],
    has_article_on_ylhyra: true,
  },
]




const class_aliases = {
  article: ['articles'],
  plurality: ['number'],
  case: ['cases'],
}



const word_categorieses = {
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

  'bh': 'imperative',
  'fh': 'indicative',

  'fsb': 'positive degree, strong declension',
  'fvb': 'positive degree, weak declension',
  'evb': 'superlative degree, weak declension',
  'esb': 'superlative degree, strong declension',

  'gm': 'active voice',
  'lhnt': 'present participle',
  'lhþt': 'past participle',
  'mm': 'mediopassive',
  'nf': 'nominative',
  'nh': 'infinitive',
  'nt': 'present tense',
  'oskh': 'optative',
  'sagnb': 'supine',
  'sb': 'strong declension',
  'serst': 'not used in a noun phrase',
  'sp': 'question form',
  'st': 'clipped imperative', // stýfður boðháttur
  'vb': 'weak declension',
  'vh': 'subjunctive',
  'þt': 'past tense',
  'op-þf': 'impersonal with accusative subject',
  'op-þgf': 'impersonal with dative subject',
  'op-ef': 'impersonal with genitive subject',
  'op-það': 'impersonal with dummy subject',
  'op': 'impersonal',
  'obeygjanlegt': 'indeclinable',
}
