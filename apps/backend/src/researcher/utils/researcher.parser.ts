export function parseLLMJson<T>(rawText: string): T {
  if (!rawText) {
    throw new Error('LLM response is empty');
  }

  const jsonRegex = /({[\s\S]*})/;
  const match = rawText.match(jsonRegex);

  if (!match) {
    throw new Error('No valid JSON block found in the response');
  }

  try {
    const cleanJson = match[0];
    return JSON.parse(cleanJson) as T;
  } catch (error) {
    throw new Error(`Failed to parse extracted JSON: ${error.message}`);
  }
}
