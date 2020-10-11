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
    shortcuts: ['meðgr'],
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



  {
    en: 'infinitive',
    is: 'nafnháttur',
    type: '',
    shortcuts: ['nh'],
    has_article_on_ylhyra: false,
  },
  {
    en: 'indicative',
    is: 'framsöguháttur',
    type: '',
    shortcuts: ['fh'],
    has_article_on_ylhyra: false,
  },
  {
    en: 'subjunctive',
    is: 'viðtengingarháttur',
    type: '',
    shortcuts: ['vh'],
    has_article_on_ylhyra: true,
  },

  {
    en: 'active voice',
    is: 'germynd',
    type: '',
    shortcuts: ['gm'],
    has_article_on_ylhyra: false,
  },
  {
    en: 'mediopassive',
    is: 'miðmynd',
    type: '',
    shortcuts: ['mm'],
    has_article_on_ylhyra: false,
  },
  {
    en: 'imperative',
    is: 'boðháttur',
    type: '',
    shortcuts: ['bh'],
    has_article_on_ylhyra: false,
  },
  {
    en: 'clipped imperative',
    is: 'stýfður boðháttur',
    type: '',
    shortcuts: ['st'],
    has_article_on_ylhyra: false,
  },

  {
    en: 'present participle',
    is: 'lýsingarháttur nútíðar',
    type: '',
    shortcuts: ['lhnt'],
    has_article_on_ylhyra: false,
  },
  {
    en: 'supine',
    is: 'sagnbót',
    type: '',
    shortcuts: ['sagnb'],
    has_article_on_ylhyra: false,
  },
  {
    en: 'past participle',
    is: 'lýsingarháttur þátíðar',
    type: '',
    shortcuts: ['lhþt'],
    has_article_on_ylhyra: false,
  },
  {
    en: 'question form',
    is: 'spurnarmynd',
    type: '',
    shortcuts: ['sp'],
    has_article_on_ylhyra: false,
  },





  {
    en: 'optative',
    is: 'óskháttur',
    type: '',
    shortcuts: ['oskh'],
    has_article_on_ylhyra: false,
  },
  {
    en: 'not used in a noun phrase',
    is: 'sérstætt',
    type: '',
    shortcuts: ['serst'],
    has_article_on_ylhyra: false,
  },

  {
    en: 'personal',
    is: 'persónuleg beyging',
    type: '',
    shortcuts: ['persónuleg beyging'],
    has_article_on_ylhyra: false,
  },
  {
    en: 'impersonal',
    is: 'ópersónuleg beyging',
    type: '',
    shortcuts: ['op'],
    has_article_on_ylhyra: false,
  },
  {
    en: 'impersonal with accusative subject',
    is: 'ópersónuleg beyging með frumlag í þolfalli',
    type: '',
    shortcuts: ['op-þf'],
    has_article_on_ylhyra: false,
  },
  {
    en: 'impersonal with dative subject',
    is: 'ópersónuleg beyging með frumlag í þágufalli',
    type: '',
    shortcuts: ['op-þgf'],
    has_article_on_ylhyra: false,
  },
  {
    en: 'impersonal with genitive subject',
    is: 'ópersónuleg beyging með frumlag í eignarfalli',
    type: '',
    shortcuts: ['op-ef'],
    has_article_on_ylhyra: false,
  },
  {
    en: 'impersonal with dummy subject',
    is: 'ópersónuleg beyging með gervifrumlag',
    type: '',
    shortcuts: ['op-það'],
    has_article_on_ylhyra: false,
  },
  {
    en: 'indeclinable',
    is: 'óbeygjanlegt',
    type: '',
    shortcuts: ['obeygjanlegt'],
    has_article_on_ylhyra: false,
  },

  /* Word classes */
  {
    en: 'preposition',
    is: 'forsetning',
    type: '',
    shortcuts: ['fs'],
    has_article_on_ylhyra: false,
  },
  {
    en: 'adverb',
    is: 'atviksorð',
    type: '',
    shortcuts: ['ao'],
    has_article_on_ylhyra: false,
  },
  {
    en: 'article',
    is: 'greinir',
    type: '',
    shortcuts: ['gr'],
    has_article_on_ylhyra: false,
  },
  {
    en: 'adjective',
    is: 'lýsingarorð',
    type: '',
    shortcuts: ['lo'],
    has_article_on_ylhyra: false,
  },
  {
    en: 'infinitive particle',
    is: 'nafnháttarmerki',
    type: '',
    shortcuts: ['nhm'],
    has_article_on_ylhyra: false,
  },
  {
    en: 'verb',
    is: 'sagnorð',
    type: '',
    shortcuts: ['so'],
    has_article_on_ylhyra: false,
  },
  {
    en: 'conjunction',
    is: 'samtenging',
    type: '',
    shortcuts: ['st'],
    has_article_on_ylhyra: false,
  },
  {
    en: 'interjection',
    is: 'upphrópun',
    type: '',
    shortcuts: ['uh'],
    has_article_on_ylhyra: false,
  },
  {
    en: 'numeral',
    is: 'töluorð',
    type: '',
    shortcuts: ['to'],
    has_article_on_ylhyra: false,
  },
  {
    en: 'ordinal number',
    is: 'raðtala',
    type: '',
    shortcuts: ['rt'],
    has_article_on_ylhyra: false,
  },
  {
    en: 'pronoun',
    is: 'fornafn',
    type: '',
    shortcuts: ['fn'],
    has_article_on_ylhyra: false,
  },
  {
    en: 'reflexive pronoun',
    is: 'afturbeygt fornafn',
    type: '',
    shortcuts: ['afn'],
    has_article_on_ylhyra: false,
  },
  {
    en: 'personal pronoun',
    is: 'persónufornafn',
    type: '',
    shortcuts: ['pfn'],
    has_article_on_ylhyra: false,
  },
]




const class_aliases = {
  article: ['articles'],
  plurality: ['number'],
  case: ['cases'],
}

const overrides_during_BIN_classification_word = {
  kk: 'noun, masculine',
  kvk: 'noun, feminine',
  hk: 'noun, neuter',
}
const overrides_during_BIN_classification = {
  fsb: 'positive degree, strong declension',
  fvb: 'positive degree, weak declension',
  evb: 'superlative degree, weak declension',
  esb: 'superlative degree, strong declension',
  gr: 'with definite article',
}
