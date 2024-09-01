// background.js

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "queryAIs") {
        openAndQuery(request.question, request.ais);
    }
});

function openAndQuery(question, ais) {
    const urls = {
        chatgpt: 'https://chatgpt.com/',
        claude: 'https://claude.ai/'
    };
    
    // Function to find or create a tab for a given URL
    function findOrCreateTab(url, callback) {
        chrome.tabs.query({}, function(tabs) {
            // Check if a tab with the URL already exists
            let existingTab = tabs.find(tab => tab.url.startsWith(url));
            
            if (existingTab) {
                callback(existingTab);
            } else {
                // Create a new tab if none exists
                chrome.tabs.create({ url: url }, function(tab) {
                    callback(tab);
                });
            }
        });
    }

    // Function to create a tab group and move tabs into it
    function createTabGroup(tabs, groupName) {
        chrome.tabs.group({ tabIds: tabs.map(tab => tab.id) }, function(groupId) {
            chrome.tabGroups.update(groupId, { title: groupName });
        });
    }
    
    let tabsToGroup = [];

    if (ais.chatgpt) {
        findOrCreateTab(urls.chatgpt, function(tab) {
            tabsToGroup.push(tab);
            chrome.tabs.sendMessage(tab.id, { action: "fillAndSubmit", question: question });
        });
    }
    
    if (ais.claude) {
        findOrCreateTab(urls.claude, function(tab) {
            tabsToGroup.push(tab);
            chrome.tabs.sendMessage(tab.id, { action: "fillAndSubmit", question: question });
        });
    }

    // Create a tab group for the new tabs
    if (tabsToGroup.length > 0) {
        chrome.tabs.query({}, function(allTabs) {
            let groupTabs = allTabs.filter(tab => tabsToGroup.some(t => t.id === tab.id));
            createTabGroup(groupTabs, 'AI Tools');
        });
    }
}
