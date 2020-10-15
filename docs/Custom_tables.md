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



https://inflections.ylhyra.is/öpum/8842?give_me=plural,genitive

<pre>
<b>Nom</b>  hér eru apar
<b>Acc</b>  um apa    
<b>Dat</b>  frá öpum   
<b>Gen</b>  til <b>apa</b>
</pre>

https://inflections.ylhyra.is/fara/433568?rows=1p,sing;2p,sing;3p,sing;1p,pl;2p,pl;3p,pl

<pre>
<b>1p, singular</b>  ég fer
<b>2p, singular</b>  þú ferð
<b>3p, singular</b>  hún fer
<b>1p, plural</b>    við förum
<b>2p, plural</b>    þið farið
<b>3p, plural</b>    þær fara
</pre>

**Other options**

- `embed` Removes the header from the page
