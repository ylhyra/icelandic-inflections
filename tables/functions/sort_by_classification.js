export const sort_by_classification = (a, b) => {
  /* Sort by single tag */
  if (a.tag) {
    return sorted_tags.indexOf(a.tag) - sorted_tags.indexOf(b.tag)
  }

  /* Sort by full array of classification */
  for (let i = 0; i < a.inflectional_form_categories.length; i++) {
    if (!b.inflectional_form_categories[i])
      break;
    if (a.inflectional_form_categories[i] === b.inflectional_form_categories[i])
      continue;
    return sorted_tags.indexOf(a.inflectional_form_categories[i]) - sorted_tags.indexOf(b.inflectional_form_categories[i])
  }

  /* Sort by variant number */
  return a.variant_number - b.variant_number
}
