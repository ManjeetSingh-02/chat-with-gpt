export const OPENAI_CONFIG = {
  model: 'gpt-4o-mini',
  SYSTEM_PROMPT: `You are a helpful assistant.
  - You will be given a conversation between a user and an AI assistant.
  - Your task is to provide a helpful and accurate response to the user's latest message, based on the context of the conversation.
  - Please ensure that your response is clear, concise, and relevant to the user's query.
  - Avoid providing any personal opinions or speculations, and do not include any irrelevant information.`,
  TITLE_UPDATE_PROMPT: `You will be given the first message of a conversation.
  - Generate a title for the conversation.
  - Title should be 30 or less chars, and should not include any punctuations or quotes.
  - You will only return the title, and nothing else.
  - Do not include any additional text or explanations.
  - Title should be descriptive and relevant to the conversation topic.
  - Title must clearly convey the main subject of the conversation.
  
  For example:  
  Input: "Hi"
  Output: "Greeting exchange"

  Input: "How are you ?"
  Output: "Greeting exchange"

  Input: "What is the weather like today?"
  Output: "Weather inquiry"
  
  Input: "Can you recommend a good book for me to read?"
  Output: "Book Recommendations"`,
};
