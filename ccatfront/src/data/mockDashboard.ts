export const mockUser = {
  name: 'Alex Thompson',
  initials: 'AT',
  role: 'Senior Financial Analyst',
  tier: 'PRO TIER',
  email: 'alex.thompson@corporate.com',
  timezone: 'GMT -5 (EST)',
  proExpiresIn: 142,
  linkedinVerified: true,
  memberSince: 2023,
  nextBilling: 'Dec 12, 2024',
}

export const mockStats = [
  { label: 'PERCENTILE RANK', value: '84th', sub: 'Top 16% of all test takers', change: '+5%', up: true },
  { label: 'AVG. SCORE', value: '42/50', sub: 'Target: 45 for Tier-1 Tech', change: '+3.2', up: true },
  { label: 'ACCURACY', value: '78.4%', sub: 'Consistent across 12 sessions', change: null, up: null },
  { label: 'AVG. PACE', value: '17.2s', sub: 'Standard CCAT pace is 18s', change: null, up: null },
]

export const mockProgression = [
  { label: 'Attempt 1', score: 22 },
  { label: 'Attempt 2', score: 28 },
  { label: 'Attempt 3', score: 33 },
  { label: 'Attempt 4', score: 38 },
  { label: 'Attempt 5', score: 42 },
]

export const mockDomains = [
  { name: 'Verbal Reasoning', accuracy: 88, speed: '14s', status: 'Optimal', ok: true },
  { name: 'Numerical Reasoning', accuracy: 66, speed: '24s', status: 'Needs Focus', ok: false },
  { name: 'Spatial Reasoning', accuracy: 78, speed: '18s', status: 'Optimal', ok: true },
]

export const mockFocusAreas = [
  { category: 'Number Series', attempts: 12, accuracy: 42, pace: '28s', status: 'Critical', statusColor: 'red' },
  { category: 'Sentence Completion', attempts: 15, accuracy: 82, pace: '12s', status: 'Mastered', statusColor: 'blue' },
  { category: 'Abstract Reasoning', attempts: 10, accuracy: 55, pace: '24s', status: 'Review', statusColor: 'gray' },
  { category: 'Basic Algebra', attempts: 8, accuracy: 60, pace: '10s', status: 'Review', statusColor: 'gray' },
  { category: 'Word Analogies', attempts: 14, accuracy: 85, pace: '11s', status: 'Optional', statusColor: 'gray' },
]

export const mockStudyPlan = [
  { type: 'HIGH PRIORITY DRILL', title: 'Number Series: Pattern Recognition', duration: '15 min', color: 'red' },
  { type: 'SPEED DRILL', title: 'Basic Algebra Flashcards', duration: '10 min', color: 'blue' },
  { type: 'ACCURACY DRILL', title: 'Abstract Logic: Matrix Rotation', duration: '20 min', color: 'blue' },
  { type: 'THEORY REVIEW', title: 'Sentence Completion Logic', duration: '12 min', color: 'blue' },
]

export const mockQuestion = {
  current: 14,
  total: 50,
  category: 'Numerical Reasoning',
  timeSeconds: 836, // 13:56
  content: 'A project requires 1,200 hours of labor. If 8 workers each work 35 hours per week, how many weeks will it take to complete the project?',
  options: [
    { letter: 'A', text: '3.5 Weeks' },
    { letter: 'B', text: '4.2 Weeks' },
    { letter: 'C', text: '4.3 Weeks' },
    { letter: 'D', text: '5.1 Weeks' },
  ],
  strategy: {
    title: 'Time Management',
    tip: 'Numerical questions should take no longer than 20 seconds. If you find yourself calculating complex long division, stop and estimate.',
  },
  shortcuts: [
    {
      title: 'Mental Shortcuts',
      body: 'For percentage increase/decrease, use the "10% rule". Find 10% of the number by moving the decimal, then multiply.',
    },
    {
      title: 'Guessing Strategy',
      body: 'When unsure, eliminate obviously wrong answers first. Never leave a question blank — there is no penalty for guessing.',
    },
  ],
  sessionTarget: '42+ Correct Answers',
  reliability: 99.9,
  inputMode: 'SMART_FOCUS',
}
