document.addEventListener('DOMContentLoaded', () => {
	// Initialize all sections in collapsed state
	const toggleButtons = document.querySelectorAll('.toggle-btn');
	const serviceCategories = document.querySelectorAll('.service-category');

	// Add new selectors for manual guides and policies
	const mainHeadings = document.querySelectorAll('.service-category h3');
	const subHeadings = document.querySelectorAll(
		'.document-group > p, .policy-folder > p'
	);

	// Initially hide all lists
	document.querySelectorAll('.document-nav ul').forEach((ul) => {
		ul.style.display = 'none';
		ul.style.maxHeight = '0';
		ul.style.overflow = 'hidden';
		ul.style.transition = 'max-height 0.3s ease-in-out';
	});

	// Enhanced helper function for dynamic height calculations
	function toggleElementWithTransition(
		element,
		isExpanding,
		parentElement = null
	) {
		if (isExpanding) {
			const displayType = element.classList.contains('services-grid')
				? 'grid'
				: 'block';
			element.style.display = displayType;
			element.style.opacity = '0';
			element.style.maxHeight = '0';

			element.offsetHeight; // Trigger reflow

			const totalHeight = calculateTotalHeight(element);

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

		const styles = window.getComputedStyle(clone);
		const marginTop = parseInt(styles.marginTop) || 0;
		const marginBottom = parseInt(styles.marginBottom) || 0;
		const paddingTop = parseInt(styles.paddingTop) || 0;
		const paddingBottom = parseInt(styles.paddingBottom) || 0;
		const contentHeight = clone.offsetHeight;
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

		btn.setAttribute('aria-expanded', (!isExpanded).toString());

		if (content) {
			toggleElementWithTransition(content, !isExpanded, section);
		}
		if (description) {
			toggleElementWithTransition(description, !isExpanded, section);
		}
		if (servicesGrid) {
			toggleElementWithTransition(servicesGrid, !isExpanded, content);
		}

		section.classList.toggle('expanded', !isExpanded);
	}

	// Helper function for hover states
	function updateHoverState(element, isExpanded) {
		if (isExpanded) {
			element.classList.add('expanded');
			element.style.transform = 'none';
		} else {
			element.classList.remove('expanded');
		}
	}

	// Setup main section toggles
	toggleButtons.forEach((btn) => {
		btn.addEventListener('click', (e) => {
			e.stopPropagation();
			toggleSection(btn);
		});
	});

	// New function to handle nested content toggling
	function toggleNestedContent(element, contentToToggle) {
		const isExpanded = element.getAttribute('aria-expanded') === 'true';
		element.setAttribute('aria-expanded', (!isExpanded).toString());

		if (!isExpanded) {
			contentToToggle.style.display = 'block';
			const height = contentToToggle.scrollHeight;
			contentToToggle.style.maxHeight = `${height}px`;
			element.classList.add('expanded');
		} else {
			contentToToggle.style.maxHeight = '0';
			element.classList.remove('expanded');
			setTimeout(() => {
				contentToToggle.style.display = 'none';
			}, 300);
		}
	}

	// Setup handlers for main headings (MANUAL GUIDES and POLICIES & PROCEDURES)
	mainHeadings.forEach((heading) => {
		heading.setAttribute('aria-expanded', 'false');
		heading.style.cursor = 'pointer';

		heading.addEventListener('click', (e) => {
			e.stopPropagation();
			const category = heading.closest('.service-category');
			const immediateNav = category.querySelector(':scope > .document-nav');
			if (immediateNav) {
				toggleNestedContent(heading, immediateNav);
			}
		});
	});

	// Setup handlers for subheadings (Standard Operational Procedures, Employee Policies, etc.)
	subHeadings.forEach((subheading) => {
		subheading.setAttribute('aria-expanded', 'false');
		subheading.style.cursor = 'pointer';

		subheading.addEventListener('click', (e) => {
			e.stopPropagation();
			const nav = subheading.nextElementSibling;
			if (nav && nav.classList.contains('document-nav')) {
				toggleNestedContent(subheading, nav);
			}
		});
	});

	// Setup service category toggles with nested content handling
	serviceCategories.forEach((category) => {
		category.addEventListener('click', () => {
			const lists = category.querySelectorAll('ul');
			const isExpanded = category.getAttribute('aria-expanded') === 'true';
			const parentWrapper = category.closest('.content-wrapper');

			category.setAttribute('aria-expanded', (!isExpanded).toString());
			updateHoverState(category, !isExpanded);

			lists.forEach((list) => {
				toggleElementWithTransition(list, !isExpanded, category);
			});

			if (parentWrapper) {
				setTimeout(() => {
					document
						.querySelectorAll('.documentation-section, .services-section')
						.forEach((section) => {
							if (
								section
									.querySelector('.toggle-btn')
									?.getAttribute('aria-expanded') === 'true'
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

		if (servicesGrid) {
			servicesGrid.style.opacity = '0';
			servicesGrid.style.maxHeight = '0';
			servicesGrid.style.overflow = 'hidden';
		}

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
			e.stopPropagation();
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

	// Add CSS styles for transitions and interactions
	const style = document.createElement('style');
	style.textContent = `
        .service-category h3,
        .document-group > p,
        .policy-folder > p {
            cursor: pointer;
            padding: 10px;
            margin: 0;
            transition: background-color 0.3s ease;
        }

        .service-category h3:hover,
        .document-group > p:hover,
        .policy-folder > p:hover {
            background-color: rgba(0, 0, 0, 0.05);
        }

        .document-nav {
            overflow: hidden;
            transition: max-height 0.3s ease-in-out;
        }

        .document-nav ul {
            padding-left: 20px;
            margin: 0;
        }

        .expanded {
            background-color: rgba(0, 0, 0, 0.02);
        }
    `;
	document.head.appendChild(style);
});
