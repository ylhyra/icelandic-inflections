import Word from './word'
import link from './link'

export default (rows, give_me) => {
  let word = (new Word(rows))
  // const word = (new Word()).importTree(rows)

  let table;
  if (give_me) {
    give_me = give_me.replace(/_/g, ' ').split(', ')
    // console.log(give_me)
    word = word.get(...give_me)
    table = word.renderSingleTable(give_me)
  } else {
    table = word.renderTables()
  }

  return `
    <div class="inflection">
      <div class="main">
        <h4>${(word.getBaseWord())}</h4>
        <div>${word.getWordDescription()}</div>

        <div>${word.getPrincipalParts()}</div>

        ${table}
      </div>
      <div class="license">
        <a href="https://bin.arnastofnun.is/beyging/${word.getId()}" target="_blank">View on BÍN</a> •
        <a href="https://ylhyra.is/Project:Inflections" class="info" target="_blank">About</a> •
        <a href="https://github.com/ylhyra/icelandic-inflections#readme" target="_blank">API</a>
        <hr/>
        <div>Data from the <em><a href="https://bin.arnastofnun.is/DMII/LTdata/k-format/" rel="nofollow">Database of Modern Icelandic Inflection</a></em> (DMII), or <em>Beygingarlýsing íslensks nútímamáls</em> (BÍN), by the Árni Magnússon Institute for Icelandic Studies. The author and editor of DMII is <a href="https://www.arnastofnun.is/is/stofnunin/starfsfolk/kristin-bjarnadottir" rel="nofollow">Kristín Bjarnadóttir</a>. (<a href="https://creativecommons.org/licenses/by-sa/4.0/" rel="nofollow">CC BY-SA 4.0</a>)</div>
      </div>
    </div>
  `
}
