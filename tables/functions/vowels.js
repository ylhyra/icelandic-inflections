/*
  Various helper functions
*/
import assert from 'assert'
import Word from './../word'
export const characters = 'a-záéíóúýðþæö'
export const vowels = 'aeiouyáéíóúýæö'
export const dipthongs = 'au|e[yi]'
export const vowellike_clusters = `au|e[yi]|j[auúóöyi]` // Umlaut (hljóðvarp) and Germanic a-mutation (klofning)

export const endsInVowel = (input) => {
  let string
  if (input instanceof Word) {
    string = input.getFirstValue()
  } else {
    string = input
  }
  assert(typeof string === 'string')
  return (new RegExp(`[${vowels}]$`, 'i')).test(string)
}

export const endsInConsonant = (string) => {
  assert.equal(typeof string, 'string')
  return !endsInVowel(string)
}
export const splitOnVowels = (string) => {
  assert.equal(typeof string, 'string')
  return string && string.split(new RegExp(`(${vowellike_clusters}|[${vowels}]+)`, 'i'))
}
export const splitOnAll = (string) => {
  assert.equal(typeof string, 'string')
  return string && string.split(new RegExp(`(${vowellike_clusters}|[${characters}])`, 'i'))
}
export const removeLastVowelCluster = (string) => {
  assert.equal(typeof string, 'string')
  return string && string.replace((new RegExp(`(${vowellike_clusters}|[${vowels}]+)$`, 'i')), '')
}
