// Show Exam Page
document.getElementById('start-exam-btn').addEventListener('click', function() {
    document.getElementById('landing-page').classList.add('hidden');
    document.getElementById('exam-page').classList.remove('hidden');
});

// Question Navigation
let currentQuestion = 0;
const questions = document.querySelectorAll('.question');

function showQuestion(index) {
    questions.forEach((question, i) => {
        question.classList.toggle('active', i === index);
    });
}

function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion(currentQuestion);
    }
}

function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion(currentQuestion);
    }
}

// Initialize
showQuestion(currentQuestion);