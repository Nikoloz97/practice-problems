using System.Linq;

public static bool IsPalindrome(string input) {
    // clean string (remove non digit/string + convert to lowercase)
    // check if string palindrome (via left/right pointers)

    var chars = new List<char>();
    foreach (char item in chars) {
        if (char.IsLetterOrDigit(item))
        {
            chars.Add(item.ToLower(item));
        }
    }

    int left = 0;
    int right = chars.Count - 1;
    
    while (left < right) 
    {
        if (chars[left] !== chars[right]) return false; 
        left++;
        right--; 
    }

    return true; 
}


public static bool IsPalindrome_Linq(string input) {
    // create a cleaned string (remove non-letter or digits, set to lowercase) 
    // compare against reversed cleans string 
    
    var cleanedString = new string(input.Where(char.IsLetterOrDigit).Select(char.ToLower).ToArray());
    return cleanedString.SequenceEqual(cleanedString.Reverse());
}

public static List<int> DuplicateNumbers(int[] arr) {
    var seen = new HashSet<int>();
    var duplicates = new HashSet<int>();

    foreach (int num in arr) 
    {
        if (!seen.Add(num))
        {
            duplicates.Add(num);
        }
    }

    return new List<int>(duplicates); 
}

public static int FindTotalWeight(List<int> cans) {
    var canList = new List<int>(cans);
    int totalWeight = 0;

    while (canList.Count > 0) {
        int minWeight = int.MaxValue();
        int minIndex = -1;

        for (int i = 0; i < canList.Count; i++)
        {
            if (canList[i] < minWeight)
            {
                minWeight = canList[i];
                minIndex = i;
            }
        }

        totalWeight += minWeight; 


        // remove cans in the range
        int start = Math.Max(0, minIndex - 1);
        inst end = Math.Min(canList.Count - 1, minIndex + 1);

        for (int i = end; i >= start, i--)
        {
            canList.RemoveAt(i);
        }
    }

    return totalWeight; 
}

