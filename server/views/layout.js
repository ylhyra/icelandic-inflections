export default ({
  string,
  results,
}) => `
<!DOCTYPE html>
<html>
<title>Icelandic inflections</title>
<meta charset="utf-8"/>
<!-- <base href="/"/> -->
<link href="/styles/build.css" rel="stylesheet" type="text/css"/>
<!-- <meta name="description" content=""/> -->
<meta name="google" content="notranslate" />
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<!-- <link rel="shortcut icon" href="/~/favicon.png"> -->

<!--
<script type="text/javascript">
if(/[?&]q=/.test(location.search)) {
  var match = location.search.match(/[?&]q=([A-zÀ-ÿ%0-9+]+)/);
  if (match && window.history.replaceState) {
     window.history.replaceState(null, null, '/'+match[1]);
  }
}
</script>
-->
<body>
<div id="content">
  <h1><a href="/">Icelandic inflections</a></h1>
  <form method="get" action="/">
    <input name="q" id="s" placeholder="Search" type="search" value="${string || ''}" spellcheck="false" autocomplete="off"/>
  </form>
  <main>
    ${results || ''}
  </main>
  <footer>
  <div class="license">
  Data from the <em><a href="https://bin.arnastofnun.is/DMII/LTdata/k-format/" rel="nofollow">Database of Modern Icelandic Inflection</a></em> (DMII),
  or <em>Beygingarlýsing íslensks nútímamáls</em> (BÍN), by the Árni Magnússon Institute for Icelandic Studies. The author and editor of the DMII is <a href="https://www.arnastofnun.is/is/stofnunin/starfsfolk/kristin-bjarnadottir" rel="nofollow">Kristín Bjarnadóttir</a>. <small><a href="https://creativecommons.org/licenses/by-sa/4.0/" rel="nofollow">CC BY-SA&nbsp;4.0</a></small></div>
  </footer>
</div>
<!--
<script type="application/ld+json">
{
  "@context": "http://schema.org",
  "@type": "WebSite",
  "url": "https://rimordabok.is/",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://rimordabok.is/?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
</script>
-->
</body>
</html>
`
