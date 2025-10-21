// examples:
// 1. ()[]{} -> true
// 2. {[()]} -> true
// 3. {[(])} -> false

function isBalanced(input) {
  const bracketDict = { "]": "[", ")": "(", "}": "{" };
  const stack = [];

  for (let inputChar in input) {
    if (Object.values(bracketDict).includes(inputChar)) {
      stack.push(inputChar);
    } else if (Object.keys(bracketDict).includes(inputChar)) {
      if (stack.pop() !== bracketDict[inputChar]) return false;
    } else {
      return false;
    }

    return stack.length === 0;
  }
}

function mostFrequent(array) {
  // initialize map
  let map = new Map();

  for (let item of array) {
    map.set(item, (map.get(item) || 0) + 1);
  }

  // iterate + create running highest value
  let max = -Infinity;
  let result;

  for (let [key, value] of map) {
    if (value > max) {
      max = value;
      result = key;
    }
  }

  // return highest value
  return result;
}

function removeDuplicatesFromPrimitives(array) {
  return [...new Set(array)];
}

function removeDuplicatesFromReferences(inputArray) {
  return inputArray.filter(
    (inputItem, index, self) =>
      index ===
      self.findIndex(
        (selfItem) => JSON.stringify(selfItem) === JSON.stringify(inputItem)
      )
  );
}

function removeDuplicatesByReferenceProperty(inputArray, propertyKey) {
  const seen = new Map();

  return inputArray.filter((inputItem) => {
    const propertyValue = inputItem[propertyKey];
    if (seen.has(propertyValue)) return false;
    seen.set(propertyValue, true);
    return true;
  });
}

function countVowels(stringInput) {
  const vowels = "AEIOUaeiou";
  return [...stringInput].filter((char) => vowels.includes(char)).length;
}

function secondLargest(arrayInput) {
  let first = -Infinity,
    second = -Infinity;

  for (let num of arrayInput) {
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

function firstNonRepeatingChar(stringInput) {
  const charCount = new Map();

  for (let char of stringInput) {
    charCount.set(char, (charCount.get(char) || 0) + 1);
  }

  for (let char of stringInput) {
    if (charCount.get(char) === 1) return char;
  }

  return -1;
}

function areAnagrams(stringInputOne, stringInputTwo) {
  if (stringInputOne.length !== stringInputTwo.length) return false;

  const charCount = new Map();

  for (let char of stringInputOne) {
    charCount.set(char, (charCount.get(char) || 0) + 1);
  }

  for (let char of stringInputTwo) {
    if (!charCount.get(char)) return false;
    const decrementedVal = charCount.get(char)--
    if (decrementedVal === 0) {
      charCount.delete(char);
    } else {
      charCount.set(char, (decrementedVal));
    }
  }

  return charCount.size === 0; 
}


function findMissingNumberInArray(numArray) {
  const seen = new Set(numArray);

  for (let i = Math.min(...numArray); i < Math.max(...numArray); i++)  {
    if (!seen.has(i)) return i;
  }

  return -1;
}
