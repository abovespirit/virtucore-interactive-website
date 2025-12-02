// Contact Form Submission and Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get the modal elements
    const modal = document.getElementById('privacyPolicyModal');
    const privacyLink = document.getElementById('privacyPolicyLink');
    const closeBtn = document.querySelector('.close');
    
    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Add your form submission logic here
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }
    
    // Open modal when privacy policy link is clicked
    if (privacyLink) {
        privacyLink.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            showModal();
            return false;
        });
    }
    
    // Close modal when X is clicked
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            hideModal();
        });
    }
    
    // Close modal when clicking outside the modal content
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            hideModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            hideModal();
        }
    });
    
    // Show modal function
    function showModal() {
        // Show the modal
        modal.style.display = 'flex';
        
        // Trigger reflow to ensure the display property is applied
        void modal.offsetWidth;
        
        // Add show class to trigger animation
        modal.classList.add('show');
        
        // Add event listener to close modal when clicking outside content
        const closeOnClickOutside = function(e) {
            if (e.target === modal) {
                hideModal();
            }
        };
        modal.addEventListener('click', closeOnClickOutside);
        
        // Store the reference to remove it later
        modal._closeOnClickOutside = closeOnClickOutside;
    }
    
    // Hide modal function
    function hideModal() {
        // Remove show class to trigger fade out
        modal.classList.remove('show');
        
        // Wait for the transition to complete before hiding completely
        setTimeout(() => {
            if (!modal.classList.contains('show')) {
                // Hide the modal
                modal.style.display = 'none';
                
                // Remove the click outside event listener
                if (modal._closeOnClickOutside) {
                    modal.removeEventListener('click', modal._closeOnClickOutside);
                    delete modal._closeOnClickOutside;
                }
            }
        }, 300); // Match this with the CSS transition time
    }
});
