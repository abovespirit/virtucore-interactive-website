document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const processSteps = document.querySelectorAll('.process-step');
    const processImages = document.querySelectorAll('.process-image');
    let activeStep = 1;
    let isAnimating = false;
    let resizeTimer;

    // Initialize first step
    function init() {
        // Set up event listeners
        setupEventListeners();
        // Activate first step
        updateActiveStep(1, false);
    }

    // Set up event listeners
    function setupEventListeners() {
        processSteps.forEach(step => {
            // Click event
            step.addEventListener('click', handleStepClick);
            
            // Hover effects
            step.addEventListener('mouseenter', handleStepHover);
            step.addEventListener('mouseleave', handleStepHoverOut);
        });

        // Window resize handler
        window.addEventListener('resize', handleWindowResize);
    }

    // Handle step click
    function handleStepClick() {
        const stepNumber = parseInt(this.getAttribute('data-step'));
        if (stepNumber !== activeStep && !isAnimating) {
            updateActiveStep(stepNumber, true);
        }
    }

    // Handle step hover
    function handleStepHover() {
        if (!this.classList.contains('active') && !isAnimating) {
            this.style.transform = 'translateX(10px)';
            this.style.background = 'rgba(123, 44, 191, 0.1)';
        }
    }

    // Handle step hover out
    function handleStepHoverOut() {
        if (!this.classList.contains('active')) {
            this.style.transform = '';
            this.style.background = '';
        }
    }

    // Handle window resize
    function handleWindowResize() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const activeStepEl = document.querySelector('.process-step.active');
            if (activeStepEl) {
                activeStepEl.scrollIntoView({
                    behavior: 'auto',
                    block: 'center',
                    inline: 'nearest'
                });
            }
        }, 250);
    }

    // Update active step
    function updateActiveStep(stepNumber, animate = true) {
        if (isAnimating) return;
        isAnimating = true;
        
        resetAllSteps();
        const currentStep = activateStep(stepNumber);
        
        if (currentStep) {
            updateActiveImage(stepNumber);
            
            if (animate) {
                scrollToStep(currentStep);
            }
            
            activeStep = stepNumber;
        }

        // Reset animation flag after transition
        setTimeout(() => {
            isAnimating = false;
        }, 500);
    }

    // Reset all steps to default state
    function resetAllSteps() {
        processSteps.forEach(step => {
            step.classList.remove('active');
            step.style.transform = '';
            step.style.background = '';
        });
    }

    // Activate the specified step
    function activateStep(stepNumber) {
        const currentStep = document.querySelector(`.process-step[data-step="${stepNumber}"]`);
        if (currentStep) {
            currentStep.classList.add('active');
        }
        return currentStep;
    }

    // Update the active image
    function updateActiveImage(stepNumber) {
        processImages.forEach(img => {
            const imgStep = parseInt(img.getAttribute('data-step'));
            img.classList.toggle('active', imgStep === stepNumber);
        });
    }

    // Scroll to the specified step
    function scrollToStep(stepElement) {
        stepElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
        });
    }

    // Initialize the process steps
    init();
                    inline: 'nearest'
                });
            }
        }, 250);
    });
});
