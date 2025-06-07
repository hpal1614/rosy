document.addEventListener('DOMContentLoaded', function() {
    try {
        // Navigation functionality
        const navLinks = document.querySelectorAll('.nav-link');
        const pages = document.querySelectorAll('.page');
        const mobileToggle = document.getElementById('mobileToggle');
        const navMenu = document.getElementById('navMenu');
        const navbar = document.getElementById('navbar');
        const logo = document.querySelector('.logo');

        // Check if required elements exist
        if (!mobileToggle || !navMenu || !navbar) {
            console.warn('Some navigation elements not found');
            return;
        }

        // Logo click handler - go to home page
        if (logo) {
            logo.addEventListener('click', function(e) {
                e.preventDefault();
                showPage('home');
            });
        }

        // Mobile menu toggle - Fixed
        mobileToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            
            // Animate hamburger
            const spans = mobileToggle.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const spans = mobileToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Page navigation
        function showPage(pageId) {
            // Hide all pages
            pages.forEach(page => {
                page.classList.remove('active');
            });
            
            // Remove active from all nav links
            navLinks.forEach(link => {
                link.classList.remove('active');
            });

            // Show target page
            const targetPage = document.getElementById(pageId);
            const targetNavLink = document.querySelector(`[data-page="${pageId}"]`);
            
            if (targetPage) {
                targetPage.classList.add('active');
            }
            
            if (targetNavLink && targetNavLink.classList.contains('nav-link')) {
                targetNavLink.classList.add('active');
            }

            // Close mobile menu
            navMenu.classList.remove('active');
            const spans = mobileToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';

            // Scroll to top smoothly
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Trigger welcome content animation if on home page
            if (pageId === 'home') {
                setTimeout(() => {
                    const welcomeContent = document.querySelector('.welcome-content');
                    if (welcomeContent) {
                        welcomeContent.classList.add('animated');
                    }
                }, 500);
            }
        }

        // Add click event listeners to navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const pageId = this.getAttribute('data-page');
                if (pageId) {
                    showPage(pageId);
                }
            });
        });

        // Add click event listeners to buttons with data-page attribute
        document.querySelectorAll('[data-page]').forEach(button => {
            button.addEventListener('click', function(e) {
                const pageId = this.getAttribute('data-page');
                if (pageId && (this.tagName === 'A' || this.tagName === 'BUTTON')) {
                    e.preventDefault();
                    showPage(pageId);
                }
            });
        });

        // Navbar scroll effect
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Welcome section animation on scroll
        const welcomeObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '0px 0px -100px 0px'
        });

        const welcomeContent = document.querySelector('.welcome-content');
        if (welcomeContent) {
            welcomeObserver.observe(welcomeContent);
        }

        // FAQ functionality
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', function() {
                    const isActive = item.classList.contains('active');
                    
                    // Close all FAQ items
                    faqItems.forEach(faqItem => {
                        faqItem.classList.remove('active');
                    });
                    
                    // Open clicked item if it wasn't active
                    if (!isActive) {
                        item.classList.add('active');
                    }
                });
            }
        });

        // Contact Form with Email Sending
        const contactForm = document.getElementById('contactForm');
        const successMessage = document.getElementById('successMessage');

        if (contactForm && successMessage) {
            // Email validation function
            function isValidEmail(email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
            }

            // Form validation function
            function validateForm() {
                let isValid = true;
                const formGroups = contactForm.querySelectorAll('.form-group');

                // Reset all error states
                formGroups.forEach(group => {
                    group.classList.remove('error');
                });

                // Validate name
                const name = document.getElementById('name');
                if (name && name.value.trim().length < 2) {
                    name.closest('.form-group').classList.add('error');
                    isValid = false;
                }

                // Validate email
                const email = document.getElementById('email');
                if (email && !isValidEmail(email.value.trim())) {
                    email.closest('.form-group').classList.add('error');
                    isValid = false;
                }

                // Validate subject
                const subject = document.getElementById('subject');
                if (subject && subject.value.trim().length < 3) {
                    subject.closest('.form-group').classList.add('error');
                    isValid = false;
                }

                // Validate message
                const message = document.getElementById('message');
                if (message && message.value.trim().length < 10) {
                    message.closest('.form-group').classList.add('error');
                    isValid = false;
                }

                return isValid;
            }

            // Email sending function using EmailJS
            function sendEmail(formData) {
                const templateParams = {
                    from_name: formData.get('name'),
                    from_email: formData.get('email'),
                    subject: formData.get('subject'),
                    message: formData.get('message'),
                    to_email: 'h.pal1614@gmail.com'
                };

                // Send main email to you
                return emailjs.send('gmail_service', 'contact_form', templateParams)
                    .then(function() {
                        // Send auto-reply to user
                        return emailjs.send('gmail_service', 'auto_reply', templateParams);
                    });
            }

            // Real-time validation
            const formInputs = contactForm.querySelectorAll('input, textarea');
            formInputs.forEach(input => {
                // Validate on blur
                input.addEventListener('blur', function() {
                    const group = this.closest('.form-group');
                    if (group) {
                        group.classList.remove('error');

                        if (this.type === 'email' && this.value.trim() && !isValidEmail(this.value.trim())) {
                            group.classList.add('error');
                        } else if (this.hasAttribute('required') && !this.value.trim()) {
                            group.classList.add('error');
                        } else if (this.id === 'message' && this.value.trim().length > 0 && this.value.trim().length < 10) {
                            group.classList.add('error');
                        }
                    }
                });

                // Remove error on valid input
                input.addEventListener('input', function() {
                    const group = this.closest('.form-group');
                    if (group && group.classList.contains('error')) {
                        if (this.type === 'email' && isValidEmail(this.value.trim())) {
                            group.classList.remove('error');
                        } else if (this.id === 'message' && this.value.trim().length >= 10) {
                            group.classList.remove('error');
                        } else if (this.id !== 'email' && this.id !== 'message' && this.value.trim().length > 0) {
                            group.classList.remove('error');
                        }
                    }
                });
            });

            // Form submission
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();

                if (validateForm()) {
                    const formData = new FormData(contactForm);
                    
                    // Send email
                    sendEmail(formData).then(() => {
                        // Show success message
                        successMessage.style.display = 'block';
                        contactForm.reset();
                        
                        // Hide success message after 5 seconds
                        setTimeout(() => {
                            successMessage.style.display = 'none';
                        }, 5000);

                        // Scroll to success message
                        successMessage.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'center' 
                        });
                    }).catch(error => {
                        console.error('Email sending failed:', error);
                        alert('Failed to send message. Please try again.');
                    });
                }
            });
        } else {
            console.warn('Contact form elements not found');
        }

        // Newsletter form submission
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const emailInput = this.querySelector('input[type="email"]');
                if (emailInput && emailInput.value.trim()) {
                    alert('Thank you for subscribing! You will receive our latest insights and tips.');
                    emailInput.value = '';
                }
            });
        }

        // Smooth scroll for internal links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Skip if href is just '#' or invalid
                if (href === '#' || href.length <= 1) {
                    e.preventDefault();
                    return;
                }
                
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Add subtle animations on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.service-card, .testimonial, .event, .blog-post, .featured-service, .event-preview, .testimonial-preview').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });

        // Add click feedback to buttons
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', function() {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        });

        // Enhanced Parallax Effect
        function initParallax() {
            const parallaxElements = document.querySelectorAll('.parallax-bg, .parallax-bg-welcome, .parallax-bg-2, .parallax-bg-3');
            
            if (parallaxElements.length === 0) return;
            
            function updateParallax() {
                const scrolled = window.pageYOffset;
                const windowHeight = window.innerHeight;
                
                parallaxElements.forEach((element) => {
                    try {
                        const section = element.closest('section');
                        if (!section) return;
                        
                        const elementTop = section.offsetTop;
                        const elementHeight = section.offsetHeight;
                        const elementBottom = elementTop + elementHeight;
                        
                        // Only apply parallax when element is in viewport
                        if (scrolled + windowHeight > elementTop && scrolled < elementBottom) {
                            let speed = 0;
                            
                            if (element.classList.contains('parallax-bg')) {
                                speed = (scrolled - elementTop) * -0.5;
                            } else if (element.classList.contains('parallax-bg-welcome')) {
                                speed = (scrolled - elementTop) * -0.3; // Reduced speed for better visibility
                            } else if (element.classList.contains('parallax-bg-2')) {
                                speed = (scrolled - elementTop) * -0.4;
                            } else if (element.classList.contains('parallax-bg-3')) {
                                speed = (scrolled - elementTop) * -0.3;
                            }
                            
                            element.style.transform = `translateY(${speed}px)`;
                        }
                    } catch (error) {
                        console.warn('Parallax error for element:', element, error);
                    }
                });
            }

            // Throttle scroll events for better performance
            let ticking = false;
            function requestTick() {
                if (!ticking) {
                    requestAnimationFrame(updateParallax);
                    ticking = true;
                    setTimeout(() => { ticking = false; }, 8);
                }
            }

            window.addEventListener('scroll', requestTick);
            updateParallax();
        }

        // Initialize parallax effect (only on desktop)
        if (window.innerWidth > 768) {
            initParallax();
        }

        // Re-initialize on window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                initParallax();
                initStackingCards();
            } else {
                // Reset stacking cards on mobile
                const featureCards = document.querySelectorAll('.feature.card');
                featureCards.forEach(card => {
                    card.classList.remove('active', 'inactive', 'stacked');
                });
            }
        });

        // Scroll indicator click handler - Fixed
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', function() {
                const welcomeSection = document.querySelector('.welcome-section');
                if (welcomeSection) {
                    const offsetTop = welcomeSection.offsetTop - 80; // Account for navbar
                    window.scrollTo({ 
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        }

        // Parallax hover effects
        document.querySelectorAll('.featured-service').forEach(service => {
            service.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            service.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        });

        // Add hover effects to service cards
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        });

        // Add hover effects to event cards
        document.querySelectorAll('.event').forEach(event => {
            event.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px) scale(1.02)';
            });
            
            event.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        });

        // Stacking Cards Effect for Welcome Features
        function initStackingCards() {
            const featureCards = document.querySelectorAll('.feature.card');
            
            if (featureCards.length === 0) return;

            function updateStackingCards() {
                const scrollTop = window.pageYOffset + 150;
                let currentCard = null;

                featureCards.forEach(card => {
                    const cardTop = card.offsetTop;
                    if (scrollTop >= cardTop) {
                        currentCard = card;
                    }
                });

                if (currentCard) {
                    // Remove all classes first
                    featureCards.forEach(card => {
                        card.classList.remove('active', 'inactive', 'stacked');
                    });

                    // Add active class to current card
                    currentCard.classList.add('active');

                    // Add inactive class to previous cards
                    let foundCurrent = false;
                    featureCards.forEach(card => {
                        if (card === currentCard) {
                            foundCurrent = true;
                        } else if (foundCurrent) {
                            // Cards after current (not yet reached)
                            card.classList.remove('stacked');
                        } else {
                            // Cards before current (already passed)
                            card.classList.add('inactive', 'stacked');
                        }
                    });
                } else {
                    // If none are reached yet — reset all
                    featureCards.forEach(card => {
                        card.classList.remove('active', 'inactive', 'stacked');
                    });
                }
            }

            // Throttle the stacking cards update
            let stackingTicking = false;
            function requestStackingTick() {
                if (!stackingTicking) {
                    requestAnimationFrame(updateStackingCards);
                    stackingTicking = true;
                    setTimeout(() => { stackingTicking = false; }, 16);
                }
            }

            window.addEventListener('scroll', requestStackingTick);
            updateStackingCards(); // Initial call
        }

        // Initialize stacking cards effect
        if (window.innerWidth > 768) {
            initStackingCards();
        }

        // Initialize welcome content animation on page load if home is active
        const homePage = document.getElementById('home');
        if (homePage && homePage.classList.contains('active')) {
            setTimeout(() => {
                const welcomeContent = document.querySelector('.welcome-content');
                if (welcomeContent) {
                    welcomeContent.classList.add('animated');
                }
            }, 1000);
        }

        // Add loading animation for stats
        const statsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statNumbers = entry.target.querySelectorAll('.stat h3');
                    statNumbers.forEach(stat => {
                        const finalNumber = stat.textContent;
                        stat.textContent = '0';
                        
                        // Animate number counting
                        const numberValue = parseInt(finalNumber.replace(/\D/g, ''));
                        const suffix = finalNumber.replace(/\d/g, '');
                        let currentNumber = 0;
                        const increment = numberValue / 50;
                        
                        const timer = setInterval(() => {
                            currentNumber += increment;
                            if (currentNumber >= numberValue) {
                                stat.textContent = finalNumber;
                                clearInterval(timer);
                            } else {
                                stat.textContent = Math.floor(currentNumber) + suffix;
                            }
                        }, 50);
                    });
                }
            });
        }, {
            threshold: 0.5
        });

        const statsSection = document.querySelector('.stats');
        if (statsSection) {
            statsObserver.observe(statsSection);
        }

    } catch (error) {
        console.error('Error initializing application:', error);
    }
});