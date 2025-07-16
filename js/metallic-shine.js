// Shine Effect - Mouse Tracking
document.addEventListener('DOMContentLoaded', function() {
    // Check if this is the first visit
    const isFirstVisit = !localStorage.getItem('b2s_visited');
    
    // Set the visited flag for future visits
    if (isFirstVisit) {
        localStorage.setItem('b2s_visited', 'true');
    }
    // Variables to track current position and target position
    let latestEpisodesCurrentX = 50;
    let latestEpisodesCurrentY = 50;
    let latestEpisodesTargetX = 50;
    let latestEpisodesTargetY = 50;
    
    // Apply shine effect to Latest Episodes section
    const latestEpisodesSection = document.querySelector('.latest-episodes');
    if (latestEpisodesSection) {
        latestEpisodesSection.classList.add('metallic-card', 'metallic-section');
        
        latestEpisodesSection.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            latestEpisodesTargetX = ((e.clientX - rect.left) / rect.width) * 100;
            latestEpisodesTargetY = ((e.clientY - rect.top) / rect.height) * 100;
        });
        
        latestEpisodesSection.addEventListener('mouseleave', function() {
            latestEpisodesSection.style.setProperty('--x', '50%');
            latestEpisodesSection.style.setProperty('--y', '50%');
        });
    }
    
    // Track current positions for each episode tile
    const episodeTiles = document.querySelectorAll('.episode-tile');
    const tilePositions = [];
    
    episodeTiles.forEach((tile, index) => {
        tile.classList.add('metallic-card');
        
        // Initialize position tracking for each tile
        tilePositions[index] = {
            currentX: 50,
            currentY: 50,
            targetX: 50,
            targetY: 50
        };
        
        tile.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            tilePositions[index].targetX = ((e.clientX - rect.left) / rect.width) * 100;
            tilePositions[index].targetY = ((e.clientY - rect.top) / rect.height) * 100;
        });
        
        tile.addEventListener('mouseleave', function() {
            tile.style.setProperty('--x', '50%');
            tile.style.setProperty('--y', '50%');
        });
    });
    
    // Animation loop for smooth movement
    function animateShine() {
        // Slow easing factor - lower = slower movement (0.05 is quite slow)
        const easingFactor = 0.03;
        
        // Update Latest Episodes section
        if (latestEpisodesSection) {
            latestEpisodesCurrentX += (latestEpisodesTargetX - latestEpisodesCurrentX) * easingFactor;
            latestEpisodesCurrentY += (latestEpisodesTargetY - latestEpisodesCurrentY) * easingFactor;
            
            latestEpisodesSection.style.setProperty('--x', `${latestEpisodesCurrentX}%`);
            latestEpisodesSection.style.setProperty('--y', `${latestEpisodesCurrentY}%`);
        }
        
        // Update each episode tile
        episodeTiles.forEach((tile, index) => {
            tilePositions[index].currentX += (tilePositions[index].targetX - tilePositions[index].currentX) * easingFactor;
            tilePositions[index].currentY += (tilePositions[index].targetY - tilePositions[index].currentY) * easingFactor;
            
            tile.style.setProperty('--x', `${tilePositions[index].currentX}%`);
            tile.style.setProperty('--y', `${tilePositions[index].currentY}%`);
        });
        
        requestAnimationFrame(animateShine);
    }
    
    // Only start the automatic gradient animation on first visit
    // Otherwise, only activate on hover/mouse interaction
    if (isFirstVisit) {
        // Start the animation loop for first-time visitors
        animateShine();
        
        // Add initial animation class to sections
        if (latestEpisodesSection) {
            latestEpisodesSection.classList.add('first-visit-animation');
        }
        
        episodeTiles.forEach(tile => {
            tile.classList.add('first-visit-animation');
        });
    } else {
        // For returning visitors, only animate on hover/mouse interaction
        // We still need the animation function for mouse tracking
        animateShine();
        
        // But we don't add the automatic animation class
    }
});
