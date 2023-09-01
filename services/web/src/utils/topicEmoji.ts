export const getTopicEmoji = (inputString: string) => {
  switch (inputString) {
    case "Statistics & Probability":
      return "📊";
    case "Art History":
      return "🎨";
    case "Biology":
      return "🧬";
    case "Chemistry":
      return "🧪";
    case "Calculus AB":
      return "📈";
    case "Environmental Science":
      return "🌳";
    case "Macroeconomics":
      return "💰";
    case "Microeconomics":
      return "💸";
    case "European History":
      return "🏰";
    case "Machine Learning":
      return "🤖";
    default:
      return "📚";
  }
};
