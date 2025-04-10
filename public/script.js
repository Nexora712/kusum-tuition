document.addEventListener('DOMContentLoaded', () => {
    // Create flower and raindrop animations with reduced count
    createAnimations();

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Progress bar animation
    const progressBar = document.querySelector('.progress-fill');
    const studentCount = document.getElementById('student-count');
    let currentCount = 0;
    const targetCount = 15;
    const duration = 2000;
    const steps = 30; // Reduced steps for smoother animation
    const stepDuration = duration / steps;
    const increment = targetCount / steps;

    const animateProgress = () => {
        let step = 0;
        const interval = setInterval(() => {
            step++;
            currentCount = Math.min(Math.floor(step * increment), targetCount);
            const percentage = (currentCount / targetCount) * 100;
            
            progressBar.style.width = `${percentage}%`;
            studentCount.textContent = currentCount;

            if (step >= steps) {
                clearInterval(interval);
            }
        }, stepDuration);
    };

    // Start animation when the progress bar comes into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateProgress();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(progressBar);

    // Form submission handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('/api/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    showNotification('Thank you for your interest! We will contact you soon.', 'success');
                    contactForm.reset();
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                showNotification('Sorry, there was an error. Please try again later.', 'error');
                console.error('Error:', error);
            }
        });
    }
});

// Create optimized flower and raindrop animations
function createAnimations() {
    const flowersContainer = document.getElementById('flowers');
    const raindropsContainer = document.getElementById('raindrops');

    // Create fewer flowers with optimized animation
    for (let i = 0; i < 15; i++) { // Reduced from 30 to 15
        const flower = document.createElement('div');
        flower.className = 'flower';
        flower.style.left = `${Math.random() * 100}%`;
        flower.style.top = `${Math.random() * 100}%`;
        flower.style.animationDelay = `${Math.random() * 3}s`; // Reduced delay
        flower.style.opacity = `${Math.random() * 0.4 + 0.2}`; // Reduced opacity range
        flower.style.transform = `scale(${Math.random() * 0.3 + 0.7})`; // Optimized scale
        flowersContainer.appendChild(flower);
    }

    // Create fewer raindrops with optimized animation
    for (let i = 0; i < 25; i++) { // Reduced from 50 to 25
        const raindrop = document.createElement('div');
        raindrop.className = 'raindrop';
        raindrop.style.left = `${Math.random() * 100}%`;
        raindrop.style.animationDelay = `${Math.random() * 1}s`; // Reduced delay
        raindrop.style.opacity = `${Math.random() * 0.4 + 0.2}`; // Reduced opacity range
        raindrop.style.height = `${Math.random() * 8 + 4}px`; // Optimized height
        raindropsContainer.appendChild(raindrop);
    }
}

// Show notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
} 