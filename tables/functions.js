/*
  Various helper functions
*/
export const characters = 'a-záéíóúýðþæö'
export const vowels = 'aeiouyáéíóúýæö'
export const dipthongs = 'au|e[yi]'
import Word from './word'

export const endsInVowel = (input) => {
  let string
  if (input instanceof Word) {
    string = input.getFirstValue()
  } else {
    string = input
  }
  return (new RegExp(`[${vowels}]$`, 'i')).test(string)
}

export const endsInConsonant = (string) => {
  return !endsInVowel(string)
}
const splitOnVowels = (input) => {
  return input && input.split(new RegExp(`([${vowels}]+)`, 'i'))
}
const splitOnAll = (input) => {
  return input && input.split(new RegExp(`(${dipthongs}|[${characters}])`, 'i'))
}
const removeFirstVowel = (input) => {
  let output = splitOnVowels(input)
  output.splice(1, 1)
  return output.join('')
}



export const highlightIrregularities = (form, word) => {
  let output = form
  const baseWord = word.getBaseWord()
  if (!baseWord) return form;

  /* Highlight sound shifts */
  const baseWord_split = splitOnVowels(baseWord)
  let form_split = splitOnVowels(form)
  const baseWord_first_vowel = baseWord_split[1]
  const form_first_vowel = form_split[1]
  if (baseWord_first_vowel !== form_first_vowel) {
    form_split[1] = `<u>${form_split[1]}</u>`
    output = form_split.join('')
  }
  /* Highlight in entirety if word is considerably different from the stem */
  const stem = getStem(word)
  if (stem) {
    /*
      Is there a change in the stem region?
      Skip over first vowel since it was already checked above
    */
    const form_full_split = splitOnAll(removeFirstVowel(form))
    // console.log(form)
    const isDifferent = splitOnAll(removeFirstVowel(stem)).some((part, index) => {
      // form === 'kvenna' && console.log({part,ja:form_full_split[index]})
      return part !== form_full_split[index]
    })
    if (isDifferent) {
      output = `<em>${output}</em>`
    }
  }

  return output
}

/* See https://is.wikipedia.org/wiki/Stofn_(m%C3%A1lfr%C3%A6%C3%B0i) */
export const getStem = (word) => {
  if (word.is('noun')) {
    if (word.isStrong()) {
      return word.getOriginal().get('accusative', 'without definite article', 'singular').getFirstValue()
    } else {
      const x = word.getOriginal().get('nominative', 'without definite article', 'singular').getFirstValue()
      return x && x.replace((new RegExp(`([${vowels}]+)$`, 'i')), '')
    }
  }
}
