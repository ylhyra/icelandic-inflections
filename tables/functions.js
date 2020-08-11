export const characters = 'a-záéíóúýðþæö'
export const vowels = 'aeiouyáéíóúýæö'
import Word from './word'

export const endsInVowel = (input) => {
  let string
  if (input instanceof Word) {
    string = input.getFirstValue()
  } else {
    string = input
  }
  return (new RegExp(`[aeiouyáéíóúýæö]$`, 'i')).test(string)
}

export const endsInConsonant = (string) => {
  return !endsInVowel(string)
}
