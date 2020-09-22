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

    - 1 – 
- `register_of_base_word`
- `grammar_group`
- `cross_reference`
- `descriptive`
- `correctness_grade_of_word_form`
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
