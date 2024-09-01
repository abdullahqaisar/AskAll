document.getElementById('askai').addEventListener('click', function() {
    console.log('click');

    const question = document.getElementById('question').value;
    const chatgpt = document.getElementById('chatgpt').checked;
    const claude = document.getElementById('claude').checked;

    checkThirdPartyCookies(function(allowed) {
        if (!allowed) {
            // Show error message or notification
            document.getElementById('status').textContent = 
                'Third-party cookies are blocked. Please enable them in your browser settings.';
            // Optionally provide a link to instructions
            document.getElementById('status').innerHTML += 
                ' <a href="https://support.google.com/chrome/answer/95647" target="_blank">Learn how to enable cookies</a>';
        } else {
            // Proceed with your existing logic
            chrome.runtime.sendMessage({
                action: "queryAIs", 
                question: question,
                ais: { chatgpt, claude }
            });
        }
    });
});

function checkThirdPartyCookies(callback) {
    console.log('ChatGPT');
    chrome.cookies.set({
        url: 'https://chatgpt.com/', // Use a third-party domain here
        name: 'testCookie',
        value: 'testValue',
        expirationDate: Math.floor(Date.now() / 1000) + 3600 // 1 hour
    }, function(cookie) {
        if (!cookie) {
            // Third-party cookies are blocked
            callback(false);
        } else {
            // Third-party cookies are allowed
            callback(true);

            // Optionally delete the test cookie
            chrome.cookies.remove({
                url: 'https://chatgpt.com/',
                name: 'testCookie'
            });
        }
    });
}
