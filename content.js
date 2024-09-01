chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "fillAndSubmit") {
        fillAndSubmitQuestion(request.question);
    }
});

function fillAndSubmitQuestion(question) {
    console.log('Handling form filling for:', question);
    const currentURL = window.location.href;
   
    if (currentURL.includes('claude.ai')) {
        fillClaude(question);
    } else  if (currentURL.includes('chatgpt.com')) {
        fillChatGPT(question);
    } else {
        console.error('Unsupported website');
    }
}

function fillChatGPT(question) {
    console.log('Filling ChatGPT');
    const inputSelector = '#prompt-textarea';
    const inputField = document.querySelector(inputSelector);

    if (inputField) {
        inputField.value = question;
        inputField.dispatchEvent(new Event('input', { bubbles: true }));
        inputField.dispatchEvent(new Event('change', { bubbles: true }));
        const enterEvent = new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            key: 'Enter',
            keyCode: 13,
            which: 13
        });
        inputField.dispatchEvent(enterEvent);
    } else {
        console.error('ChatGPT input field not found');
    }
}

function fillClaude(question) {
    console.log('Filling Claude');
    const inputSelector = 'div[contenteditable="true"]';
    const inputField = document.querySelector(inputSelector);

    if (inputField) {
        inputField.focus();  // Focus on the input field

        // Clear existing content
        inputField.innerHTML = '';

        // Create a new paragraph element to insert
        const p = document.createElement('p');
        p.textContent = question;
        p.style.margin = '0'; // Optional: style adjustments

        // Append the paragraph
        inputField.appendChild(p);

        // Ensure the input field recognizes the new content
        inputField.dispatchEvent(new Event('input', { bubbles: true }));
        inputField.dispatchEvent(new Event('change', { bubbles: true }));

        // Simulate Enter key press
        const enterEvent = new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            key: 'Enter',
            keyCode: 13,
            which: 13
        });
        inputField.dispatchEvent(enterEvent);
    } else {
        console.error('Claude input field not found');
    }
}
