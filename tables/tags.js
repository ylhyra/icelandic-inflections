/**
 *  Descriptions derived from:
 *  - https://bin.arnastofnun.is/gogn/k-snid and
 *  - https://bin.arnastofnun.is/gogn/greiningarstrengir/
 *  By Árni Magnússon Institute for Icelandic Studies
 */
const labels = [
  /* Person */
  {
    name: '1st person',
    is: '1. persóna',
    type: 'person',
    shortcuts: ['1p'],
    has_article_on_ylhyra: true,
  },
  {
    name: '2nd person',
    is: '2. persóna',
    type: 'person',
    shortcuts: ['2p'],
    has_article_on_ylhyra: true,
  },
  {
    name: '3rd person',
    is: '3. persóna',
    type: 'person',
    shortcuts: ['3p'],
    has_article_on_ylhyra: true,
  },

  /* Case */
  {
    name: 'nominative',
    is: 'nefnifall',
    type: 'case',
    shortcuts: ['nf', 'nom'],
    has_article_on_ylhyra: true,
  },
  {
    name: 'accusative',
    is: 'þolfall',
    type: 'case',
    shortcuts: ['þf', 'acc'],
    has_article_on_ylhyra: true,
  },
  {
    name: 'dative',
    is: 'þágufall',
    type: 'case',
    shortcuts: ['þgf', 'dat'],
    has_article_on_ylhyra: true,
  },
  {
    name: 'genitive',
    is: 'eignarfall',
    type: 'case',
    shortcuts: ['ef', 'gen'],
    has_article_on_ylhyra: true,
  },

  /* Plurality */
  {
    name: 'singular',
    is: 'eintala',
    type: 'plurality',
    shortcuts: ['et', 'sing'],
    has_article_on_ylhyra: true,
  },
  {
    name: 'plural',
    is: 'fleirtala',
    type: 'plurality',
    shortcuts: ['ft', 'plur'],
    has_article_on_ylhyra: true,
  },

  /* Gender */
  {
    name: 'masculine',
    is: 'karlkyn',
    type: 'gender',
    shortcuts: ['kk', 'masc'],
    has_article_on_ylhyra: true,
  },
  {
    name: 'feminine',
    is: 'kvenkyn',
    type: 'gender',
    shortcuts: ['kvk', 'fem'],
    has_article_on_ylhyra: true,
  },
  {
    name: 'neuter',
    is: 'hvorugkyn',
    type: 'gender',
    shortcuts: ['hk', 'hvk', 'neut'],
    has_article_on_ylhyra: true,
  },

  /* Article */
  {
    name: 'without definite article',
    is: 'án greinis',
    type: 'article',
    shortcuts: ['ángr', 'no article'],
    has_article_on_ylhyra: true,
  },
  {
    name: 'with definite article',
    is: 'með greini',
    type: 'article',
    shortcuts: ['meðgr', 'with article'],
    has_article_on_ylhyra: true,
  },

  /* Tense */
  {
    name: 'present tense',
    is: 'nútíð',
    type: 'tense',
    shortcuts: ['nt', 'present', 'pres', 'prs'],
    has_article_on_ylhyra: true,
  },
  {
    name: 'past tense',
    is: 'þátíð',
    type: 'tense',
    shortcuts: ['þt', 'past', 'pst'],
    has_article_on_ylhyra: true,
  },

  /* Degree */
  {
    name: 'positive degree',
    is: 'frumstig',
    type: 'degree',
    shortcuts: ['fst', 'positive'],
    has_article_on_ylhyra: true,
  },
  {
    name: 'comparative degree',
    is: 'miðstig',
    type: 'degree',
    shortcuts: ['mst', 'comparative'],
    has_article_on_ylhyra: true,
  },
  {
    name: 'superlative degree',
    is: 'efsta stig',
    type: 'degree',
    shortcuts: ['est', 'superlative'],
    has_article_on_ylhyra: true,
  },

  /* Strong or weak */
  {
    name: 'strong declension',
    is: 'sterk beyging',
    type: 'strong or weak',
    shortcuts: ['sb', 'sterk', 'strong'],
    has_article_on_ylhyra: true,
  },
  {
    name: 'weak declension',
    is: 'veik beyging',
    type: 'strong or weak',
    shortcuts: ['vb', 'veik', 'weak'],
    has_article_on_ylhyra: true,
  },



  {
    name: 'infinitive',
    is: 'nafnháttur',
    type: '',
    shortcuts: ['nh', 'inf'],
    has_article_on_ylhyra: false,
  },
  {
    name: 'indicative',
    is: 'framsöguháttur',
    type: '',
    shortcuts: ['fh', 'ind'],
    has_article_on_ylhyra: false,
  },
  {
    name: 'subjunctive',
    is: 'viðtengingarháttur',
    type: '',
    shortcuts: ['vh', 'subj'],
    has_article_on_ylhyra: true,
  },

  {
    name: 'active voice',
    is: 'germynd',
    type: '',
    shortcuts: ['gm', 'active'],
    has_article_on_ylhyra: false,
  },
  {
    name: 'mediopassive',
    is: 'miðmynd',
    type: '',
    shortcuts: ['mm', 'med'],
    has_article_on_ylhyra: false,
  },
  {
    name: 'imperative',
    is: 'boðháttur',
    type: '',
    shortcuts: ['bh', 'imp'],
    has_article_on_ylhyra: false,
  },
  {
    name: 'clipped imperative',
    is: 'stýfður boðháttur',
    type: '',
    shortcuts: ['stýfður', 'styfdur', 'clipped'],
    has_article_on_ylhyra: false,
  },

  {
    name: 'present participle',
    is: 'lýsingarháttur nútíðar',
    type: '',
    shortcuts: ['lhnt'],
    has_article_on_ylhyra: false,
  },
  {
    name: 'supine',
    is: 'sagnbót',
    type: '',
    shortcuts: ['sagnb', 'sup'],
    has_article_on_ylhyra: false,
  },
  {
    name: 'past participle',
    is: 'lýsingarháttur þátíðar',
    type: '',
    shortcuts: ['lhþt'],
    has_article_on_ylhyra: false,
  },
  {
    name: 'question form',
    is: 'spurnarmynd',
    type: '',
    shortcuts: ['sp'],
    has_article_on_ylhyra: false,
  },





  {
    name: 'optative',
    is: 'óskháttur',
    type: '',
    shortcuts: ['oskh'],
    has_article_on_ylhyra: false,
  },
  {
    name: 'not used in a noun phrase',
    is: 'sérstætt',
    type: '',
    shortcuts: ['serst'],
    has_article_on_ylhyra: false,
  },
  {
    name: 'personal',
    is: 'persónuleg beyging',
    type: '',
    shortcuts: ['persónuleg beyging'],
    has_article_on_ylhyra: false,
  },
  {
    name: 'impersonal',
    is: 'ópersónuleg beyging',
    type: '',
    shortcuts: ['op'],
    has_article_on_ylhyra: false,
  },
  {
    name: 'impersonal with accusative subject',
    is: 'ópersónuleg beyging með frumlag í þolfalli',
    type: '',
    shortcuts: ['op-þf'],
    has_article_on_ylhyra: false,
  },
  {
    name: 'impersonal with dative subject',
    is: 'ópersónuleg beyging með frumlag í þágufalli',
    type: '',
    shortcuts: ['op-þgf'],
    has_article_on_ylhyra: false,
  },
  {
    name: 'impersonal with genitive subject',
    is: 'ópersónuleg beyging með frumlag í eignarfalli',
    type: '',
    shortcuts: ['op-ef'],
    has_article_on_ylhyra: false,
  },
  {
    name: 'impersonal with dummy subject',
    is: 'ópersónuleg beyging með gervifrumlag',
    type: '',
    shortcuts: ['op-það'],
    has_article_on_ylhyra: false,
  },
  {
    name: 'indeclinable',
    is: 'óbeygjanlegt',
    type: '',
    shortcuts: ['obeygjanlegt'],
    has_article_on_ylhyra: false,
  },

  /* Word classes */
  {
    name: 'preposition',
    is: 'forsetning',
    type: '',
    shortcuts: ['fs', 'prep'],
    has_article_on_ylhyra: false,
  },
  {
    name: 'adverb',
    is: 'atviksorð',
    type: '',
    shortcuts: ['ao', 'adv'],
    has_article_on_ylhyra: false,
  },
  {
    name: 'article',
    is: 'greinir',
    type: '',
    shortcuts: ['gr'],
    has_article_on_ylhyra: false,
  },
  {
    name: 'adjective',
    is: 'lýsingarorð',
    type: '',
    shortcuts: ['lo', 'adj', 'a'],
    has_article_on_ylhyra: false,
  },
  {
    name: 'infinitive particle',
    is: 'nafnháttarmerki',
    type: '',
    shortcuts: ['nhm'],
    has_article_on_ylhyra: false,
  },
  {
    name: 'verb',
    is: 'sagnorð',
    type: '',
    shortcuts: ['so', 'v'],
    has_article_on_ylhyra: false,
  },
  {
    name: 'conjunction',
    is: 'samtenging',
    type: '',
    shortcuts: ['st', 'conj'],
    has_article_on_ylhyra: false,
  },
  {
    name: 'interjection',
    is: 'upphrópun',
    type: '',
    shortcuts: ['uh', 'int'],
    has_article_on_ylhyra: false,
  },
  {
    name: 'numeral',
    is: 'töluorð',
    type: '',
    shortcuts: ['to'],
    has_article_on_ylhyra: false,
  },
  {
    name: 'ordinal number',
    is: 'raðtala',
    type: '',
    shortcuts: ['rt', 'ordinal'],
    has_article_on_ylhyra: false,
  },
  {
    name: 'pronoun',
    is: 'fornafn',
    type: '',
    shortcuts: ['fn'],
    has_article_on_ylhyra: false,
  },
  {
    name: 'reflexive pronoun',
    is: 'afturbeygt fornafn',
    type: '',
    shortcuts: ['afn'],
    has_article_on_ylhyra: false,
  },
  {
    name: 'personal pronoun',
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

/*
  Overrides the tags above only during the
  BIN initialization step and not during later passes
*/
const BIN_overrides = {
  word: {
    kk: 'noun, masculine',
    kvk: 'noun, feminine',
    hk: 'noun, neuter',
  },
  form: {
    fsb: 'positive degree, strong declension',
    fvb: 'positive degree, weak declension',
    evb: 'superlative degree, weak declension',
    esb: 'superlative degree, strong declension',
    gr: 'with definite article',
    st: 'clipped imperative',
  }
}




/**
 * Object containing "name => array of tags", used for getting arrays later on, such as tags['gender']
 */
let tags = {}

/**
 *
 */
let shortcuts = {}

/**
 * Sorted single-level array of tags, used for sorting rows when constructing the tree
 */
let sorted_tags = []

/**
 * Reverses `label` to turn it into a searchable object
 */
let reverse_lookup = {}


labels.forEach(label => {
  /* Tags */
  if (!tags[label.type]) {
    tags[label.type] = []
  }
  tags[label.type].push(label.name)

  /* Shortcuts */
  label.shortcuts.forEach(shortcut => {
    if (shortcuts[shortcut]) {
      throw `SHORTCUT ALREADY EXISTS ${shortcut}`
    }
    shortcuts[shortcut] = label.name
  })

  /* Sorted tags */
  sorted_tags.push(label.name)

  /* Reverse lookup */
  reverse_lookup[label.name] = label

})
