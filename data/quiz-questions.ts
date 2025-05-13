export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number // Index of the correct answer (0-3)
}

export const developerQuizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "What is the correct way to declare a variable in JavaScript that cannot be reassigned?",
    options: ["var x = 5;", "let x = 5;", "const x = 5;", "static x = 5;"],
    correctAnswer: 2,
  },
  {
    id: "q2",
    question: "Which of the following is NOT a React hook?",
    options: ["useEffect", "useState", "useHistory", "useDispatch"],
    correctAnswer: 3,
  },
  {
    id: "q3",
    question: "What does the CSS property 'display: flex' do?",
    options: [
      "Makes an element invisible",
      "Creates a flexible box layout",
      "Makes text bold and italic",
      "Adds animation to elements",
    ],
    correctAnswer: 1,
  },
  {
    id: "q4",
    question: "Which HTTP status code indicates a successful response?",
    options: ["200 OK", "404 Not Found", "500 Internal Server Error", "302 Found"],
    correctAnswer: 0,
  },
  {
    id: "q5",
    question: "What is the purpose of the 'async' keyword in JavaScript?",
    options: [
      "To make a function run faster",
      "To indicate that a function returns a Promise",
      "To prevent a function from executing",
      "To make a variable globally accessible",
    ],
    correctAnswer: 1,
  },
  {
    id: "q6",
    question: "Which of the following is a valid way to create a React functional component?",
    options: [
      "function MyComponent() { return <div>Hello</div>; }",
      "class MyComponent { render() { return <div>Hello</div>; } }",
      "const MyComponent = function() { <div>Hello</div>; }",
      "MyComponent => { return <div>Hello</div>; }",
    ],
    correctAnswer: 0,
  },
  {
    id: "q7",
    question: "What does the git command 'git pull' do?",
    options: [
      "Creates a new branch",
      "Uploads local changes to a remote repository",
      "Downloads and integrates changes from a remote repository",
      "Shows the commit history",
    ],
    correctAnswer: 2,
  },
  {
    id: "q8",
    question: "Which of the following is NOT a JavaScript array method?",
    options: ["map()", "filter()", "reduce()", "append()"],
    correctAnswer: 3,
  },
  {
    id: "q9",
    question: "What is the purpose of TypeScript?",
    options: [
      "To replace JavaScript completely",
      "To add static typing to JavaScript",
      "To improve JavaScript runtime performance",
      "To add new UI components to web applications",
    ],
    correctAnswer: 1,
  },
  {
    id: "q10",
    question: "Which CSS property is used to create space between elements?",
    options: ["space-between", "margin", "padding", "gap"],
    correctAnswer: 1,
  },
]
