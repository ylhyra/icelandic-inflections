These are the fields that may be returned by the API. They are adapted from [the dataset's original fields](https://bin.arnastofnun.is/DMII/LTdata/k-format/) from the Árni Magnússon Institute for Icelandic Studies.


- `BIN_id` (type: integer)

  - The ID of the word as listed on the BÍN (Beygingarlýsing íslensk nútímamáls)
- `word_class` (type: array)

  - Classification that applies to all forms of the word, such as:

    - ['verb']
    - ['noun', 'masculine']
    - ['adjective']
- `form_classification` (type: array of strings)

  - Classification for this particular word form, such as:

    - ['singular', 'nominative', '1']
    - ['active voice', 'past tense', '1']
  - The last item is always a digit (represented as a string). The main/preferred version of a word form is '1', while alternative versions are '2', '3' and so on.
- `base_word` (type: string)

  - Dictionary headword
- `inflectional_form` (type: string)
- Word form, this value is the one that will be printed. See the 10th field in the [original dataset](https://bin.arnastofnun.is/DMII/LTdata/k-format/).
- `correctness_grade_of_base_word ` (type: integer)
-  See the 5th field in the [original dataset](https://bin.arnastofnun.is/DMII/LTdata/k-format/). As explained there:
  
  - 1 – **Default** – The word can be used in any context and any style or register.
    - 2 – **Used** – The word is not universally accepted, at least not in the most formal of registers.
    - 3 – **A bit bad** – Not accepted.
    - 4 – **Very bad** – Error, unacceptable.
    - 0 – **No grade** – The word is not used in ordinary context in Modern Icelandic.
- `register_of_base_word` (type: string)

  - Register or genre. Used to mark word as being formal, poetic, obsolete etc. See the 6th field in the [original dataset](https://bin.arnastofnun.is/DMII/LTdata/k-format/).
  - (Not currently used in the rendering of tables)
- `grammar_group`

  - See the 7th field in the [original dataset](https://bin.arnastofnun.is/DMII/LTdata/k-format/): "The classification is used for the demarcation of features of grammar or usage, mainly to explain lacunae in the paradigms or restrictions on usage."
  - (Not currently used in the rendering of tables)
- `cross_reference`

  - See the 8th field in the [original dataset](https://bin.arnastofnun.is/DMII/LTdata/k-format/).
  - (Not currently used in the rendering of tables)
- `prescriptive` (type: boolean)
- If true, this variant is [prescriptive](https://en.wikipedia.org/wiki/Linguistic_prescription) and should be shown to a language learner.
  - This field represents the variant as being a part of the [DMII Core](https://bin.arnastofnun.is/DMII/dmii-core/) (*BÍN kjarninn*).
- `correctness_grade_of_inflectional_form` (type: integer)
- See the 12th field in the [original dataset](https://bin.arnastofnun.is/DMII/LTdata/k-format/). As explained there:
  - 
- 

  - inflectional_form
- `register_of_word_form`
- `only_found_in_idioms`
- `alternative_entry`








(needs expansion)

Fields:
https://bin.arnastofnun.is/DMII/LTdata/k-format/

By:
Kristín Bjarnadóttir, The Árni Magnússon Institute for Icelandic Studies

CC BY-SA 4.0

1 - Correct, default value, most words and inflection forms.
2 - Used, not as good
3 - Not good
4 - Very bad
0 - Not applicable, dependent on style.
