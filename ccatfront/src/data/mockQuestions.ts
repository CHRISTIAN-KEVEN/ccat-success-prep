export type Question = {
  id: number
  category: 'Numerical Reasoning' | 'Verbal Reasoning' | 'Spatial Reasoning'
  content: string
  options: { letter: string; text: string }[]
  correct: string
  strategy: { title: string; tip: string }
  shortcuts: { title: string; body: string }[]
}

const commonShortcuts = [
  {
    title: 'Mental Shortcuts',
    body: 'For percentage increase/decrease, use the "10% rule". Find 10% of the number by moving the decimal, then multiply.',
  },
  {
    title: 'Guessing Strategy',
    body: "When unsure, eliminate obviously wrong answers first. Never leave a question blank — there is no penalty for guessing on the CCAT.",
  },
]

const numericalStrategy = {
  title: 'Time Management',
  tip: 'Numerical questions should take no longer than 20 seconds. If you find yourself doing complex long division, stop and estimate.',
}
const verbalStrategy = {
  title: 'Analogy Strategy',
  tip: 'Identify the precise relationship first. Create a sentence: "A ___ does ___." The best answer fits the exact same relationship.',
}
const spatialStrategy = {
  title: 'Visualization Strategy',
  tip: 'Break spatial problems down step by step. Mentally mark each transformation before looking at the options.',
}

export const mockQuestions: Question[] = [
  {
    id: 1,
    category: 'Numerical Reasoning',
    content: 'A project requires 1,200 hours of labor. If 8 workers each work 35 hours per week, how many weeks will it take to complete the project?',
    options: [
      { letter: 'A', text: '3.5 Weeks' },
      { letter: 'B', text: '4.2 Weeks' },
      { letter: 'C', text: '4.3 Weeks' },
      { letter: 'D', text: '5.1 Weeks' },
    ],
    correct: 'C',
    strategy: numericalStrategy,
    shortcuts: commonShortcuts,
  },
  {
    id: 2,
    category: 'Verbal Reasoning',
    content: 'SYMPHONY is to COMPOSER as NOVEL is to:',
    options: [
      { letter: 'A', text: 'Publisher' },
      { letter: 'B', text: 'Reader' },
      { letter: 'C', text: 'Author' },
      { letter: 'D', text: 'Editor' },
    ],
    correct: 'C',
    strategy: verbalStrategy,
    shortcuts: commonShortcuts,
  },
  {
    id: 3,
    category: 'Numerical Reasoning',
    content: 'A store sells a jacket at 25% above cost. During a sale, the price is discounted by 20%. If the original cost was $80, what is the final sale price?',
    options: [
      { letter: 'A', text: '$64' },
      { letter: 'B', text: '$80' },
      { letter: 'C', text: '$84' },
      { letter: 'D', text: '$100' },
    ],
    correct: 'B',
    strategy: numericalStrategy,
    shortcuts: commonShortcuts,
  },
  {
    id: 4,
    category: 'Verbal Reasoning',
    content: 'Choose the word that best completes the sentence: The CEO\'s speech was so _____ that even the most skeptical investors became enthusiastic supporters.',
    options: [
      { letter: 'A', text: 'Ambiguous' },
      { letter: 'B', text: 'Laconic' },
      { letter: 'C', text: 'Compelling' },
      { letter: 'D', text: 'Verbose' },
    ],
    correct: 'C',
    strategy: verbalStrategy,
    shortcuts: commonShortcuts,
  },
  {
    id: 5,
    category: 'Spatial Reasoning',
    content: 'A cube has all its faces painted red. It is then cut into 27 equal smaller cubes. How many of the small cubes have exactly 2 painted faces?',
    options: [
      { letter: 'A', text: '8' },
      { letter: 'B', text: '12' },
      { letter: 'C', text: '6' },
      { letter: 'D', text: '1' },
    ],
    correct: 'B',
    strategy: spatialStrategy,
    shortcuts: commonShortcuts,
  },
  {
    id: 6,
    category: 'Numerical Reasoning',
    content: 'Train A travels at 60 mph and Train B at 90 mph, starting 300 miles apart and moving toward each other. In how many minutes will they meet?',
    options: [
      { letter: 'A', text: '90 minutes' },
      { letter: 'B', text: '100 minutes' },
      { letter: 'C', text: '120 minutes' },
      { letter: 'D', text: '150 minutes' },
    ],
    correct: 'C',
    strategy: numericalStrategy,
    shortcuts: commonShortcuts,
  },
  {
    id: 7,
    category: 'Verbal Reasoning',
    content: 'OSTRACIZE is to EXCLUDE as VENERATE is to:',
    options: [
      { letter: 'A', text: 'Despise' },
      { letter: 'B', text: 'Revere' },
      { letter: 'C', text: 'Ignore' },
      { letter: 'D', text: 'Challenge' },
    ],
    correct: 'B',
    strategy: verbalStrategy,
    shortcuts: commonShortcuts,
  },
  {
    id: 8,
    category: 'Spatial Reasoning',
    content: 'What comes next in the sequence: 2, 6, 18, 54, ___?',
    options: [
      { letter: 'A', text: '108' },
      { letter: 'B', text: '162' },
      { letter: 'C', text: '180' },
      { letter: 'D', text: '216' },
    ],
    correct: 'B',
    strategy: spatialStrategy,
    shortcuts: commonShortcuts,
  },
]
