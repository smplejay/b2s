/**
 * Episodes Loader Script
 * Loads episodes data from JSON file and populates episode listings
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the index page (with latest episodes section)
    const latestEpisodesContainer = document.querySelector('.featured-episodes-grid');
    
    // Check if we're on the episodes page (with all episodes)
    const allEpisodesContainer = document.querySelector('.episodes-grid');
    
    // If neither container exists, exit early
    if (!latestEpisodesContainer && !allEpisodesContainer) return;
    
    // Fetch episodes data from JSON file
    fetch('data/episodes.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const episodes = data.episodes;
            
            // If on index page, display latest episodes
            if (latestEpisodesContainer) {
                displayLatestEpisodes(episodes, latestEpisodesContainer);
            }
            
            // If on episodes page, display all episodes
            if (allEpisodesContainer) {
                displayAllEpisodes(episodes, allEpisodesContainer);
            }
        })
        .catch(error => {
            console.error('Error fetching episodes:', error);
            // Display error message in containers
            if (latestEpisodesContainer) {
                latestEpisodesContainer.innerHTML = `<div class="error-message">Failed to load episodes. Please try again later.</div>`;
            }
            if (allEpisodesContainer) {
                allEpisodesContainer.innerHTML = `<div class="error-message">Failed to load episodes. Please try again later.</div>`;
            }
        });
});

/**
 * Displays the latest episodes in the specified container
 * @param {Array} episodes - Array of episode objects
 * @param {HTMLElement} container - Container element to populate
 */
function displayLatestEpisodes(episodes, container) {
    // Clear loading indicator
    container.innerHTML = '';
    
    // Get the 4 most recent episodes
    const latestEpisodes = episodes.slice(0, 4);
    
    // Create HTML for each episode
    latestEpisodes.forEach((episode, index) => {
        const episodeElement = createEpisodeTile(episode, index);
        container.appendChild(episodeElement);
    });
    
    // Trigger animations
    setTimeout(() => {
        const elements = container.querySelectorAll('.opacity-0');
        elements.forEach(el => {
            el.classList.remove('opacity-0');
            el.classList.remove('translate-y-8');
        });
    }, 100);
}

/**
 * Displays all episodes in the specified container
 * @param {Array} episodes - Array of episode objects
 * @param {HTMLElement} container - Container element to populate
 */
function displayAllEpisodes(episodes, container) {
    // Clear loading indicator
    container.innerHTML = '';
    
    // Create HTML for each episode
    episodes.forEach((episode, index) => {
        const episodeElement = createEpisodeTile(episode, index);
        container.appendChild(episodeElement);
    });
    
    // Trigger animations
    setTimeout(() => {
        const elements = container.querySelectorAll('.opacity-0');
        elements.forEach(el => {
            el.classList.remove('opacity-0');
            el.classList.remove('translate-y-8');
        });
    }, 100);
}

/**
 * Creates an episode tile element
 * @param {Object} episode - Episode data object
 * @param {number} index - Index for animation delay
 * @returns {HTMLElement} - Episode tile element
 */
function createEpisodeTile(episode, index) {
    const episodeDiv = document.createElement('div');
    episodeDiv.className = 'episode-tile animate-fade-in-up opacity-0 translate-y-8';
    episodeDiv.style.animationDelay = `${0.2 + (index * 0.1)}s`;
    
    // Format the date for display
    const date = new Date(episode.date);
    const formattedDate = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
    
    episodeDiv.innerHTML = `
        <a href="episode.html?id=${episode.id}" class="episode-link">
            <div class="episode-image">
                <img src="${episode.image}" alt="${episode.title} Thumbnail">
                ${episode.featured ? '<div class="episode-featured-badge">Featured</div>' : ''}
            </div>
            <div class="episode-info">
                <div class="episode-number">EP ${episode.id}</div>
                <h3 class="episode-title">${episode.title}</h3>
                <div class="episode-date-small">${formattedDate}</div>
                <div class="play-button"><i class="fas fa-play"></i></div>
            </div>
        </a>
    `;
    
    return episodeDiv;
}
