// Tailwind configuration
tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                'inter': ['Inter', 'sans-serif'],
            },
            fontWeight: {
                thin: '100',
                extralight: '200',
                light: '300',
                normal: '400',
                medium: '500',
                semibold: '600',
                bold: '700'
            },
            animation: {
                'float': 'float 3s ease-in-out infinite',
                'fade-up': 'fadeUp 0.5s ease-out',
                'fade-down': 'fadeDown 0.5s ease-out',
                'bounce-slow': 'bounce 3s linear infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                fadeUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeDown: {
                    '0%': { opacity: '0', transform: 'translateY(-20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            }
        }
    }
};

// Global variables for state management
const selectedProblems = new Set();
let problemsContainer = null;
let revenueText = null;
let revenueSlider = null;

// Business problems and their growth impact
const businessProblems = [
    { id: 'losing-leads', text: 'Losing Leads', impact: 5, icon: '📉', description: '"I keep losing track of potential clients who showed interest but never heard back from me"', hoursSaved: 2 },
    { id: 'late-replies', text: 'Late Client Replies', impact: 3, icon: '⏰', description: '"It takes me days to get back to clients because I\'m juggling too many things"', hoursSaved: 1.5 },
    { id: 'adhoc-solving', text: 'Ad-hoc Problem Solving', impact: 3, icon: '🔧', description: '"I\'m constantly putting out fires and solving the same problems over and over"', hoursSaved: 3 },
    { id: 'no-followups', text: 'No Follow-ups', impact: 3, icon: '📞', description: '"I often forget to follow up with clients and miss out on jobs"', hoursSaved: 2 },
    { id: 'slow-proposals', text: 'Slow Proposals', impact: 3, icon: '📝', description: '"It takes me forever to write up quotes and proposals for new jobs"', hoursSaved: 3.5 },
    { id: 'no-insights', text: 'No Business Insights', impact: 3, icon: '📊', description: '"I have no clue which marketing channels actually bring in my best clients"', hoursSaved: 1 },
    { id: 'disorganized-planning', text: 'Disorganized Job Planning', impact: 3, icon: '📱', description: '"My job schedule is a mess and I often double-book or forget appointments"', hoursSaved: 2 },
    { id: 'forgetting-tasks', text: 'Forgetting Tasks', impact: 2, icon: '🗓️', description: '"Important tasks slip through the cracks because they\'re not written down anywhere"', hoursSaved: 1.5 }
];

// Check for mobile/desktop
const isMobile = () => window.matchMedia('(max-width: 767px)').matches;

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Initializing problems...');
    
    // Get container elements
    problemsContainer = document.getElementById('problemsContainer');
    revenueText = document.querySelector('.revenue-text');
    revenueSlider = document.getElementById('revenueSlider');
    
    if (!problemsContainer) {
        console.error('Problems container not found!');
        return;
    }

    if (!revenueText) {
        console.error('Revenue text element not found!');
    }

    if (!revenueSlider) {
        console.error('Revenue slider not found!');
    }

    console.log('Found problems container, creating pills...');

    function updateHoursSaved() {
        let totalHours = 0;
        selectedProblems.forEach(id => {
            const problem = businessProblems.find(p => p.id === id);
            if (problem && problem.hoursSaved) {
                totalHours += problem.hoursSaved;
            }
        });
        
        // Apply revenue-based multiplier
        const revenue = parseInt(revenueSlider.value);
        let multiplier = 1;
        
        if (revenue >= 400000) multiplier = 2.5;
        else if (revenue >= 300000) multiplier = 2;
        else if (revenue >= 200000) multiplier = 1.5;
        else if (revenue >= 100000) multiplier = 1.25;
        
        totalHours *= multiplier;
        
        console.log('Updating hours saved:', totalHours, 'Selected problems:', Array.from(selectedProblems), 'Multiplier:', multiplier);
        
        const hoursDisplay = document.getElementById('hoursDisplay');
        if (hoursDisplay) {
            hoursDisplay.innerHTML = totalHours > 0 
                ? `${totalHours.toFixed(1)}&nbsp;<span class="text-xs font-medium text-gray-400">hrs/week</span>`
                : `0&nbsp;<span class="text-xs font-medium text-gray-400">hrs/week</span>`;
        }

        const timeSaved = document.getElementById('timeSaved');
        if (timeSaved) {
            timeSaved.innerHTML = totalHours > 0 
                ? `${totalHours.toFixed(1)}&nbsp;<span class="text-xs font-medium text-gray-400">hrs/week</span>`
                : `0&nbsp;<span class="text-xs font-medium text-gray-400">hrs/week</span>`;
        }
    }

    function toggleProblem(id, pill) {
        console.log('Toggling problem:', id);
        
        if (selectedProblems.has(id)) {
            selectedProblems.delete(id);
            pill.classList.remove('border-green-400', 'border-2', 'bg-green-500/20', 'text-white');
            pill.classList.add('border-white/10');
        } else {
            selectedProblems.add(id);
            pill.classList.remove('border-white/10');
            pill.classList.add('border-green-400', 'border-2', 'bg-green-500/20', 'text-white');
        }
        
        // Update hours saved first
        updateHoursSaved();
        
        // Then update revenue calculations if slider exists
        if (revenueSlider) {
            updateCalculations();
        }
        
        console.log('Current selected problems:', Array.from(selectedProblems));
    }

    // Create and append problem pills
    businessProblems.forEach(problem => {
        const pill = document.createElement('button');
        pill.className = 'problem-pill flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-sm transition-all duration-300';
        pill.innerHTML = `
            <span>${problem.icon}</span>
            <span>${problem.text}</span>
            <span class="text-indigo-400">+${problem.impact}%</span>
            <button class="info-button ml-1 p-1 rounded-full bg-sky-400/30 hover:bg-sky-400/50 transition-colors md:hidden text-sky-300" aria-label="More info">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
            </button>
        `;

        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip fixed z-50 bg-gray-800 text-gray-300 p-4 rounded-lg shadow-lg text-center';
        tooltip.style.cssText = 'visibility: hidden; opacity: 0; transition: opacity 0.3s; transform: translateX(-50%); width: calc(100% - 32px); max-width: 24rem;';
        tooltip.textContent = problem.description;
        document.body.appendChild(tooltip);

        function hideAllTooltips() {
            document.querySelectorAll('.tooltip').forEach(t => {
                t.style.visibility = 'hidden';
                t.style.opacity = '0';
            });
        }

        function showTooltip(event, isMobileClick = false) {
            hideAllTooltips();
            
            const tooltipRect = tooltip.getBoundingClientRect();
            let top, left;

            if (isMobileClick) {
                const buttonRect = event.currentTarget.getBoundingClientRect();
                top = buttonRect.top - tooltipRect.height - 10;
                left = window.innerWidth / 2;
            } else {
                const pillRect = pill.getBoundingClientRect();
                top = pillRect.top - tooltipRect.height - 10;
                left = pillRect.left + (pillRect.width / 2);
            }

            tooltip.style.visibility = 'visible';
            tooltip.style.opacity = '1';
            tooltip.style.top = `${Math.max(10, top)}px`;
            tooltip.style.left = `${Math.max(10, left)}px`;
        }

        function hideTooltip() {
            tooltip.style.visibility = 'hidden';
            tooltip.style.opacity = '0';
        }

        if (isMobile()) {
            // Mobile - Click only
            const infoButton = pill.querySelector('.info-button');
            if (infoButton) {
                infoButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    
                    if (tooltip.style.visibility === 'visible') {
                        hideTooltip();
                    } else {
                        showTooltip(e, true);
                    }
                });

                // Close on click outside
                document.addEventListener('click', (e) => {
                    if (!infoButton.contains(e.target)) {
                        hideTooltip();
                    }
                });
            }
        } else {
            // Desktop - Hover only
            pill.addEventListener('mouseenter', (e) => {
                showTooltip(e, false);
            });
            pill.addEventListener('mouseleave', hideTooltip);
        }

        // Handle pill selection
        pill.addEventListener('click', e => {
            if (!e.target.closest('.info-button')) {
                toggleProblem(problem.id, pill);
                hideAllTooltips();
            }
        });

        // Cleanup function for tooltip when pill is removed
        pill.cleanup = () => {
            tooltip.remove();
        };

        problemsContainer.appendChild(pill);
    });

    function updateCalculations() {
        const yearlyRevenue = Number(revenueSlider.value);
        let totalGrowthPercent = 0;

        // Sum up the impact of selected problems
        selectedProblems.forEach(problemId => {
            const problem = businessProblems.find(p => p.id === problemId);
            if (problem) {
                totalGrowthPercent += problem.impact;
            }
        });

        // Calculate monthly and yearly impact
        const monthlyGrowth = (yearlyRevenue * (totalGrowthPercent / 100)) / 12;
        const yearlyGrowth = monthlyGrowth * 12;

        // Update growth amounts
        document.querySelectorAll('#growthAmount').forEach(el => {
            el.textContent = '+' + formatCurrency(monthlyGrowth);
        });
        document.querySelectorAll('#yearlyImpact').forEach(el => {
            el.textContent = '+' + formatCurrency(yearlyGrowth);
        });

        // Update revenue amount
        const revenueAmount = document.getElementById('revenueAmount');
        if (revenueAmount) {
            revenueAmount.textContent = formatCurrency(yearlyRevenue);
        }

        // Update current yearly revenue amount at the bottom
        const currentYearlyRevenue = document.getElementById('currentYearlyRevenue');
        if (currentYearlyRevenue) {
            currentYearlyRevenue.textContent = formatCurrency(yearlyRevenue);
        }

        // Update hours saved to reflect new revenue multiplier
        updateHoursSaved();
    }

    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    function updateRevenueAmount() {
        const revenueSlider = document.getElementById('revenueSlider');
        const revenueAmount = document.getElementById('revenueAmount');
        
        if (revenueSlider && revenueAmount) {
            const revenue = parseInt(revenueSlider.value);
            revenueAmount.textContent = formatCurrency(revenue);
        }
    }

    function formatCurrencyAmount(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    // Update on slider change
    revenueSlider.addEventListener('input', () => {
        updateCalculations();
        updateRevenueAmount();
    });

    // Initialize with default value
    updateCalculations();
    updateRevenueAmount();
});

// Handle slider touch events
function initSliderTouchEvents() {
    const slider = document.getElementById('revenueSlider');
    const container = slider.closest('.revenue-slider-container');
    let isSliding = false;

    function updateSliderValue(e) {
        const rect = slider.getBoundingClientRect();
        const x = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const position = x - rect.left;
        const percentage = Math.max(0, Math.min(1, position / rect.width));
        
        const min = parseInt(slider.min);
        const max = parseInt(slider.max);
        const value = min + percentage * (max - min);
        
        slider.value = Math.round(value / 10000) * 10000; // Round to nearest 10000
        slider.dispatchEvent(new Event('input')); // Trigger input event for other listeners
    }

    function onTouchStart(e) {
        isSliding = true;
        updateSliderValue(e);
    }

    function onTouchMove(e) {
        if (!isSliding) return;
        e.preventDefault();
        updateSliderValue(e);
    }

    function onTouchEnd() {
        isSliding = false;
    }

    // Add touch event listeners to the container
    container.addEventListener('touchstart', onTouchStart, { passive: false });
    container.addEventListener('touchmove', onTouchMove, { passive: false });
    container.addEventListener('touchend', onTouchEnd);
    container.addEventListener('touchcancel', onTouchEnd);

    // Also handle mouse events for testing
    container.addEventListener('mousedown', onTouchStart);
    window.addEventListener('mousemove', onTouchMove);
    window.addEventListener('mouseup', onTouchEnd);
}

// Initialize touch events when the DOM is loaded
document.addEventListener('DOMContentLoaded', initSliderTouchEvents);

// Mobile menu functionality
function toggleMobileMenu() {
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const closeMobileMenu = document.getElementById('closeMobileMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');

    function openMenu() {
        mobileMenu.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        mobileMenu.classList.add('hidden');
        document.body.style.overflow = '';
    }

    // Toggle menu on button click
    mobileMenuButton.addEventListener('click', openMenu);
    closeMobileMenu.addEventListener('click', closeMenu);

    // Close menu when clicking a link
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

// Pricing toggle functionality
function initPricingToggle() {
    const toggle = document.querySelector('.pricing-toggle');
    const monthlyPrices = document.querySelectorAll('[data-monthly]');
    const yearlyPrices = document.querySelectorAll('[data-yearly]');
    const pricingPeriods = document.querySelectorAll('.pricing-period');

    if (toggle) {
        toggle.addEventListener('change', function() {
            monthlyPrices.forEach(price => {
                price.textContent = this.checked ? `€${price.dataset.yearly}` : `€${price.dataset.monthly}`;
            });
            pricingPeriods.forEach(period => {
                period.textContent = this.checked ? '/month billed yearly' : '/month billed monthly';
            });
        });
    }
}

// Yearly/Monthly toggle functionality
function initYearlyMonthlyToggle() {
    const yearlyToggle = document.getElementById('yearlyToggle');
    const monthlyToggle = document.getElementById('monthlyToggle');
    const prices = document.querySelectorAll('[data-monthly]');
    const periodTexts = document.querySelectorAll('.pricing-period');

    function updatePricing(period) {
        // Update toggle button styles
        yearlyToggle.classList.toggle('bg-indigo-500', period === 'yearly');
        monthlyToggle.classList.toggle('bg-indigo-500', period === 'monthly');
        
        // Update prices
        prices.forEach(price => {
            const monthlyPrice = price.dataset.monthly;
            const yearlyPrice = price.dataset.yearly;
            price.textContent = '€' + (period === 'monthly' ? monthlyPrice : yearlyPrice);
        });

        // Update period text
        periodTexts.forEach(text => {
            text.textContent = period === 'monthly' ? '/month' : '/month billed yearly';
        });
    }

    // Set initial state to yearly
    if (yearlyToggle && monthlyToggle) {
        updatePricing('yearly');

        // Add click handlers
        yearlyToggle.addEventListener('click', () => updatePricing('yearly'));
        monthlyToggle.addEventListener('click', () => updatePricing('monthly'));
    }
}

// Handle header scroll effect
function handleHeaderScroll() {
    const header = document.querySelector('header');
    const firstSection = document.querySelector('.bg-gray-900');
    
    if (!header || !firstSection) {
        console.log('Could not find header or first section');
        return;
    }
    
    const checkScroll = () => {
        const scrollPosition = window.scrollY;
        const firstSectionOffset = firstSection.offsetTop - 100;
        const maxBlur = 12; // Maximum blur in pixels
        
        if (scrollPosition > firstSectionOffset) {
            header.classList.add('nav-scrolled');
            header.classList.remove('nav-blur');
            header.style.removeProperty('--blur-amount');
        } else {
            header.classList.remove('nav-scrolled');
            // Calculate blur based on scroll position
            const blurAmount = Math.min((scrollPosition / firstSectionOffset) * maxBlur, maxBlur);
            if (blurAmount > 0) {
                header.classList.add('nav-blur');
                header.style.setProperty('--blur-amount', `blur(${blurAmount}px)`);
            } else {
                header.classList.remove('nav-blur');
                header.style.removeProperty('--blur-amount');
            }
        }
    };

    // Check on scroll
    window.addEventListener('scroll', checkScroll);
    // Check immediately
    checkScroll();
}

// Initialize header scroll effect
document.addEventListener('DOMContentLoaded', () => {
    handleHeaderScroll();
    toggleMobileMenu();
    initPricingToggle();
    initYearlyMonthlyToggle();
    initRevenueSlider();
});

function initRevenueSlider() {
    const revenueSlider = document.getElementById('revenueSlider');
    if (revenueSlider) {
        revenueSlider.addEventListener('input', updateCalculations);
        updateCalculations(); // Initial calculation
    }
}

// Add scroll event listener with throttling
let scrollTimeout;
window.addEventListener('scroll', function() {
    if (!scrollTimeout) {
        scrollTimeout = setTimeout(function() {
            handleHeaderScroll();
            scrollTimeout = null;
        }, 10);
    }
});

// FAQ functionality
function initFAQ() {
    const faqButtons = document.querySelectorAll('[aria-controls^="faq-"]');
    
    faqButtons.forEach(button => {
        const contentId = button.getAttribute('aria-controls');
        const content = document.getElementById(contentId);
        
        if (!content) {
            console.error('FAQ content not found for:', contentId);
            return;
        }
        
        // Set initial state
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        content.style.display = isExpanded ? 'block' : 'none';
        
        button.addEventListener('click', () => {
            const isCurrentlyExpanded = button.getAttribute('aria-expanded') === 'true';
            
            // Close all other FAQs
            faqButtons.forEach(otherButton => {
                if (otherButton !== button) {
                    const otherId = otherButton.getAttribute('aria-controls');
                    const otherContent = document.getElementById(otherId);
                    if (otherContent) {
                        otherButton.setAttribute('aria-expanded', 'false');
                        otherContent.style.display = 'none';
                        const otherChevron = otherButton.querySelector('svg');
                        if (otherChevron) {
                            otherChevron.style.transform = 'rotate(0deg)';
                        }
                    }
                }
            });
            
            // Toggle current FAQ
            button.setAttribute('aria-expanded', !isCurrentlyExpanded);
            content.style.display = !isCurrentlyExpanded ? 'block' : 'none';
            
            // Rotate the chevron icon
            const chevron = button.querySelector('svg');
            if (chevron) {
                chevron.style.transform = !isCurrentlyExpanded ? 'rotate(180deg)' : 'rotate(0deg)';
                chevron.style.transition = 'transform 0.3s ease';
            }
        });
    });
    
    // Open first FAQ by default
    const firstButton = faqButtons[0];
    if (firstButton) {
        const firstContent = document.getElementById(firstButton.getAttribute('aria-controls'));
        if (firstContent) {
            firstButton.setAttribute('aria-expanded', 'true');
            firstContent.style.display = 'block';
            const firstChevron = firstButton.querySelector('svg');
            if (firstChevron) {
                firstChevron.style.transform = 'rotate(180deg)';
            }
        }
    }
}

// Initialize FAQ when DOM is loaded
document.addEventListener('DOMContentLoaded', initFAQ);