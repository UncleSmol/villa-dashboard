// Toggle main sections
document.querySelectorAll('.section-header h2').forEach((header) => {
	header.addEventListener('click', () => {
		const section = header.closest('section');
		section.classList.toggle('active');
	});
});

// Toggle service categories
document.querySelectorAll('.service-category h3').forEach((header) => {
	header.addEventListener('click', () => {
		const category = header.closest('.service-category');
		category.classList.toggle('active');
	});
});

// Toggle manual groups
document.querySelectorAll('.manual-header').forEach((header) => {
	header.addEventListener('click', () => {
		const group = header.closest('.manual-group');
		group.classList.toggle('active');
	});
});

// Toggle policy groups
document.querySelectorAll('.policy-header').forEach((header) => {
	header.addEventListener('click', () => {
		const group = header.closest('.policy-group');
		group.classList.toggle('active');
	});
});

// Chat toggle functionality
const chatToggleBtn = document.querySelector('.chat-toggle-btn');
const chatPanel = document.querySelector('.chat-panel');
const closeChatBtn = document.querySelector('.close-chat-btn');

chatToggleBtn.addEventListener('click', () => {
    chatPanel.classList.add('active');
});

closeChatBtn.addEventListener('click', () => {
    chatPanel.classList.remove('active');
});

// Close chat panel when clicking outside
document.addEventListener('click', (e) => {
    if (!chatPanel.contains(e.target) && !chatToggleBtn.contains(e.target)) {
        chatPanel.classList.remove('active');
    }
});
