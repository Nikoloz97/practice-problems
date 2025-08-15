function isBalanced(s) {
  // create bracket dict and stack

  // iterate through input
  // if opening, push to stack
  // if closing, pop top of stack
  // if top is not corresponding opening, return false

  // return false if stack is empty

  const bracketDict = { ")": "(", "]": "[", "}": "{" };
  const stack = [];
  for (let character of s) {
    if (Object.values(bracketDict).includes(character)) {
      stack.push(character);
    } else if (Object.keys(bracketDict).includes(character)) {
      if (stack.pop() !== bracketDict[character]) return false;
    }
  }
  return stack.length === 0;
}

function mostFrequent(arr) {
  // init map
  // iterate arr
  // add to arr if not present. If present, increment value by one

  // init result, max

  // iterate map
  // if greater than max, set val to max, set result to key

  // return result

  let map = new Map();
  for (let val of arr) {
    map.set(val, (map.get(val) || 0) + 1);
  }

  let result = null;
  let max = -Infinity;

  for (let [key, val] of map.entries()) {
    if (val > max) {
      max = val;
      result = key;
    }
  }

  return result;
}

function removeDuplicates(arr) {
  return [...new Set(arr)];
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
    } else if (num > second && num < first) {
      second = num;
    }
  }

  return second;
}

function isIsomorphic(s, t) {
  

}
