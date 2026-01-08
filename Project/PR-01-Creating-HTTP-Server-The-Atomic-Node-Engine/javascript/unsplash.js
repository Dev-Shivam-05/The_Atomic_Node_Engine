const accessKey = 'yvrsYHxC4L6ZGWNkn5tqX7UBMpKUxrAKFZwQPmOVm5c';

// ✅ Development-focused keywords for client project
const keywords = [
    'coding',
    'programming',
    'software development',
    'javascript',
    'web development',
    'frontend',
    'backend',
    'developer workspace',
    'technology',
    'UI design'
];

// ✅ Automatically loops through all image IDs and loads random images
function loadAllRandomImages() {
    keywords.forEach((keyword, index) => {
        const imgId = `randomImage${index + 1}`;
        const imgElement = document.getElementById(imgId);
        if (imgElement) {
            fetch(`https://api.unsplash.com/photos/random?query=${keyword}&client_id=${accessKey}`)
                .then(response => response.json())
                .then(data => {
                    imgElement.src = data.urls.regular;
                })
                .catch(error => console.error(`Error fetching ${keyword} image:`, error));
        }
    });
}

// ✅ Automatically load images when the page loads
window.addEventListener('load', loadAllRandomImages);

// ✅ Optional: Refresh all images with a button (if you add it in HTML)
const refreshBtn = document.getElementById('refreshBtn');
if (refreshBtn) {
    refreshBtn.addEventListener('click', loadAllRandomImages);
}