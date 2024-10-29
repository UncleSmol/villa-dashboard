// Get all service category elements
const serviceCategories = document.querySelectorAll('.service-category');

// Helper function for smooth transitions
function toggleElementWithTransition(element) {
	// Set initial height for transition
	if (element.style.display === 'none') {
		element.style.display = 'block';
		element.style.opacity = '0';
		element.style.maxHeight = '0';
		element.style.overflow = 'hidden';

		// Trigger reflow
		element.offsetHeight;

		// Add transitions
		element.style.transition =
			'max-height 0.3s ease-in-out, opacity 0.3s ease-in-out';
		element.style.opacity = '1';
		element.style.maxHeight = element.scrollHeight + 'px';
	} else {
		element.style.opacity = '0';
		element.style.maxHeight = '0';

		// Wait for transition to complete before hiding
		setTimeout(() => {
			element.style.display = 'none';
			element.style.transition = '';
		}, 300);
	}
}

// Initially hide all child elements except the headings
serviceCategories.forEach((category) => {
	const children = category.querySelectorAll('p, ul');
	children.forEach((child) => {
		child.style.display = 'none';
		child.style.maxHeight = '0';
		child.style.opacity = '0';
	});
});

// Add click handlers for each category
document
	.getElementById('service-category-manual-guides')
	.addEventListener('click', function () {
		const children = this.querySelectorAll('p, ul');
		children.forEach((child) => {
			toggleElementWithTransition(child);
		});
	});

document
	.getElementById('service-category-policies-procedures')
	.addEventListener('click', function () {
		const children = this.querySelectorAll('p, ul');
		children.forEach((child) => {
			toggleElementWithTransition(child);
		});
	});

// Add hover effect to categories
serviceCategories.forEach((category) => {
	category.style.transition = 'transform 0.2s ease-in-out';
	category.addEventListener('mouseenter', () => {
		category.style.transform = 'translateX(5px)';
	});
	category.addEventListener('mouseleave', () => {
		category.style.transform = 'translateX(0)';
	});
});

// Get the sections and their elements
const documentationSection = document.querySelector('.documentation-section');
const servicesSection = document.querySelector('.services-section');

// Helper function for smooth transitions
function toggleElementWithTransition(element) {
    if (element.style.display === 'none' || !element.style.display) {
        element.style.display = 'block';
        element.style.opacity = '0';
        element.style.maxHeight = '0';
        element.style.overflow = 'hidden';
        
        // Trigger reflow
        element.offsetHeight;
        
        // Add transitions
        element.style.transition = 'max-height 0.3s ease-in-out, opacity 0.3s ease-in-out';
        element.style.opacity = '1';
        element.style.maxHeight = element.scrollHeight + 'px';
    } else {
        element.style.opacity = '0';
        element.style.maxHeight = '0';
        
        setTimeout(() => {
            element.style.display = 'none';
            element.style.transition = '';
        }, 300);
    }
}

// Function to setup section toggle behavior
function setupSection(section) {
    const toggleBtn = section.querySelector('.toggle-btn');
    const contentElements = section.querySelectorAll('.section-description, .content-wrapper, .services-grid');
    
    // Initially hide all content except headings
    contentElements.forEach(element => {
        element.style.display = 'none';
        element.style.maxHeight = '0';
        element.style.opacity = '0';
    });

    // Add click handler to toggle button
    toggleBtn.addEventListener('click', () => {
        const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
        toggleBtn.setAttribute('aria-expanded', !isExpanded);
        
        contentElements.forEach(element => {
            toggleElementWithTransition(element);
        });
    });
}

// Initialize both sections
document.addEventListener('DOMContentLoaded', () => {
    // Setup Documentation section
    setupSection(documentationSection);
    
    // Setup Services section
    setupSection(servicesSection);
    
    // Add ARIA attributes to toggle buttons
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    toggleButtons.forEach(btn => {
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('role', 'button');
    });
});

// Get the notification element
const notification = document.querySelector('.notification-container');

// Function to show notification with fade in
function showNotification() {
    notification.style.display = 'flex';
    notification.style.opacity = '0';
    
    // Trigger reflow
    notification.offsetHeight;
    
    // Add transition and fade in
    notification.style.transition = 'opacity 0.5s ease-in-out';
    notification.style.opacity = '1';
}

// Function to hide notification with fade out
function hideNotification() {
    notification.style.opacity = '0';
    
    // Wait for fade out to complete before hiding
    setTimeout(() => {
        notification.style.display = 'none';
        notification.style.transition = '';
    }, 500);
}

// Set up the notification timing
document.addEventListener('DOMContentLoaded', () => {
    // Initially hide notification
    notification.style.display = 'none';
    
    // Show notification after 3 seconds
    setTimeout(showNotification, 3000);
    
    // Hide notification after 15 seconds (5 seconds delay + 10 seconds display time)
    setTimeout(hideNotification, 15000);
});
