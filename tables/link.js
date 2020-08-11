/*
  Creates a link from our labels to relevant Ylhýra pages
*/
export default (link, label) => {
  if (label === undefined) {
    label = link;
  } else if (!label) {
    return '';
  }
  const url = 'https://ylhyra.is/' + encodeURIComponent(ucfirst(link.trim().replace(/( )/g, '_')))
  return `<a className="plainlink" target="_blank" href="${url}">${label}</a>`
}

const ucfirst = (input) => (
  input.charAt(0).toUpperCase() + input.slice(1)
)
