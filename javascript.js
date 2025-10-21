// examples:
// 1. ()[]{} -> true
// 2. {[()]} -> true
// 3. {[(])} -> false

function isBalanced(input) {
  // keys = closing; values = opening
  const bracketDict = { ")": "(", "]": "[", "}": "{" };
  const stack = [];
  for (let inputChar of input) {
    if (Object.values(bracketDict).includes(inputChar)) {
      stack.push(inputChar);
    } else if (Object.keys(bracketDict).includes(inputChar)) {
      if (stack.pop() !== bracketDict[inputChar]) return false;
    }
  }
  return stack.length === 0;
}

// examples:
// 1. [1, 2, 2, 3, 1, 2]
// 2. ["apple", "banana", "apple", "orange", "apple"]
// 3. [true, false, true, true, false]

function mostFrequent(array) {
  let map = new Map();
  for (let item of array) {
    map.set(item, (map.get(item) || 0) + 1);
  }

  let result = null;
  let max = -Infinity;

  for (let [key, val] of map) {
    if (val > max) {
      max = val;
      result = key;
    }
  }

  return result;
}

function removeDuplicatesFromPrimitives(primitiveArray) {
  return [...new Set(primitiveArray)];
}

function removeDuplicatesFromReferences(referenceArray) {
  return referenceArray.filter(
    (referenceItem, index, self) =>
      index ===
      self.findIndex(
        (selfItem) => JSON.stringify(referenceItem) === JSON.stringify(selfItem)
      )
  );
}

function removeDuplicatesByReferenceProperty(inputArray, propertyKey) {
  const seen = new Map();

  return inputArray.filter((inputItem) => {
    const inputItemValue = inputItem[propertyKey];
    if (seen.has(inputItemValue)) return false;
    seen.set(inputItemValue, true);
    return true;
  });
}

function countVowels(str) {
  const vowels = "AEIOUaeiou";
  return [...str].filter((char) => vowels.includes(char)).length;
}

function secondLargest(arr) {
  let first = -Infinity,
    second = -Infinity;

  for (let num of arr) {
    if (num > first) {
      second = first;
      first = num;
    } else if (num > second) {
      second = num;
    }
  }

  return second;
}

function reverseString(stringInput) {
  const stack = [];

  for (let char of stringInput) {
    stack.push(char);
  }

  let result = "";

  while (stack.length !== 0) {
    result += stack.pop();
  }

  return result;
}

// Examples:
// 1. "leetcode" -> "l"
// 2. "loveleetcode" -> "v"
// 3. "aabb" -> -1 (or null, no non-repeating char)
function firstNonRepeatingChar(str) {
  // idea = store + read form a dictionary

  const charCount = new Map();

  for (let char of str) {
    charCount.set(char, (charCount.get(char) || 0) + 1);
  }
  for (let char of str) {
    if (charCount.get(char) === 1) return char;
  }
  return -1;
}

// Examples:
// 1. "listen", "silent" -> true
// 2. "hello", "world" -> false
function areAnagrams(str1, str2) {
  // idea = use a char : frequency dictionary

  if (str1.length !== str2.length) return false;
  const charCount = new Map();
  for (let char of str1) {
    charCount.set(char, (charCount.get(char) || 0) + 1);
  }
  for (let char of str2) {
    if (!charCount.has(char)) return false;
    charCount.set(char, charCount.get(char) - 1);
    if (charCount.get(char) < 0) return false;
  }
  return true;
}

// Examples:
// 1. [1, 2, 4, 5] (should have 1-5) -> 3
// 2. [0, 1, 3] (should have 0-3) -> 2
function findMissingNumberInArray(arr) {
  // idea = create a set, loop from min and max, and find missing number in between

  const seen = new Set(arr);
  for (let i = Math.min(...arr); i <= Math.max(...arr); i++) {
    if (!seen.has(i)) return i;
  }
  return null;
}

// Examples:
// 1. [1, [2, 3], [4, [5, 6]]] -> [1, 2, 3, 4, 5, 6]
// 2. [[1], [2, [3, [4]]]] -> [1, 2, 3, 4]
function flattenArray(arr) {
  let result = [];
  for (let item of arr) {
    if (Array.isArray(item)) {
      result = result.concat(flattenArray(item));
    } else {
      result.push(item);
    }
  }
  return result;
}

// Examples:
// 1. [2, 7, 11, 15], target = 9 -> [0, 1] (indices of 2 and 7)
// 2. [3, 2, 4], target = 6 -> [1, 2] (indices of 2 and 4)
function twoSum(arr, target) {
  const seen = new Map();
  for (let i = 0; i < arr.length; i++) {
    const complement = target - arr[i];
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    seen.set(arr[i], i);
  }
  return null;
}

// 7. LONGEST SUBSTRING WITHOUT REPEATING CHARACTERS
// Examples:
// 1. "abcabcbb" -> 3 ("abc")
// 2. "bbbbb" -> 1 ("b")
// 3. "pwwkew" -> 3 ("wke")
function longestSubstring(str) {
  const charIndex = new Map();
  let maxLength = 0;
  let startIndex = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (charIndex.has(char) && charIndex.get(char) >= startIndex) {
      startIndex = charIndex.get(char) + 1;
    }
    charIndex.set(char, i);
    maxLength = Math.max(maxLength, i - startIndex + 1);
  }
  return maxLength;
}

// Examples:
// 1. "A man, a plan, a canal: Panama" -> true
// 2. "race a car" -> false
function isValidPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, "");
  return cleaned === cleaned.split("").reverse().join("");
}

// Examples:
// 1. [{name: "Alice", age: 25}, {name: "Bob", age: 25}, {name: "Charlie", age: 30}], "age"
//    -> {25: [{name: "Alice", age: 25}, {name: "Bob", age: 25}], 30: [{name: "Charlie", age: 30}]}
function groupByProperty(arr, property) {
  const groups = new Map();
  for (let item of arr) {
    const key = item[property];
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key).push(item);
  }
  return Object.fromEntries(groups);
}

// Examples:
// 1. [1, 2, 2, 3], [2, 2, 4] -> [2, 2]
// 2. ["apple", "banana"], ["banana", "orange"] -> ["banana"]
function findOverlap(arr1, arr2) {
  const set2 = new Set(arr2);
  const result = [];
  for (let item of arr1) {
    if (set2.has(item)) {
      result.push(item);
      set2.delete(item); // Remove to handle duplicates correctly
    }
  }
  return result;
}
