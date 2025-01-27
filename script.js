const API_URL = "https://opentdb.com/api.php?amount=3&type=multiple";

let questions = [];
let currentQuestion = 0;
let score = 0;

const questionElement = document.getElementById("question");
const optionsContainer = document.getElementById("options");
const nextButton = document.getElementById("next-btn");
const restartButton = document.getElementById("restart-btn");
const resultElement = document.getElementById("result");
const scoreElement = document.getElementById("score");
const totalQuestionsElement = document.getElementById("total-questions");

async function fetchQuestions() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        questions = data.results.map((q) => ({
            question: q.question,
            options: shuffleArray([...q.incorrect_answers, q.correct_answer]),
            answer: q.correct_answer,
        }));
        totalQuestionsElement.textContent = questions.length;
        loadQuestion();
    } catch (error) {
        alert("Failed to fetch questions from API!");
        console.error(error);
    }
}

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

function loadQuestion() {
    const current = questions[currentQuestion];
    questionElement.innerHTML = current.question;
    optionsContainer.innerHTML = "";
    current.options.forEach((option) => {
        const label = document.createElement("label");
        label.innerHTML = `
          <input type="radio" name="option" value="${option}">
          ${option}
        `;
        optionsContainer.appendChild(label);
    });
}

function getSelectedOption() {
    const options = document.getElementsByName("option");
    for (let option of options) {
        if (option.checked) {
            return option.value;
        }
    }
    return null;
}

function showResult() {
    resultElement.style.display = "block";
    scoreElement.textContent = score;
    nextButton.style.display = "none";
    restartButton.style.display = "block";
}

nextButton.addEventListener("click", () => {
    const selected = getSelectedOption();
    if (!selected) {
        alert("Please select an answer before proceeding!");
        return;
    }
    if (selected === questions[currentQuestion].answer) {
        score++;
    }
    currentQuestion++;
    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        showResult();
    }
});

restartButton.addEventListener("click", () => {
    currentQuestion = 0;
    score = 0;
    resultElement.style.display = "none";
    nextButton.style.display = "block";
    restartButton.style.display = "none";
    loadQuestion();
});

// Fetch and load questions on page load
fetchQuestions();