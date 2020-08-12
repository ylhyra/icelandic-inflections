# Icelandic inflections 🇮🇸

This is an interface for receiving the inflections (conjugations and declensions) of Icelandic words, both as a list and as HTML tables.

The dataset is the *[Database of Modern Icelandic Inflection](https://bin.arnastofnun.is/DMII/LTdata/k-format/)* (DMII), or *Beygingarlýsing íslensks nútímamáls* (BÍN), by the Árni Magnússon Institute for Icelandic Studies. The author and editor of DMII is [Kristín Bjarnadóttir](https://www.arnastofnun.is/is/stofnunin/starfsfolk/kristin-bjarnadottir). <small>([CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/))</small>

## API

**Search**

Exact matches:
* https://ylhyra.is/api/inflection?search=mamma

Fuzzy matches with autocompletion:
* https://ylhyra.is/api/inflection?search=thorsmork&autocomplete=true

**Items**

Get rendered HTML tables:
* https://ylhyra.is/api/inflection?id=433568&type=html

Get a nested JSON object:
* https://ylhyra.is/api/inflection?id=433568&type=nested

Get a flat array of all rows:
* https://ylhyra.is/api/inflection?id=433568&type=flat

## Documentation

* [Development](Development.md)
* [Open tasks](https://github.com/ylhyra/icelandic-inflections/projects/1)

## License

* Data: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) – Copyright: Árni Magnússon Institute for Icelandic Studies
* Software: [MIT](https://opensource.org/licenses/MIT)

## Further reading

* [Slides by Kristín Bjarnadóttir about BÍN](https://notendur.hi.is/~kristinb/NFL2019_kb-kih-6jun.pdf)
