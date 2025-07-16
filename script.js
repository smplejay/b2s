document.addEventListener('DOMContentLoaded', function() {
    // Set active navigation based on current page
    setActiveNavigation();
    
    // Handle subscribe form submission
    const subscribeForm = document.getElementById('subscribe-form');
    
    if (subscribeForm) {
        // Check if we're using a third-party service like Mailchimp
        const isThirdPartyForm = subscribeForm.getAttribute('action') && 
                               subscribeForm.getAttribute('action').includes('list-manage.com');
        
        if (isThirdPartyForm) {
            // For third-party forms, we'll let the form submit normally to their endpoint
            // But we can still provide some visual feedback
            subscribeForm.addEventListener('submit', function() {
                const emailInput = this.querySelector('input[name="EMAIL"]');
                if (emailInput && emailInput.value.trim()) {
                    // Store that they've subscribed in local storage
                    localStorage.setItem('b2s_subscribed', 'true');
                    
                    // You could show a custom message here if desired
                    // But since the form submits to a third-party, they'll handle the confirmation
                }
            });
        } else {
            // For custom form handling (if you switch back to a custom solution)
            subscribeForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const emailInput = this.querySelector('input[type="email"]');
                const email = emailInput.value.trim();
                
                if (email) {
                    // You would typically send this to your backend
                    fetch('https://api.yourdomain.com/subscribe', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email: email })
                    })
                    .then(response => response.json())
                    .then(data => {
                        alert('Thanks for subscribing! You will be notified of new episodes.');
                        emailInput.value = '';
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('Something went wrong. Please try again later.');
                    });
                }
            });
        }
    }
    
    // Handle "Listen Now" button clicks
    const listenNowButtons = document.querySelectorAll('.listen-now-btn');
    listenNowButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'listen.html';
        });
    });
    
    // Handle episode play buttons
    const playButtons = document.querySelectorAll('.play-button');
    playButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Stop the event from bubbling up to the parent link
            
            // Get the parent episode tile and its link
            const episodeTile = this.closest('.episode-tile');
            const episodeLink = episodeTile.querySelector('.episode-link');
            
            // Navigate to the episode page if a link exists
            if (episodeLink && episodeLink.href) {
                window.location.href = episodeLink.href;
            }
            
            // Visual feedback for the clicked button
            this.classList.add('playing');
            
            // Reset other buttons
            playButtons.forEach(otherButton => {
                if (otherButton !== this) {
                    otherButton.classList.remove('playing');
                }
            });
        });
    });
    
    // Handle clicks on the entire episode tile
    const episodeLinks = document.querySelectorAll('.episode-link');
    episodeLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Don't prevent default - allow the link to navigate naturally
            // The href attribute on the link will determine where to go
            // No need to do anything here as the link will work normally
        });
    });
});

// Function to set the active navigation item based on current page
function setActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Remove any existing active classes
    document.querySelectorAll('nav ul li a').forEach(link => {
        link.classList.remove('active');
        const underline = link.querySelector('.underline-animation');
        if (underline) {
            underline.classList.remove('active');
        }
    });
    
    // Set active class for current page
    const activeLink = document.querySelector(`nav ul li a[href="${currentPage}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
        const underline = activeLink.querySelector('.underline-animation');
        if (underline) {
            underline.classList.add('active');
        }
    }
}
