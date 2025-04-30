// @ts-nocheck

const GeminiConfig = {
  Temperature: {
    DETERMINISTIC: 0.1,
    BALANCED: 0.5,
    CREATIVE: 1.0,
  },
};

async function delay(seconds) {
  return new Promise((resolve) => setTimeout(resolve, 1000 * seconds));
}

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cloneObject(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function concatArrays(arr1, arr2) {
  return [...cloneObject(arr1 ?? []), ...cloneObject(arr2 ?? [])];
}

function recursiveMergeConcat(obj1, obj2) {
  // Use JSON stringify/parse for a deep copy of obj1.
  // Note: This method has limitations (e.g., loses functions, Date objects become strings)
  // but is generally sufficient for standard JSON data structures.
  // Start with a deep copy of obj1 if it's an object, otherwise start empty.
  const mergedResult = isPlainObject(obj1) ? cloneObject(obj1) : {};

  // If obj2 is not an object, there's nothing to merge from it specifically by keys.
  // However, if obj1 wasn't an object either, we should return a copy of obj2 if it's mergeable,
  // or obj2 itself otherwise.
  if (!isPlainObject(obj2)) {
    if (!isPlainObject(obj1)) {
      // Neither are objects, return obj2 (or a copy if it's an array)
      return concatArrays(obj1, obj2);
    }
    // obj1 was an object, obj2 is not, return the copy of obj1
    return mergedResult;
  }

  // Iterate over the keys of obj2
  for (const key in obj2) {
    // Ensure the key is directly on obj2 (not inherited)
    if (Object.prototype.hasOwnProperty.call(obj2, key)) {
      const val1 = mergedResult[key];
      const val2 = obj2[key];

      // Check if the key already exists in the merged result
      if (Object.prototype.hasOwnProperty.call(mergedResult, key)) {
        // Key exists in both, apply specific merge rules
        if (Array.isArray(val1) && Array.isArray(val2)) {
          // --- Rule: Concatenate arrays ---
          mergedResult[key] = concatArrays(val1, val2);
        } else if (typeof val1 === "string" && typeof val2 === "string") {
          // --- Rule: Concatenate strings ---
          mergedResult[key] = [val1, val2].join("\n\n");
        } else if (isPlainObject(val1) && isPlainObject(val2)) {
          // --- Rule: Recursively merge plain objects ---
          mergedResult[key] = recursiveMergeConcat(val1, val2);
        } else {
          // --- Overwrite Rule: Different types or non-mergeable primitives ---
          // Deep copy val2 if it's an object/array to prevent shared references
          console.error("overwriting item:", { key, val1, val2 });
          mergedResult[key] =
            isPlainObject(val2) || Array.isArray(val2)
              ? cloneObject(val2)
              : val2;
        }
      } else {
        // Key only exists in obj2, add it to the result
        // Deep copy val2 if it's an object/array
        mergedResult[key] =
          isPlainObject(val2) || Array.isArray(val2) ? cloneObject(val2) : val2;
      }
    }
  }

  return mergedResult;
}

async function queryGeminiWithProgress(
  apiKey,
  prompt,
  responseSchema = `{"result": ""}`,
  temperature = GeminiConfig.Temperature.BALANCED,
  setProgressPercentage = (/** @type {number} */ ratio) => {
    showProgressingDialog(ratio);
    console.log({ ratio });
    if (ratio >= 1) {
      setTimeout(hideProgressDialog, 100);
    }
  }
) {
  setProgressPercentage(0);
  try {
    return await fetchFromGemini(apiKey, prompt, responseSchema, temperature);
  } finally {
    setProgressPercentage(1);
  }
}

/**
 * https://ai.google.dev/gemini-api/docs/structured-output
 */
async function fetchFromGemini(
  apiKey,
  prompt,
  responseSchema = `{"result": ""}`,
  temperature = GeminiConfig.Temperature.BALANCED
) {
  const modelName = "gemini-2.0-flash"; // Or another suitable Gemini model
  const username = "The Doctor"; // TODO: load user name from account context
  const date = new Date();
  const ADDITIONAL_INSTRUCTIONS = [
    "\n------",
    `This request is made by ${username} on ${date}.`,
    "\n------",
    `CRITICAL: ENSURE THE RESPONSE CAN BE PARSED AS A VALID JSON OBJECT.`,
    `CRITICAL: ENSURE THE JSON OBJECT HAS NO FAULTY ESCAPED, CONTROL CHARACTERS OR UNTERMINATED OUTPUT.`,
    `CRITICAL: ENSURE ALL JSON CONTENT IS PROPERLY FORMATTED AND ESCAPED, MINIMISING THE OCCURENCE OF BACKSLASHES AND WHITESPACES.`,
    `CRITICAL: THE JSON OBJECT MUST ADHERE STRICTLY TO THE FOLLOWING SCHEMA STRUCTURE:`,
    responseSchema,
  ].join("\n");
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt + ADDITIONAL_INSTRUCTIONS,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: temperature * (1 + Math.random()),
            response_mime_type: "application/json",
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("Gemini API Error:", error);
      return null;
    }

    const data = await response.json();
    const generatedText =
      data.candidates && data.candidates[0]?.content?.parts?.[0]?.text;
    const sanitizedText = generatedText
      .replace(/(?<!\\)\n/g, "")
      .replaceAll("\\$", "$")
      .split("\n")
      .join("\\n");

    if (sanitizedText) {
      try {
        return robustJsonParse(sanitizedText);
      } catch (error) {
        console.error("Error parsing Gemini API response:", {
          error,
          sanitizedText,
        });
        return null;
      }
    } else {
      console.log("No response text received from Gemini API.");
      return null;
    }
  } catch (error) {
    console.error("Error querying Gemini API:", error);
    return null;
  }
}

/**
 * A function to parse JSON strings robustly.
 * It attempts to fix common JSON parsing errors by escaping problematic characters.
 * This is a simplified version and may not cover all edge cases.
 * Use with caution and test thoroughly.
 * @param {string} jsonString
 * @returns
 */
function robustJsonParse(jsonString) {
  let attemptCount = Math.round(jsonString.length / 10);
  let adjustedJson = jsonString;
  let lastFailureIndex = -1;
  while (attemptCount > 0) {
    try {
      return JSON.parse(adjustedJson);
    } catch (error) {
      const errorMessage = `${error}`;
      console.log({ errorMessage });
      if (errorMessage.startsWith("SyntaxError")) {
        const result = errorMessage.match(/at position (\d+)/);
        if (!result) {
          console.log("Unable to get failure index");
          return;
        }
        lastFailureIndex = parseInt(result[1]);
        const charBeforeError = adjustedJson[lastFailureIndex - 1];
        const charAtError = adjustedJson[lastFailureIndex];

        console.log({
          lastFailureIndex,
          charBeforeError,
          charAtError,
          range: adjustedJson.substring(
            lastFailureIndex - 10,
            lastFailureIndex + 10
          ),
        });

        if (charBeforeError === '"') {
          adjustedJson =
            adjustedJson.substring(0, lastFailureIndex - 1) +
            '\\"' +
            adjustedJson.substring(lastFailureIndex);
        }
      }
    }
    attemptCount -= 1;
  }
}
