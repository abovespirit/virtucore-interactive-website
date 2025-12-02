document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.service-slider');
    if (!slider) return;

    const items = Array.from(slider.querySelectorAll('.service-slider__item'));
    let currentIndex = 0;
    
    // Initialize slider
    function initSlider() {
        if (items.length === 0) return;
        
        // Show all items and make first one active
        items.forEach((item, index) => {
            // Add click handler to each item
            item.addEventListener('click', () => {
                setActiveItem(index);
            });
            
            // Set initial active state
            if (index === 0) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
    
    // Set active item
    function setActiveItem(index) {
        // Update current index
        currentIndex = index;
        
        // Update active class for all items
        items.forEach((item, i) => {
            if (i === index) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        // Optional: Scroll to make the active item visible if needed
        items[index].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });
    }
    
    // Initialize the slider
    initSlider();
});
