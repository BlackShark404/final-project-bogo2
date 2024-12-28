document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements
    const elements = {
        searchForm: document.querySelector('.search-bar form'),
        searchInput: document.querySelector('.search-bar input[type="text"]'),
        scrollTop: document.querySelector('.scroll-to-top'),
        navLinks: document.querySelectorAll('.navbar-nav .nav-link'),
        dropdowns: document.querySelectorAll('.nav-item.dropdown'),
        offcanvas: document.querySelector('.offcanvas'),
        offcanvasToggle: document.querySelector('[data-bs-toggle="offcanvas"]'),
        videoModal: document.getElementById('videoModal'),
        animatedText: document.getElementById('animated-text')
    };

    // Constants
    const BLOG_POSTS = [
        {
            title: "3rd Underwater Clean-up Drive to Protect Capitancillo Islet Marine Sanctuary Conducted",
            url: "post1.html"
        },
        {
            title: "City Continues Incentives for Seniors celebrating 80th and 90th Natal Day",
            url: "post2.html"
        },
        {
            title: "Livestock Raisers Forum Highlights Insurance, Biosecurity, and Feed Enhancers",
            url: "post3.html"
        },
        {
            title: "Bogo City Expands Livelihood Program for ReRe Graduates with Hydroponics Initiative",
            url: "post4.html"
        }
    ];

    // Search functionality
    class SearchHandler {
        constructor(form, input, posts) {
            this.form = form;
            this.input = input;
            this.posts = posts;
            this.resultsContainer = null;
            this.searchTimeout = null;
            this.init();
        }

        init() {
            if (!this.form) return;

            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.searchPosts();
            });

            this.input.addEventListener('input', () => {
                clearTimeout(this.searchTimeout);
                this.searchTimeout = setTimeout(() => this.searchPosts(), 300);
            });

            this.input.addEventListener('blur', () => {
                if (this.input.value.trim() === '') this.hideResults();
            });
        }

        hideResults() {
            this.resultsContainer?.remove();
            this.resultsContainer = null;
        }

        searchPosts() {
            const searchTerm = this.input.value.toLowerCase().trim();
            this.hideResults();
            if (!searchTerm) return;

            this.resultsContainer = document.createElement('div');
            this.resultsContainer.className = 'search-results';

            const matchingPosts = this.posts.filter(post => 
                post.title.toLowerCase().includes(searchTerm)
            );

            if (matchingPosts.length === 0) {
                this.resultsContainer.innerHTML = `<div class="no-results">No posts found matching "${searchTerm}"</div>`;
            } else {
                this.resultsContainer.innerHTML = matchingPosts
                    .map(post => `<div class="search-result-item"><a href="${post.url}">${post.title}</a></div>`)
                    .join('');
            }

            this.form.parentNode.appendChild(this.resultsContainer);
        }
    }

    // Scroll to top functionality
    class ScrollTopHandler {
        constructor(button) {
            this.button = button;
            if (!this.button) return;
            this.init();
        }

        init() {
            window.addEventListener('scroll', () => this.toggleVisibility());
            this.button.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        toggleVisibility() {
            this.button.classList.toggle('active', window.scrollY > 100);
        }
    }

    // Navigation handler
    class NavigationHandler {
        constructor(links, dropdowns) {
            this.links = links;
            this.dropdowns = dropdowns;
            this.init();
        }

        init() {
            this.setActiveLink();
            this.setupEventListeners();
            this.setupDropdownHover();
        }

        setActiveLink() {
            const currentPath = window.location.pathname;
            let hasActiveLink = false;

            this.links.forEach(link => {
                const href = link.getAttribute('href');
                const isActive = this.isLinkActive(currentPath, href);
                link.classList.toggle('active', isActive);
                if (isActive) hasActiveLink = true;
            });

            if (!hasActiveLink && this.isHomePage(currentPath)) {
                const homeLink = document.querySelector('.navbar-nav .nav-link[href="/"], .navbar-nav .nav-link[href="/index.html"], .navbar-nav .nav-link[href="index.html"]');
                homeLink?.classList.add('active');
            }
        }

        isLinkActive(currentPath, href) {
            return href === currentPath || 
                (currentPath === '/' && (href === '/' || href === '/index.html' || href === 'index.html')) ||
                (href !== '/' && href !== '/index.html' && currentPath.includes(href));
        }

        isHomePage(path) {
            return path === '/' || path === '/index.html' || path.includes('index.html');
        }

        setupEventListeners() {
            this.links.forEach(link => {
                link.addEventListener('click', (e) => {
                    if (!link.classList.contains('dropdown-toggle')) {
                        this.links.forEach(nav => nav.classList.remove('active'));
                        e.currentTarget.classList.add('active');
                    }
                });
            });

            document.querySelectorAll('.dropdown-item').forEach(item => {
                item.addEventListener('click', () => {
                    this.links.forEach(nav => nav.classList.remove('active'));
                    const dropdownToggle = item.closest('.dropdown')?.querySelector('.nav-link');
                    dropdownToggle?.classList.add('active');
                });
            });
        }

        setupDropdownHover() {
            this.dropdowns.forEach(dropdown => {
                ['mouseenter', 'mouseleave'].forEach(event => {
                    dropdown.addEventListener(event, () => {
                        if (window.innerWidth > 991) {
                            const menu = dropdown.querySelector('.dropdown-menu');
                            menu.style.display = event === 'mouseenter' ? 'block' : 'none';
                            menu.style.opacity = event === 'mouseenter' ? '1' : '0';
                        }
                    });
                });
            });
        }
    }

    // RandomTypewriter class optimization
    class RandomTypewriter {
        constructor(element, text, options = {}) {
            this.element = element;
            this.originalText = text;
            this.currentText = text[0]; // Start with first character
            this.isAdding = true;
            this.loopInterval = null;
            this.options = {
                minSpeed: options.minSpeed || 100,
                maxSpeed: options.maxSpeed || 150,
                chanceToReverse: options.chanceToReverse || 0.3,
                maxCharsPerStep: 1
            };
        }

        getRandomSpeed() {
            const range = this.options.maxSpeed - this.options.minSpeed;
            return this.options.minSpeed + Math.floor(Math.random() * range * 0.6 + range * 0.4);
        }

        typewriterEffect() {
            if (Math.random() < this.options.chanceToReverse && this.currentText.length > 1) {
                this.isAdding = !this.isAdding;
            }

            if (this.isAdding) {
                if (this.currentText.length < this.originalText.length) {
                    this.currentText += this.originalText.charAt(this.currentText.length);
                } else {
                    this.isAdding = false;
                }
            } else {
                if (this.currentText.length > 1) { // Only delete if more than one character
                    this.currentText = this.currentText.slice(0, -1);
                } else {
                    this.isAdding = true;
                }
            }

            this.element.textContent = this.currentText;
            this.loopInterval = setTimeout(() => this.typewriterEffect(), this.getRandomSpeed());
        }

        start() {
            this.typewriterEffect();
        }

        stop() {
            clearTimeout(this.loopInterval);
        }
    }

    // Initialize components
    const search = new SearchHandler(elements.searchForm, elements.searchInput, BLOG_POSTS);
    const scrollTop = new ScrollTopHandler(elements.scrollTop);
    const navigation = new NavigationHandler(elements.navLinks, elements.dropdowns);

    // Initialize typewriter if element exists
    if (elements.animatedText) {
        new RandomTypewriter(elements.animatedText, "City of Bogo", {
            minSpeed: 100,
            maxSpeed: 200,
            chanceToReverse: 0.1
        }).start();
    }

    // Offcanvas handling
    if (elements.offcanvas) {
        elements.offcanvas.addEventListener('show.bs.offcanvas', () => {
            elements.offcanvas.classList.add('glass-effect');
        });

        elements.offcanvas.addEventListener('hide.bs.offcanvas', () => {
            elements.offcanvas.classList.remove('glass-effect');
        });

        document.addEventListener('click', (e) => {
            if (!elements.offcanvas.contains(e.target) && 
                e.target !== elements.offcanvasToggle && 
                elements.offcanvas.classList.contains('show')) {
                bootstrap.Offcanvas.getInstance(elements.offcanvas).hide();
            }
        });
    }

    // Video modal handling
    elements.videoModal?.addEventListener('hidden.bs.modal', function() {
        const iframe = this.querySelector('iframe');
        iframe.src = iframe.src;
    });

    // AOS initialization
    window.addEventListener('load', () => {
        AOS?.init({
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
    });
});