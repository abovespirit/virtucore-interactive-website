document.addEventListener('DOMContentLoaded', function() {
    const items = document.querySelectorAll('.wr-home-service-slider__list__item');
    let currentIndex = 0;
    
    // Function to update active item
    function setActiveItem(index) {
        // Remove active class from all items except the first one
        items.forEach((item, i) => {
            if (i !== 0) { // Don't modify the first item's styles
                item.classList.remove('current');
                item.style.zIndex = '1';
                item.style.opacity = '0.5';
                item.style.transform = 'scale(0.9)';
            }
        });
        
        // Add active class to the new active item and update styles
        items[index].classList.add('current');
        items[index].style.zIndex = '10';
        items[index].style.opacity = '1';
        items[index].style.transform = 'scale(1)';
        currentIndex = index;
        
        // Smooth scroll to the active item
        items[index].scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
        });
    }
    
    // Initialize first item as active
    if (items.length > 0) {
        items[0].classList.add('current');
        items[0].style.zIndex = '10';
        items[0].style.opacity = '1';
        items[0].style.transform = 'scale(1)';
    }
    
    // Set up click event for each item
    items.forEach((item, index) => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            setActiveItem(index);
        });
        
        // Add hover effect
        item.addEventListener('mouseenter', function() {
            if (!this.classList.contains('current')) {
                this.style.opacity = '0.8';
                this.style.transform = 'scale(0.95)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            if (!this.classList.contains('current')) {
                this.style.opacity = '0.5';
                this.style.transform = 'scale(0.9)';
            }
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            e.preventDefault();
            const nextIndex = (currentIndex + 1) % items.length;
            setActiveItem(nextIndex);
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            e.preventDefault();
            const prevIndex = (currentIndex - 1 + items.length) % items.length;
            setActiveItem(prevIndex);
        }
    });
});
