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
  "AP Art History": "🎨",
  "AP Biology": "🧬",
  "AP Chemistry": "🧪",
  "AP Calculus AB": "📈",
  "AP Environmental Science": "🌳",
  "AP Physics 2": "🌌",
  "AP Statistics": "📊",
  "AP US Govt": "🇺🇸",
  "AP US Hist": "🏛️",
  "AP English Literature & Composition": "📚",
  "AP English Language & Composition": "📖",
  "AP Comparative Government & Politics": "🌎",
  "AP Human Geography": "🌎",
  "AP Macroeconomics": "💰",
  "AP Microeconomics": "💸",
  "AP European History": "🏰",
  "AP World History": "🌎",
  "AP Psychology": "🧠",
  "AP Computer Science A": "💻",
  "AP Computer Science Principles": "💻",
  "Algebra I": "📈",
  "Algebra II": "📈",
  "College Algebra": "🎨",
  "Cosmology & Astronomy": "💫",
  "Linear Algebra": "📈",
  "Multivariable Calculus": "📈",
  "Differential Equations": "📈",
  Geometry: "📐",
  "High School Biology": "🧬",
  "High School Chemistry": "🧪",
  "High School Physics": "🌌",
  "High School English": "📚",
  "High School History": "🏛️",
  "Middle School Math": "📈",
  "Inorganic Chemistry": "🧪",
  "Organic Chemistry": "🧪",
  Biochemistry: "🧬",
  Philosophy: "🧠",
  Psychology: "🧠",
  "Computer Science": "💻",
  "Computer Programming": "💻",
  "Computer Science Fundamentals": "💻",
  "Computer Science Principles": "💻",
  Calculus: "📈",
  "Pre-Calculus": "📈",
  Trigonometry: "📈",
  Statistics: "📊",
  Probability: "📊",
  "Alaska History": "🏔️",
  SAT: "📝",
  ACT: "📝",
  GRE: "📝",
  GMAT: "📝",
  LSAT: "📝",
  MCAT: "📝",
  PSAT: "📝",
  SSAT: "📝",
  "Elementary School Math": "📕",
  "Elementary School English": "📕",
  "Elementary School History": "📕",
  "Elementary School Science": "🔬",
  "GMAT Preparation": "📝",
  "College Admissions": "🎓",
};

export const getTopicEmoji = (inputString: string) => {
  return subjectToEmojiMap[inputString] || "📚";
};
