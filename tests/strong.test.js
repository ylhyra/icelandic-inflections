import { splitOnVowels } from './tables/functions/vowels.js'

test('Split on vowels', () => {
  expect(splitOnVowels('Kjartan')).toBe(['K', 'ja', 'rt', 'a', 'n']);
});
