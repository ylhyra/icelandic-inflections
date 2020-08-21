/*
  Various helper functions
*/
export const characters = 'a-záéíóúýðþæö'
export const vowels = 'aeiouyáéíóúýæö'
export const dipthongs = 'au|e[yi]'
export const vowellike_clusters = `au|e[yi]|j[auúóöyi]|${vowels}` // Umlaut (hljóðvarp) and Germanic a-mutation (klofning)
import Word from './../word'

export const endsInVowel = (input) => {
  let string
  if (input instanceof Word) {
    string = input.getFirstValue()
  } else {
    string = input
  }
  return (new RegExp(`${vowels}$`, 'i')).test(string)
}

export const endsInConsonant = (string) => {
  return !endsInVowel(string)
}
export const splitOnVowels = (input) => {
  return input && input.split(new RegExp(`(${vowellike_clusters}]+)`, 'i'))
}
export const splitOnAll = (input) => {
  return input && input.split(new RegExp(`(${vowellike_clusters}|[${characters}])`, 'i'))
}
export const removeLastVowelCluster = (input) => {
  return input && input.replace((new RegExp(`(${vowellike_clusters}+)$`, 'i')), '')
}
