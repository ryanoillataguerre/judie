const subjectToEmojiMap: { [key: string]: string } = {
  "Statistics & Probability": "📊",
  "Art History": "🎨",
  Biology: "🧬",
  Chemistry: "🧪",
  "Calculus AB": "📈",
  "Environmental Science": "🌳",
  Macroeconomics: "💰",
  Microeconomics: "💸",
  "European History": "🏰",
  "Machine Learning": "🤖",
  "AP Physics 1": "🌌",
};

export const getTopicEmoji = (inputString: string) => {
  return subjectToEmojiMap[inputString] || "📚";
};
