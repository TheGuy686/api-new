/**
 *  Normalizer: 
 *      
 *      The idea behind this file is to loop through each possible 
 *      form of a word and then to convert that word to a standardized
 *      format. For e.g. "id, i'd I'D I'd I would" into "I would"
 * 
 * 
 */

// 1. I can
// 2. You can
// 3. He can
// 4. She can
// 5. It can
// 6. We can
// 7. They can

// 8. I could
// 9. You could
// 10. He could
// 11. She could
// 12. It could
// 13. We could
// 14. They could

// 15. I will / I'll
// 16. You will / You'll
// 17. He will / He'll
// 18. She will / She'll
// 19. It will / It'll
// 20. We will / We'll
// 21. They will / They'll

// 22. I shall / I'll
// 23. You shall / You'll
// 24. He shall / He'll
// 25. She shall / She'll
// 26. It shall / It'll
// 27. We shall / We'll
// 28. They shall / They'll

// 29. I may / I'll
// 30. You may / You'll
// 31. He may / He'll
// 32. She may / She'll
// 33. It may / It'll
// 34. We may / We'll
// 35. They may / They'll

// 36. I might / I'll
// 37. You might / You'll
// 38. He might / He'll
// 39. She might / She'll
// 40. It might / It'll
// 41. We might / We'll
// 42. They might / They'll

// 43. I must / I'll
// 44. You must / You'll
// 45. He must / He'll
// 46. She must / She'll
// 47. It must / It'll
// 48. We must / We'll
// 49. They must / They'll

// 50. I should / I'll
// 51. You should / You'll
// 52. He should / He'll
// 53. She should / She'll
// 54. It should / It'll
// 55. We should / We'll
// 56. They should / They'll

// 1. I can / I'll / I could / I would / I should
// 2. You can / You'll / You could / You would / You should
// 3. He can / He'll / He could / He would / He should
// 4. She can / She'll / She could / She would / She should
// 5. It can / It'll / It could / It would / It should
// 6. We can / We'll / We could / We would / We should
// 7. They can / They'll / They could / They would / They should

// 8. I could have / I would have / I should have
// 9. You could have / You would have / You should have
// 10. He could have / He would have / He should have
// 11. She could have / She would have / She should have
// 12. It could have / It would have / It should have
// 13. We could have / We would have / We should have
// 14. They could have / They would have / They should have

// 15. I might / I'll / I might have
// 16. You might / You'll / You might have
// 17. He might / He'll / He might have
// 18. She might / She'll / She might have
// 19. It might / It'll / It might have
// 20. We might / We'll / We might have
// 21. They might / They'll / They might have

// 22. I must / I'll / I must have
// 23. You must / You'll / You must have
// 24. He must / He'll / He must have
// 25. She must / She'll / She must have
// 26. It must / It'll / It must have
// 27. We must / We'll / We must have
// 28. They must / They'll / They must have

// 29. I shall / I'll / I should / I shall have
// 30. You shall / You'll / You should / You shall have
// 31. He shall / He'll / He should / He shall have
// 32. She shall / She'll / She should / She shall have
// 33. It shall / It'll / It should / It shall have
// 34. We shall / We'll / We should / We shall have
// 35. They shall / They'll / They should / They shall have

import terms from './terms';

function replaceAllOccurrences(inputString: string, searchValue: string, replaceValue: string) {
    return inputString.split(searchValue).join(replaceValue);
}

export default class Normalizer {
    static run(input: string) {
        console.clear();

        let inp = input.toLowerCase();

        // first loop over each term to sanitize
        for (const t of terms) {
            // then loop over each variant and do a string replace
            for (const v of t.matches) {
                inp = replaceAllOccurrences(inp, v, t.term);
            }
        }

        return inp.split('\n').filter(l => l != '');
    }
}