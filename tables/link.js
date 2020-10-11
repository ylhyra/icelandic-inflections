/*
  Creates a link from our labels to relevant Ylhýra pages
*/
export default (link, label) => {
  if (!link || typeof link !== 'string') return '';
  if (label === undefined) {
    label = link;
  } else if (!label) {
    return '';
  }

  /* Temporary */
  return label;




  const url = 'https://ylhyra.is/' + encodeURIComponent(ucfirst(link.trim().replace(/( )/g, '_')))
  return `<a class="plainlink" target="_blank" href="${url}">${label}</a>`
}

export const removeLinks = (string) => {
  return string && string
    .replace(/<\/a>/g, '')
    .replace(/<a .+?>/g, '')
}

export const ucfirst = (input) => (
  input && (input.charAt(0).toUpperCase() + input.slice(1))
)
