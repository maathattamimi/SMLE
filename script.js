document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    const questions = document.querySelectorAll('.question');
    const submitButton = document.getElementById('submit-exam');
    const progressBar = document.querySelector('.progress-bar');
    
    // Fix question numbering and add show answer button
    questions.forEach((question, index) => {
        const questionNumber = index + 1;
        const questionText = question.querySelector('p');
        questionText.textContent = questionText.textContent.replace(/^\d+\./, `${questionNumber}.`);
        
        // Add question counter
        const counter = document.createElement('div');
        counter.className = 'question-counter';
        counter.textContent = `Question ${questionNumber} of ${questions.length}`;
        question.insertBefore(counter, question.firstChild);

        // Add show answer button
        const showAnswerBtn = document.createElement('button');
        showAnswerBtn.className = 'show-answer-btn';
        showAnswerBtn.textContent = 'Show Answer';
        showAnswerBtn.onclick = function() {
            const correctAnswer = question.querySelector('[data-correct="true"]');
            correctAnswer.classList.add('highlight-correct');
            showAnswerBtn.disabled = true;
            showAnswerBtn.textContent = 'Answer Shown';
        };
        question.appendChild(showAnswerBtn);
    });

    // Search functionality
    const searchBox = document.createElement('input');
    searchBox.type = 'text';
    searchBox.className = 'search-box';
    searchBox.placeholder = 'Search questions...';
    document.querySelector('.exam-controls').appendChild(searchBox);

    searchBox.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        questions.forEach(question => {
            const text = question.textContent.toLowerCase();
            question.style.display = text.includes(searchTerm) ? 'block' : 'none';
        });
    });

    // Scroll to Top Button
    const scrollButton = document.createElement('div');
    scrollButton.className = 'scroll-top';
    scrollButton.innerHTML = '↑';
    document.body.appendChild(scrollButton);

    window.addEventListener('scroll', function() {
        scrollButton.classList.toggle('visible', window.scrollY > 500);
    });

    scrollButton.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Handle option selection with improved functionality
    document.querySelectorAll('.options li').forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            const questionOptions = this.closest('.options').querySelectorAll('li');
            questionOptions.forEach(opt => {
                opt.classList.remove('selected');
                opt.setAttribute('aria-selected', 'false');
            });
            this.classList.add('selected');
            this.setAttribute('aria-selected', 'true');
            updateProgress();
        });

        // Keyboard navigation
        option.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Update progress bar
    function updateProgress() {
        const totalQuestions = questions.length;
        const answeredQuestions = document.querySelectorAll('.options li.selected').length;
        const progress = (answeredQuestions / totalQuestions) * 100;
        
        progressBar.style.width = `${progress}%`;
        progressBar.setAttribute('aria-valuenow', progress);

        // Update progress info
        document.querySelector('.progress-info').textContent = 
            `Progress: ${answeredQuestions}/${totalQuestions} questions answered (${progress.toFixed(1)}%)`;
    }

    // Handle exam submission
    if (submitButton) {
        submitButton.addEventListener('click', function() {
            const selectedAnswers = document.querySelectorAll('.options li.selected');
            
            if (selectedAnswers.length < questions.length) {
                const remaining = questions.length - selectedAnswers.length;
                alert(`Please answer all questions. ${remaining} question(s) remaining.`);
                return;
            }

            // Calculate score
            let correctAnswers = 0;
            selectedAnswers.forEach(answer => {
                if (answer.getAttribute('data-correct') === 'true') {
                    correctAnswers++;
                }
                // Show correct/incorrect answers
                answer.closest('.options').querySelectorAll('li').forEach(option => {
                    option.classList.add('show-answer');
                });
            });

            const score = (correctAnswers / questions.length) * 100;
            
            // Show detailed results
            const results = `
                Final Score: ${score.toFixed(2)}%
                Correct Answers: ${correctAnswers}
                Total Questions: ${questions.length}
                Percentage: ${score.toFixed(2)}%
            `;
            
            alert(results);
            
            // Disable all options after submission
            document.querySelectorAll('.options li').forEach(option => {
                option.style.pointerEvents = 'none';
            });
            submitButton.disabled = true;
        });
    }

    // Initialize progress
    updateProgress();
});
