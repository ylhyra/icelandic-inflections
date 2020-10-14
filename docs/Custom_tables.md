**(Work in progress)**

URL parameters to construct a custom table:

* `give_me`  (**TODO**: Not a good name)
  * Comma seperated list of what should be highlighted. For example: 
    * `plural,nominative`
    * Abbreviations are also supported: `kvk,þgf,með greini` 
  * Can be specific or not.
  * Will highlight the first match
* `columns`  and `rows`
  * Comma seperated list, as above
  * *Or*, description of class (such as `cases`, which will return all four cases)
  * Can be empty