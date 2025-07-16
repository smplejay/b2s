/**
 * Website Loader Script
 * Loads website content from JSON file and dynamically renders page content
 */

class WebsiteLoader {
  constructor() {
    this.websiteData = null;
    this.episodesData = null;
    this.currentPage = this.getCurrentPage();
    
    // Initialize the website
    this.init();
  }
  
  /**
   * Initialize the website loader
   */
  async init() {
    try {
      // Load website data
      await this.loadWebsiteData();
      
      // Load episodes data if needed
      if (this.needsEpisodesData()) {
        await this.loadEpisodesData();
      }
      
      // Render the page content
      this.renderPage();
      
      // Initialize animations
      this.initAnimations();
    } catch (error) {
      console.error('Error initializing website:', error);
    }
  }
  
  /**
   * Determine if the current page needs episodes data
   * @returns {boolean} - Whether episodes data is needed
   */
  needsEpisodesData() {
    return ['index', 'episodes', 'episode'].includes(this.currentPage);
  }
  
  /**
   * Get the current page name from the URL
   * @returns {string} - Current page name
   */
  getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop();
    
    if (!filename || filename === '' || filename === '/') {
      return 'index';
    }
    
    return filename.replace('.html', '');
  }
  
  /**
   * Load website data from JSON file
   */
  async loadWebsiteData() {
    try {
      const response = await fetch('data/website.json');
      if (!response.ok) {
        throw new Error('Failed to load website data');
      }
      this.websiteData = await response.json();
      console.log('Website data loaded successfully');
    } catch (error) {
      console.error('Error loading website data:', error);
      throw error;
    }
  }
  
  /**
   * Load episodes data from JSON file
   */
  async loadEpisodesData() {
    try {
      const response = await fetch('data/episodes.json');
      if (!response.ok) {
        throw new Error('Failed to load episodes data');
      }
      const data = await response.json();
      this.episodesData = data.episodes;
      console.log('Episodes data loaded successfully');
    } catch (error) {
      console.error('Error loading episodes data:', error);
      throw error;
    }
  }
  
  /**
   * Render the current page content
   */
  renderPage() {
    // Render global elements
    this.renderNavigation();
    this.renderFooter();
    
    // Render page-specific content
    switch (this.currentPage) {
      case 'index':
        this.renderHomePage();
        break;
      case 'about':
        this.renderAboutPage();
        break;
      case 'listen':
        this.renderListenPage();
        break;
      case 'episodes':
        this.renderEpisodesPage();
        break;
      case 'episode':
        // Episode page is handled by episode-viewer.js
        break;
      default:
        console.warn(`No renderer defined for page: ${this.currentPage}`);
    }
  }
  
  /**
   * Render the navigation menu
   */
  renderNavigation() {
    if (!this.websiteData || !this.websiteData.navigation) return;
    
    const navContainer = document.querySelector('nav ul');
    if (!navContainer) return;
    
    const navItems = this.websiteData.navigation.main;
    const ctaItem = this.websiteData.navigation.cta;
    
    // Clear existing navigation
    navContainer.innerHTML = '';
    
    // Add main navigation items
    navItems.forEach(item => {
      const isActive = this.isCurrentPage(item.url);
      const li = document.createElement('li');
      li.className = 'nav-item';
      li.innerHTML = `
        <a href="${item.url}" ${isActive ? 'class="active"' : ''}>
          ${item.text}
          <div class="underline-animation ${isActive ? 'active' : ''}"></div>
        </a>
      `;
      navContainer.appendChild(li);
    });
    
    // Add CTA button
    if (ctaItem) {
      const li = document.createElement('li');
      li.innerHTML = `<a href="${ctaItem.url}" class="listen-now-btn">${ctaItem.text}</a>`;
      navContainer.appendChild(li);
    }
  }
  
  /**
   * Check if the given URL corresponds to the current page
   * @param {string} url - URL to check
   * @returns {boolean} - Whether the URL matches the current page
   */
  isCurrentPage(url) {
    const currentFile = window.location.pathname.split('/').pop();
    return url === currentFile;
  }
  
  /**
   * Render the footer
   */
  renderFooter() {
    if (!this.websiteData || !this.websiteData.global) return;
    
    const footerContainer = document.querySelector('.copyright');
    if (!footerContainer) return;
    
    footerContainer.innerHTML = `<p>${this.websiteData.global.copyright}</p>`;
  }
  
  /**
   * Render the home page content
   */
  renderHomePage() {
    if (!this.websiteData || !this.websiteData.pages.home) return;
    
    const homeData = this.websiteData.pages.home;
    
    // Update page title and meta tags
    document.title = homeData.title;
    this.updateMetaTags(homeData);
    
    // Render hero section
    this.renderHomeHero(homeData.sections.hero);
    
    // Render latest episodes section
    if (this.episodesData) {
      this.renderLatestEpisodes(homeData.sections.latestEpisodes);
    }
    
    // Render listen on section
    this.renderListenOnSection(homeData.sections.listenOn);
    
    // Render subscribe section
    this.renderSubscribeSection(homeData.sections.subscribe);
  }
  
  /**
   * Render the home page hero section
   * @param {Object} heroData - Hero section data
   */
  renderHomeHero(heroData) {
    const heroTitle = document.getElementById('hero-title');
    if (heroTitle) {
      heroTitle.innerHTML = heroData.title;
    }
    
    const tagline = document.querySelector('.tagline');
    if (tagline) {
      tagline.textContent = heroData.tagline;
    }
    
    const ctaContainer = document.querySelector('.cta-buttons');
    if (ctaContainer && heroData.ctaButtons) {
      ctaContainer.innerHTML = '';
      
      heroData.ctaButtons.forEach(button => {
        const link = document.createElement('a');
        link.href = button.url;
        link.className = button.class;
        link.textContent = button.text;
        ctaContainer.appendChild(link);
      });
    }
  }
  
  /**
   * Render the latest episodes section
   * @param {Object} sectionData - Latest episodes section data
   */
  renderLatestEpisodes(sectionData) {
    const container = document.querySelector('.latest-episodes');
    if (!container) return;
    
    // Update section title
    const titleElement = container.querySelector('h2');
    if (titleElement) {
      titleElement.innerHTML = `<i class="fas ${sectionData.icon}" style="margin-right: 12px; color: #ff6b00;"></i>${sectionData.title}`;
    }
    
    // Get the episodes grid container
    const gridContainer = container.querySelector('.featured-episodes-grid');
    if (!gridContainer) return;
    
    // Clear loading indicator
    gridContainer.innerHTML = '';
    
    // Get episodes to display
    let episodesToShow = [...this.episodesData];
    
    // Filter featured episodes if needed
    if (sectionData.showFeatured) {
      const featuredEpisodes = episodesToShow.filter(ep => ep.featured);
      if (featuredEpisodes.length > 0) {
        episodesToShow = featuredEpisodes;
      }
    }
    
    // Limit to max episodes
    episodesToShow = episodesToShow.slice(0, sectionData.maxEpisodes || 4);
    
    // Create HTML for each episode
    episodesToShow.forEach((episode, index) => {
      const episodeElement = this.createEpisodeTile(episode, index);
      gridContainer.appendChild(episodeElement);
    });
  }
  
  /**
   * Render the listen on section
   * @param {Object} sectionData - Listen on section data
   */
  renderListenOnSection(sectionData) {
    const container = document.querySelector('.platform-social-links');
    if (!container) return;
    
    // Clear existing content
    container.innerHTML = '';
    
    // Add platform links
    sectionData.platforms.forEach(platform => {
      const platformDiv = document.createElement('div');
      platformDiv.className = `platform-link-container ${platform.class}`;
      
      platformDiv.innerHTML = `
        <a href="${platform.url}" class="platform-social-link large" target="_blank">
          <i class="fab ${platform.icon}"></i>
        </a>
        <span class="platform-name">${platform.name}</span>
      `;
      
      container.appendChild(platformDiv);
    });
  }
  
  /**
   * Render the subscribe section
   * @param {Object} sectionData - Subscribe section data
   */
  renderSubscribeSection(sectionData) {
    const container = document.querySelector('.contact-section');
    if (!container) return;
    
    // Update section title
    const titleElement = container.querySelector('h2');
    if (titleElement) {
      titleElement.innerHTML = `<i class="fas ${sectionData.icon}" style="margin-right: 12px; color: #ff6b00; font-size: 2rem;"></i>${sectionData.title}`;
    }
    
    // Update description
    const descriptionElement = container.querySelector('p');
    if (descriptionElement) {
      descriptionElement.textContent = sectionData.description;
    }
    
    // Update form action
    const formElement = container.querySelector('form');
    if (formElement) {
      formElement.action = sectionData.formAction;
    }
    
    // Update button text
    const buttonElement = container.querySelector('button');
    if (buttonElement) {
      buttonElement.textContent = sectionData.buttonText;
    }
  }
  
  /**
   * Render the about page content
   */
  renderAboutPage() {
    if (!this.websiteData || !this.websiteData.pages.about) return;
    
    const aboutData = this.websiteData.pages.about;
    
    // Update page title and meta tags
    document.title = aboutData.title;
    this.updateMetaTags(aboutData);
    
    // Render about page sections
    this.renderMissionSection(aboutData.sections.mission);
    this.renderHostsSection(aboutData.sections.hosts);
    this.renderTopicsSection(aboutData.sections.topics);
    this.renderSocialLinks(aboutData.sections.social);
  }
  
  /**
   * Render the mission section of the about page
   * @param {Object} missionData - Mission section data
   */
  renderMissionSection(missionData) {
    const missionContainer = document.getElementById('mission-content');
    if (!missionContainer) return;
    
    // Clear loading indicator
    missionContainer.innerHTML = '';
    
    // Add mission paragraphs
    missionData.paragraphs.forEach(paragraph => {
      const p = document.createElement('p');
      p.innerHTML = paragraph;
      missionContainer.appendChild(p);
    });
  }
  
  /**
   * Render the hosts section of the about page
   * @param {Object} hostsData - Hosts section data
   */
  renderHostsSection(hostsData) {
    const hostsContainer = document.getElementById('hosts-container');
    if (!hostsContainer) return;
    
    // Keep existing host profiles
    // We're not replacing the entire container content because it already has the host profiles
    // Just remove the loading indicator
    const loadingIndicator = hostsContainer.querySelector('.loading-container');
    if (loadingIndicator) {
      loadingIndicator.remove();
    }
  }
  
  /**
   * Render the topics section of the about page
   * @param {Object} topicsData - Topics section data
   */
  renderTopicsSection(topicsData) {
    const topicsGrid = document.getElementById('topics-grid');
    if (!topicsGrid) return;
    
    // Keep existing topic cards
    // We're not replacing the entire container content because it already has the topic cards
    // Just remove the loading indicator
    const loadingIndicator = topicsGrid.querySelector('.loading-container');
    if (loadingIndicator) {
      loadingIndicator.remove();
    }
  }
  
  /**
   * Render the social links section of the about page
   * @param {Object} socialData - Social section data
   */
  renderSocialLinks(socialData) {
    const socialLinksContainer = document.getElementById('social-links');
    if (!socialLinksContainer) return;
    
    // Keep existing social links
    // We're not replacing the entire container content because it already has the social links
    // Just remove the loading indicator
    const loadingIndicator = socialLinksContainer.querySelector('.loading-container');
    if (loadingIndicator) {
      loadingIndicator.remove();
    }
    
    // Update the social description if it exists
    if (socialData.description) {
      const socialDescription = document.querySelector('.social-description');
      if (socialDescription) {
        socialDescription.textContent = socialData.description;
      }
    }
  }
  
  /**
   * Render the listen page content
   */
  renderListenPage() {
    if (!this.websiteData || !this.websiteData.pages.listen) return;
    
    const listenData = this.websiteData.pages.listen;
    
    // Update page title and meta tags
    document.title = listenData.title;
    this.updateMetaTags(listenData);
    
    // Render the platforms section
    this.renderListenPlatforms(listenData.sections.platforms);
  }
  
  /**
   * Render the listen platforms section
   * @param {Object} platformsData - Platforms section data
   */
  renderListenPlatforms(platformsData) {
    const platformsContainer = document.getElementById('listen-platforms');
    if (!platformsContainer) return;
    
    // Clear loading indicator
    platformsContainer.innerHTML = '';
    
    // Add platform links
    platformsData.items.forEach(platform => {
      const platformDiv = document.createElement('div');
      platformDiv.className = `platform-link-container ${platform.class}`;
      
      // Add special positioning for Apple icon
    const iconStyle = platform.icon === 'fa-apple' ? 'style="position: relative; left: 1px;"' : '';
    
    platformDiv.innerHTML = `
      <a href="${platform.url}" class="platform-social-link large" target="_blank">
        <i class="fab ${platform.icon}" ${iconStyle}></i>
      </a>
      <span class="platform-name" style="text-align: center; display: block;">${platform.name}</span>
      <p class="platform-description">${platform.description}</p>
      <a href="${platform.url}" class="platform-button" target="_blank">${platform.buttonText}</a>
    `;
      
      platformsContainer.appendChild(platformDiv);
    });
  }
  
  /**
   * Render the episodes page content
   */
  renderEpisodesPage() {
    // Episodes page is already handled by episodes-loader.js
    // But we can update the page title and meta tags
    if (!this.websiteData) return;
    
    document.title = "Episodes - Built 2 Scale Podcast";
    this.updateMetaTags({
      description: "Browse all episodes of the Built 2 Scale podcast."
    });
  }
  
  /**
   * Update meta tags based on page data
   * @param {Object} pageData - Page data containing meta information
   */
  updateMetaTags(pageData) {
    if (!pageData) return;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && pageData.description) {
      metaDescription.setAttribute('content', pageData.description);
    }
    
    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords && pageData.keywords) {
      metaKeywords.setAttribute('content', pageData.keywords);
    }
    
    // Update Open Graph meta tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    
    if (ogTitle && pageData.title) {
      ogTitle.setAttribute('content', pageData.title);
    }
    
    if (ogDescription && pageData.description) {
      ogDescription.setAttribute('content', pageData.description);
    }
    
    // Update Twitter meta tags
    const twitterTitle = document.querySelector('meta[property="twitter:title"]');
    const twitterDescription = document.querySelector('meta[property="twitter:description"]');
    
    if (twitterTitle && pageData.title) {
      twitterTitle.setAttribute('content', pageData.title);
    }
    
    if (twitterDescription && pageData.description) {
      twitterDescription.setAttribute('content', pageData.description);
    }
  }
  
  /**
   * Create an episode tile element
   * @param {Object} episode - Episode data object
   * @param {number} index - Index for animation delay
   * @returns {HTMLElement} - Episode tile element
   */
  createEpisodeTile(episode, index) {
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
      <a href="${episode.url}" class="episode-link">
        <div class="episode-image">
          <img src="${episode.thumbnail}" alt="${episode.title} Thumbnail">
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
  
  /**
   * Initialize animations for page elements
   */
  initAnimations() {
    setTimeout(() => {
      const elements = document.querySelectorAll('.opacity-0');
      elements.forEach(el => {
        el.classList.remove('opacity-0');
        el.classList.remove('translate-y-8');
      });
    }, 100);
  }
}

// Initialize the website loader when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new WebsiteLoader();
});
