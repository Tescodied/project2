// Navigation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});

// Chat functionality
function sendMessage() {
    const input = document.getElementById('chatInput');
    const messages = document.getElementById('chatMessages');
    const message = input.value.trim();

    if (message) {
        // Add user message
        const userMessage = document.createElement('div');
        userMessage.className = 'message user';
        userMessage.textContent = message;
        messages.appendChild(userMessage);

        // Clear input
        input.value = '';

        // Simulate AI response
        setTimeout(() => {
            const aiMessage = document.createElement('div');
            aiMessage.className = 'message ai';
            aiMessage.textContent = getAIResponse(message);
            messages.appendChild(aiMessage);

            // Scroll to bottom
            messages.scrollTop = messages.scrollHeight;
        }, 1000);

        // Scroll to bottom
        messages.scrollTop = messages.scrollHeight;
    }
}

function getAIResponse(userMessage) {
    const responses = [
        "That's a great question! Let me break it down for you step by step.",
        "I understand you're working on this topic. Here's how I'd approach it...",
        "Let me give you a hint to get you started on the right track.",
        "Good thinking! You're on the right path. Let's explore this further.",
        "I can see you're making progress. Would you like to try a similar problem?",
        "Excellent! You're getting the hang of it. Let's move to the next concept."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
}

// Enter key support for chat
document.getElementById('chatInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Assignment interactions
document.querySelectorAll('.start-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        const assignmentName = this.closest('.assignment-item').querySelector('h4').textContent;
        alert(`Starting: ${assignmentName}`);
    });
});

// Activity card interactions
document.querySelectorAll(".activity-card").forEach(button => {
    button.addEventListener("click", () => {
        button.classList.add("shake");

        button.addEventListener("animationend", () => {
            button.classList.remove("shake");
        }, { once: true });
    });
});

// Logout functionality
document.querySelector('.logout-btn').addEventListener('click', function () {
    if (confirm('Are you sure you want to logout?')) {
        alert('Logging out...');
        // In a real app, this would redirect to login page
    }
});

// Simulate real-time progress updates
setInterval(() => {
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
        const currentWidth = parseInt(bar.style.width);
        if (Math.random() < 0.1 && currentWidth < 100) { // 10% chance to increase
            bar.style.width = (currentWidth + 1) + '%';
            const progressText = bar.parentElement.nextElementSibling;
            const subject = bar.parentElement.previousElementSibling.textContent;
            progressText.textContent = `${currentWidth + 1}% Complete • ${getProgressLevel(currentWidth + 1)}`;
        }
    });
}, 5000);

function getProgressLevel(percentage) {
    if (percentage >= 90) return 'Excellent';
    if (percentage >= 75) return 'Strong';
    if (percentage >= 60) return 'Good';
    if (percentage >= 40) return 'Fair';
    return 'Needs Work';
}

// Auto-scroll chat to bottom on page load
window.addEventListener('load', function () {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Toggle minimise buttons
const ai_chat_minimise = document.getElementById("ai-chat-minimise");
const ai_section = document.getElementById("ai-section");

ai_chat_minimise.addEventListener("click", () => {
    if (ai_chat_minimise.value === "active") {
        ai_chat_minimise.value = "hidden";
        ai_section.style.display = "none";
    } else {
        ai_chat_minimise.value = "active";
        ai_section.style.display = "block";
    }
});

const activities_minimise = document.getElementById("activities-minimise");
const activities_section = document.getElementById("activities-section");

activities_minimise.addEventListener("click", () => {
    if (activities_minimise.value === "active") {
        activities_minimise.value = "hidden";
        activities_section.classList.toggle("hidden");;
    } else {
        activities_minimise.value = "active";
        activities_section.classList.toggle("hidden");;
    }
});


// Button click animation

document.querySelectorAll('.animatable').forEach(element => {
    element.style.cursor = 'pointer';

    element.addEventListener('click', (event) => {
        const target = event.currentTarget;

        // If element contains a hyperlink or is a hyperlink itself
        const link = target.tagName === 'A' ? target : target.querySelector('a');

        if (link) {
            event.preventDefault();  // stop immediate navigation

            // Add animation class
            target.classList.add('animate-press');

            // On animation end, navigate to the link
            target.addEventListener('animationend', () => {
                window.location.href = link.href;
            }, { once: true }); // run once to avoid duplicate navigation
        } else {
            // No link, just animate normally on click
            target.classList.add('animate-press');
            target.addEventListener('animationend', () => {
                target.classList.remove('animate-press');
            }, { once: true });
        }
    });
});