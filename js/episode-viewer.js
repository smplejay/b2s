/**
 * Episode Viewer Script
 * Loads and displays a specific episode based on URL parameters
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get the episode ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const episodeId = urlParams.get('id');
    
    if (!episodeId) {
        showError('No episode ID specified. Please select an episode from the episodes page.');
        return;
    }
    
    // Fetch the episodes data
    fetch('data/episodes.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Get the episodes array from the data object
            const episodes = data.episodes;
            
            // Find the episode with the matching ID
            const episode = episodes.find(ep => ep.id === parseInt(episodeId) || ep.id === episodeId);
            
            if (!episode) {
                throw new Error(`Episode with ID ${episodeId} not found`);
            }
            
            // Display the episode
            displayEpisode(episode);
            
            // Update page title and SEO metadata
            document.title = `${episode.title} - Built 2 Scale Podcast`;
            
            // Update meta description
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.setAttribute('content', episode.description ? episode.description.substring(0, 160).replace(/<[^>]*>/g, '') : 'Listen to the Built 2 Scale Podcast episode: ' + episode.title);
            }
            
            // Update Open Graph meta tags
            const ogTitle = document.querySelector('meta[property="og:title"]');
            const ogDescription = document.querySelector('meta[property="og:description"]');
            const ogUrl = document.querySelector('meta[property="og:url"]');
            const ogImage = document.querySelector('meta[property="og:image"]');
            
            if (ogTitle) ogTitle.setAttribute('content', `${episode.title} - Built 2 Scale Podcast`);
            if (ogDescription) ogDescription.setAttribute('content', episode.description ? episode.description.substring(0, 160).replace(/<[^>]*>/g, '') : 'Listen to the Built 2 Scale Podcast episode: ' + episode.title);
            if (ogUrl) ogUrl.setAttribute('content', `https://b2spod.com/episode.html?id=${episodeId}`);
            if (ogImage && episode.thumbnail) ogImage.setAttribute('content', episode.thumbnail);
        })
        .catch(error => {
            console.error('Error loading episode:', error);
            showError(`Failed to load episode: ${error.message}`);
        });
});

/**
 * Displays the episode content
 * @param {Object} episode - The episode data object
 */
function displayEpisode(episode) {
    const container = document.getElementById('episode-container');
    
    // Format the date
    const date = new Date(episode.date);
    const formattedDate = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    // Create the episode HTML
    const episodeHTML = `
        <div class="episode-hero animate-fade-in-up opacity-0 translate-y-8">
            ${episode.videoUrl ? 
                `<iframe src="${episode.videoUrl}" title="${episode.title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>` : 
                `<img src="${episode.image}" alt="${episode.title}" style="width: 100%; height: 100%; object-fit: cover; position: absolute;">`
            }
        </div>
        
        <div class="episode-content">
            <div class="episode-header animate-fade-in-up opacity-0 translate-y-8">
                <div class="episode-number" style="text-align: left;">EP ${episode.id}</div>
                <h1 style="text-align: left;">${episode.title}</h1>
                <div class="episode-meta" style="justify-content: flex-start;">
                    <div class="episode-date"><i class="far fa-calendar-alt"></i> ${formattedDate}</div>
                    ${episode.featured ? '<div class="episode-hero-overlay">Featured Episode</div>' : ''}
                </div>
            </div>
            
            <div class="episode-description animate-fade-in-up opacity-0 translate-y-8" style="animation-delay: 0.2s;">
                ${episode.description ? episode.description : '<p>No description available for this episode.</p>'}
            </div>
            
            ${episode.resources && episode.resources.length > 0 ? `
                <div class="episode-links animate-fade-in-up opacity-0 translate-y-8" style="animation-delay: 0.4s;">
                    <h3>Resources Mentioned in This Episode:</h3>
                    <ul>
                        ${episode.resources.map(resource => `
                            <li><a href="${resource.url}" target="_blank">${resource.title}</a></li>
                        `).join('')}
                    </ul>
                </div>
            ` : ''}
            
            <a href="episodes.html" class="back-button">← Back to All Episodes</a>
        </div>
    `;
    
    // Replace the loading indicator with the episode content
    container.innerHTML = episodeHTML;
    
    // Trigger animations
    setTimeout(() => {
        const elements = document.querySelectorAll('.opacity-0');
        elements.forEach(el => {
            el.classList.remove('opacity-0');
            el.classList.remove('translate-y-8');
        });
    }, 100);
}

/**
 * Shows an error message
 * @param {string} message - The error message to display
 */
function showError(message) {
    const container = document.getElementById('episode-container');
    container.innerHTML = `
        <div class="episode-content">
            <div class="error-container">
                <h2>Error</h2>
                <p>${message}</p>
                <a href="episodes.html" class="back-button">← Back to Episodes</a>
            </div>
        </div>
    `;
}
