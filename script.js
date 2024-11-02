document.addEventListener('DOMContentLoaded', () => {
	// Initialize all sections in collapsed state
	const toggleButtons = document.querySelectorAll('.toggle-btn');
	const serviceCategories = document.querySelectorAll('.service-category');

	// Enhanced helper function for dynamic height calculations
	function toggleElementWithTransition(
		element,
		isExpanding,
		parentElement = null
	) {
		if (isExpanding) {
			// Determine proper display type
			const displayType = element.classList.contains('services-grid')
				? 'grid'
				: 'block';
			element.style.display = displayType;
			element.style.opacity = '0';
			element.style.maxHeight = '0';

			// Trigger reflow
			element.offsetHeight;

			// Calculate height including margins
			const totalHeight = calculateTotalHeight(element);

			// Add transitions
			element.style.transition =
				'max-height 0.3s ease-in-out, opacity 0.3s ease-in-out';
			element.style.opacity = '1';
			element.style.maxHeight = `${totalHeight}px`;

			if (parentElement) {
				adjustParentHeights(parentElement);
			}
		} else {
			element.style.opacity = '0';
			element.style.maxHeight = '0';

			setTimeout(() => {
				element.style.display = 'none';
				element.style.transition = '';

				if (parentElement) {
					adjustParentHeights(parentElement);
				}
			}, 300);
		}
	}

	// Enhanced total height calculation
	function calculateTotalHeight(element) {
		const clone = element.cloneNode(true);
		clone.style.maxHeight = 'none';
		clone.style.opacity = '0';
		clone.style.position = 'absolute';
		clone.style.visibility = 'hidden';
		clone.style.display = element.classList.contains('services-grid')
			? 'grid'
			: 'block';
		document.body.appendChild(clone);

		// Get computed styles
		const styles = window.getComputedStyle(clone);

		// Calculate total height including margins and padding
		const marginTop = parseInt(styles.marginTop) || 0;
		const marginBottom = parseInt(styles.marginBottom) || 0;
		const paddingTop = parseInt(styles.paddingTop) || 0;
		const paddingBottom = parseInt(styles.paddingBottom) || 0;

		// Get the content height
		const contentHeight = clone.offsetHeight;

		// Calculate total height with spacing
		const totalHeight =
			contentHeight + marginTop + marginBottom + paddingTop + paddingBottom;

		document.body.removeChild(clone);
		return totalHeight;
	}

	// Function to adjust parent heights recursively
	function adjustParentHeights(element) {
		let current = element;
		let totalAdditionalHeight = 0;

		while (
			current &&
			(current.classList.contains('content-wrapper') ||
				current.classList.contains('service-category') ||
				current.classList.contains('documentation-section') ||
				current.classList.contains('services-section'))
		) {
			const styles = window.getComputedStyle(current);
			const marginTop = parseInt(styles.marginTop) || 0;
			const marginBottom = parseInt(styles.marginBottom) || 0;
			const paddingTop = parseInt(styles.paddingTop) || 0;
			const paddingBottom = parseInt(styles.paddingBottom) || 0;

			totalAdditionalHeight +=
				marginTop + marginBottom + paddingTop + paddingBottom;
			const newHeight = calculateTotalHeight(current) + totalAdditionalHeight;
			current.style.maxHeight = `${newHeight}px`;

			current = current.parentElement;
		}
	}

	// Function to handle section toggling
	function toggleSection(btn) {
		const section = btn.closest('section');
		const content = section.querySelector('.content-wrapper');
		const description = section.querySelector('.section-description');
		const servicesGrid = section.querySelector('.services-grid');
		const isExpanded = btn.getAttribute('aria-expanded') === 'true';

		// Toggle button state
		btn.setAttribute('aria-expanded', (!isExpanded).toString());

		// Toggle content visibility
		if (content) {
			toggleElementWithTransition(content, !isExpanded, section);
		}
		if (description) {
			toggleElementWithTransition(description, !isExpanded, section);
		}
		if (servicesGrid) {
			toggleElementWithTransition(servicesGrid, !isExpanded, content);
		}

		// Update section state
		section.classList.toggle('expanded', !isExpanded);
	}

	// Setup main section toggles
	toggleButtons.forEach((btn) => {
		btn.addEventListener('click', (e) => {
			e.stopPropagation();
			toggleSection(btn);
		});
	});

	// Helper function for hover states
	function updateHoverState(element, isExpanded) {
		if (isExpanded) {
			element.classList.add('expanded');
			element.style.transform = 'none';
		} else {
			element.classList.remove('expanded');
		}
	}

	// Setup service category toggles with nested content handling
	serviceCategories.forEach((category) => {
		category.addEventListener('click', () => {
			const lists = category.querySelectorAll('ul');
			const isExpanded = category.getAttribute('aria-expanded') === 'true';
			const parentWrapper = category.closest('.content-wrapper');

			// Toggle category state
			category.setAttribute('aria-expanded', (!isExpanded).toString());
			updateHoverState(category, !isExpanded);

			// Toggle lists visibility
			lists.forEach((list) => {
				toggleElementWithTransition(list, !isExpanded, category);
			});

			// Adjust parent wrapper height
			if (parentWrapper) {
				setTimeout(() => {
					// Adjust all expanded sections
					document
						.querySelectorAll('.documentation-section, .services-section')
						.forEach((section) => {
							if (
								section
									.querySelector('.toggle-btn')
									.getAttribute('aria-expanded') === 'true'
							) {
								adjustParentHeights(section);
							}
						});
				}, 50);
			}
		});

		// Add hover effects only when not expanded
		category.addEventListener('mouseenter', () => {
			if (!category.classList.contains('expanded')) {
				category.style.transform = 'translateX(5px)';
			}
		});

		category.addEventListener('mouseleave', () => {
			if (!category.classList.contains('expanded')) {
				category.style.transform = 'translateX(0)';
			}
		});
	});

	// Initialize services grid functionality
	const servicesSection = document.querySelector('.services-section');
	if (servicesSection) {
		const servicesGrid = servicesSection.querySelector('.services-grid');
		const serviceItems = servicesSection.querySelectorAll('.service-item');

		// Ensure services grid is properly initialized
		if (servicesGrid) {
			servicesGrid.style.opacity = '0';
			servicesGrid.style.maxHeight = '0';
			servicesGrid.style.overflow = 'hidden';
		}

		// Add hover effects to service items
		serviceItems.forEach((item) => {
			item.addEventListener('mouseenter', () => {
				if (!servicesSection.classList.contains('expanded')) {
					item.style.transform = 'translateY(-5px)';
				}
			});

			item.addEventListener('mouseleave', () => {
				if (!servicesSection.classList.contains('expanded')) {
					item.style.transform = 'translateY(0)';
				}
			});
		});
	}

	// Initialize loading state handler
	const loadingOverlay = document.querySelector('.loading-overlay');

	function showLoading() {
		if (loadingOverlay) {
			loadingOverlay.style.display = 'flex';
			loadingOverlay.style.opacity = '0';
			// Trigger reflow
			loadingOverlay.offsetHeight;
			loadingOverlay.style.opacity = '1';
		}
	}

	function hideLoading() {
		if (loadingOverlay) {
			loadingOverlay.style.opacity = '0';
			setTimeout(() => {
				loadingOverlay.style.display = 'none';
			}, 300);
		}
	}

	// Handle external links
	document.querySelectorAll('a[target="_blank"]').forEach((link) => {
		link.addEventListener('click', (e) => {
			e.stopPropagation(); // Prevent triggering parent toggles
			showLoading();
			setTimeout(hideLoading, 1000);
		});
	});

	// Initial setup for sections
	document
		.querySelectorAll('.documentation-section, .services-section')
		.forEach((section) => {
			const content = section.querySelector('.content-wrapper');
			const description = section.querySelector('.section-description');
			const servicesGrid = section.querySelector('.services-grid');

			if (content) content.style.display = 'none';
			if (description) description.style.display = 'none';
			if (servicesGrid) servicesGrid.style.display = 'none';
		});
});
