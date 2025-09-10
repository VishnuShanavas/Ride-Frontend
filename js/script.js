// Global Variables
let selectedCar = '';
let bookingData = {};

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Initialize Website Functions
function initializeWebsite() {
    setupEventListeners();
    setupFormValidation();
    setupAnimations();
    checkForStoredData();
}

// Event Listeners Setup
function setupEventListeners() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Form submissions
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmit);
        
        // Real-time form updates
        const formInputs = bookingForm.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            input.addEventListener('change', updateBookingSummary);
        });
    }

    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', handleFeedbackSubmit);
    }

    // Car selection buttons
    const carButtons = document.querySelectorAll('.car-btn');
    carButtons.forEach(button => {
        button.addEventListener('click', function() {
            const carName = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            selectCar(carName);
        });
    });
}

// Form Validation Setup
function setupFormValidation() {
    // Email validation
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateEmail(this);
        });
    });

    // Phone validation
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validatePhone(this);
        });
    });

    // Date validation
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        input.addEventListener('change', function() {
            validateDate(this);
        });
    });
}

// Animation Setup
function setupAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .car-card, .team-member');
    animateElements.forEach(el => observer.observe(el));
}

// Check for stored data (simulate persistence without localStorage)
function checkForStoredData() {
    // In a real application, this would check localStorage
    // For this demo, we'll just initialize empty
    bookingData = {};
}

// Car Selection Function
function selectCar(carName) {
    selectedCar = carName;
    
    // Show confirmation alert
    if (confirm(`You have selected "${carName}". Would you like to proceed to booking?`)) {
        // Store selection and redirect
        bookingData.selectedCar = carName;
        
        // If we're not on booking page, redirect
        if (!window.location.pathname.includes('booking.html')) {
            const bookingUrl = window.location.pathname.includes('/pages/') ? 
                'booking.html' : 'pages/booking.html';
            window.location.href = bookingUrl;
        } else {
            // Update form if we're already on booking page
            const carTypeSelect = document.getElementById('carType');
            if (carTypeSelect) {
                // Map car names to categories
                const carCategories = {
                    'Maruti Swift': 'economy',
                    'Hyundai i20': 'economy',
                    'Honda City': 'premium',
                    'Toyota Camry': 'premium',
                    'BMW 3 Series': 'luxury',
                    'Audi Q5': 'luxury'
                };
                
                carTypeSelect.value = carCategories[carName] || '';
                updateBookingSummary();
            }
        }
    }
    
    // Show success message
    setTimeout(() => {
        alert(`Great choice! "${carName}" has been added to your booking preferences.`);
    }, 100);
}

// Budget Range Updater
function updateBudgetValue(value) {
    document.getElementById('budgetValue').textContent = value;
    updateBookingSummary();
}

// Booking Form Submission
function handleBookingSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(e.target);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    // Validate required fields
    if (!validateBookingForm(data)) {
        alert('Please fill in all required fields correctly.');
        return;
    }
    
    // Show confirmation dialog
    const confirmMessage = `Please confirm your booking details:
    
Name: ${data.fullName}
Email: ${data.email}
Phone: ${data.phone}
Service: ${data.serviceType}
Car Category: ${data.carType}
Pickup Date: ${data.pickupDate}
Pickup Time: ${data.pickupTime}
Pickup Location: ${data.pickupLocation}

Would you like to proceed with this booking?`;
    
    if (confirm(confirmMessage)) {
        // Process booking
        processBooking(data);
    }
}

// Validate Booking Form
function validateBookingForm(data) {
    const required = ['fullName', 'email', 'phone', 'serviceType', 'carType', 'pickupDate', 'pickupTime', 'pickupLocation'];
    
    for (let field of required) {
        if (!data[field] || data[field].trim() === '') {
            return false;
        }
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        return false;
    }
    
    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
        return false;
    }
    
    return true;
}

// Process Booking
function processBooking(data) {
    // Simulate API call with timeout
    const loadingMessage = document.createElement('div');
    loadingMessage.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                    background: rgba(0,0,0,0.8); display: flex; align-items: center; 
                    justify-content: center; z-index: 9999; color: white; font-size: 1.2rem;">
            <div style="text-align: center;">
                <div style="border: 4px solid #f3f3f3; border-top: 4px solid #1e3a8a; 
                           border-radius: 50%; width: 50px; height: 50px; 
                           animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
                Processing your booking...
            </div>
        </div>
    `;
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(loadingMessage);
    
    // Simulate processing time
    setTimeout(() => {
        document.body.removeChild(loadingMessage);
        
        // Generate booking ID
        const bookingId = 'RIDE' + Date.now().toString().slice(-6);
        
        // Success message
        const successMessage = `🎉 Booking Confirmed! 🎉

Booking ID: ${bookingId}
Customer: ${data.fullName}
Service: ${data.serviceType}
Date & Time: ${data.pickupDate} at ${data.pickupTime}

✅ Confirmation details sent to ${data.email}
📱 SMS confirmation sent to ${data.phone}

Our team will contact you 1 hour before pickup time.

Thank you for choosing RIDE! 🚗`;
        
        alert(successMessage);
        
        // Reset form
        if (confirm('Would you like to make another booking?')) {
            document.getElementById('bookingForm').reset();
            updateBookingSummary();
        } else {
            // Redirect to home page
            window.location.href = window.location.pathname.includes('/pages/') ? 
                '../index.html' : 'index.html';
        }
        
    }, 2000);
}

// Update Booking Summary
function updateBookingSummary() {
    const summaryContent = document.getElementById('summaryContent');
    if (!summaryContent) return;
    
    const form = document.getElementById('bookingForm');
    const formData = new FormData(form);
    
    const serviceType = formData.get('serviceType');
    const carType = formData.get('carType');
    const pickupDate = formData.get('pickupDate');
    const pickupTime = formData.get('pickupTime');
    const duration = formData.get('duration') || '4';
    const budget = formData.get('budget') || '3000';
    
    if (serviceType || carType || pickupDate) {
        let summary = '<div class="summary-details">';
        
        if (serviceType) {
            summary += `<p><strong>Service:</strong> ${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}</p>`;
        }
        
        if (carType) {
            summary += `<p><strong>Car Category:</strong> ${carType.charAt(0).toUpperCase() + carType.slice(1)}</p>`;
        }
        
        if (pickupDate && pickupTime) {
            summary += `<p><strong>Pickup:</strong> ${pickupDate} at ${pickupTime}</p>`;
        }
        
        if (duration) {
            summary += `<p><strong>Duration:</strong> ${duration} hours</p>`;
        }
        
        if (budget) {
            summary += `<p><strong>Budget:</strong> ₹${budget}</p>`;
        }
        
        // Calculate estimated price
        const basePrice = getBasePrice(serviceType, carType);
        const totalPrice = basePrice * parseInt(duration);
        
        if (basePrice > 0) {
            summary += `<div style="margin-top: 1rem; padding: 1rem; background: #1e3a8a; color: white; border-radius: 8px; text-align: center;">
                <strong>Estimated Total: ₹${totalPrice}</strong>
            </div>`;
        }
        
        summary += '</div>';
        summaryContent.innerHTML = summary;
    } else {
        summaryContent.innerHTML = '<p>Fill the form to see booking details</p>';
    }
}

// Get Base Price for Services
function getBasePrice(serviceType, carType) {
    const prices = {
        'hourly': { 'economy': 200, 'premium': 350, 'luxury': 500, 'suv': 600 },
        'daily': { 'economy': 188, 'premium': 313, 'luxury': 438, 'suv': 563 }, // 8 hour average
        'airport': { 'economy': 800, 'premium': 1200, 'luxury': 1800, 'suv': 2000 },
        'outstation': { 'economy': 2000, 'premium': 3200, 'luxury': 4500, 'suv': 5000 },
        'wedding': { 'economy': 400, 'premium': 600, 'luxury': 800, 'suv': 1000 }
    };
    
    return prices[serviceType]?.[carType] || 0;
}

// Feedback Form Submission
function handleFeedbackSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get('customerName');
    const email = formData.get('customerEmail');
    const rating = formData.get('rating');
    const feedback = formData.get('feedback');
    
    if (!name || !email || !rating || !feedback) {
        alert('Please fill in all fields.');
        return;
    }
    
    // Show confirmation
    if (confirm(`Thank you ${name}! 
    
Your ${rating}-star rating and feedback will help us improve our services.

Submit this feedback?`)) {
        
        // Simulate submission
        setTimeout(() => {
            alert(`🌟 Feedback Submitted Successfully! 🌟

Thank you ${name} for your ${rating}-star rating!

We've received your feedback and will use it to enhance our services.

A confirmation has been sent to ${email}.`);
            
            // Reset form
            e.target.reset();
        }, 1000);
    }
}

// Form Reset Function
function resetForm() {
    if (confirm('Are you sure you want to reset the form? All entered data will be lost.')) {
        const form = document.getElementById('bookingForm');
        form.reset();
        updateBookingSummary();
        alert('Form has been reset successfully.');
    }
}

// Email Validation
function validateEmail(input) {
    const email = input.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && !emailRegex.test(email)) {
        input.setCustomValidity('Please enter a valid email address');
        input.style.borderColor = 'var(--warning-red)';
        return false;
    } else {
        input.setCustomValidity('');
        input.style.borderColor = 'var(--success-green)';
        return true;
    }
}

// Phone Validation
function validatePhone(input) {
    const phone = input.value.replace(/\s/g, '');
    const phoneRegex = /^[0-9]{10}$/;
    
    if (phone && !phoneRegex.test(phone)) {
        input.setCustomValidity('Please enter a valid 10-digit phone number');
        input.style.borderColor = 'var(--warning-red)';
        return false;
    } else {
        input.setCustomValidity('');
        input.style.borderColor = 'var(--success-green)';
        return true;
    }
}

// Date Validation
function validateDate(input) {
    const selectedDate = new Date(input.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        input.setCustomValidity('Please select a future date');
        input.style.borderColor = 'var(--warning-red)';
        return false;
    } else {
        input.setCustomValidity('');
        input.style.borderColor = 'var(--success-green)';
        return true;
    }
}

// Terms and Conditions Modal
function showTerms() {
    const terms = `
RIDE - Terms and Conditions

1. BOOKING AND RESERVATION
- All bookings are subject to availability
- Advance booking recommended
- Booking confirmation will be sent via email/SMS

2. PAYMENT TERMS
- Payment due at time of service
- Cancellation charges may apply
- Refunds processed within 7 business days

3. VEHICLE CONDITIONS
- Vehicles inspected before each rental
- Customer responsible for any damages
- Fuel policy as per selected package

4. CUSTOMER RESPONSIBILITIES
- Valid driving license required
- Minimum age: 21 years
- Follow all traffic regulations

5. LIABILITY
- Comprehensive insurance included
- Customer liable for violations
- RIDE not responsible for personal belongings

By booking with RIDE, you agree to these terms and conditions.
    `;
    
    alert(terms);
}

// Privacy Policy Modal
function showPrivacy() {
    const privacy = `
RIDE - Privacy Policy

1. INFORMATION COLLECTION
- Personal details for booking purposes
- Contact information for service delivery
- Payment information for transaction processing

2. DATA USAGE
- Service delivery and customer support
- Marketing communications (with consent)
- Service improvement and analytics

3. DATA PROTECTION
- Secure data storage and transmission
- No sharing with unauthorized third parties
- Regular security audits and updates

4. YOUR RIGHTS
- Access to your personal data
- Right to update or delete information
- Opt-out of marketing communications

Contact us at privacy@ride.com for any privacy concerns.
    `;
    
    alert(privacy);
}

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const time = new Date();
    time.setHours(hours, minutes);
    return time.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // In production, you might want to send error reports to a logging service
});

// Page Load Performance
window.addEventListener('load', function() {
    // Hide loading spinner if exists
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.display = 'none';
    }
    
    // Initialize tooltips or other UI enhancements
    initializeTooltips();
});

function initializeTooltips() {
    // Add tooltips to form fields
    const tooltips = {
        'fullName': 'Enter your full name as per ID proof',
        'email': 'We will send booking confirmation to this email',
        'phone': 'Enter 10-digit mobile number for SMS updates',
        'pickupLocation': 'Enter complete pickup address with landmarks',
        'budget': 'Adjust slider to set your preferred budget range'
    };
    
    Object.keys(tooltips).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.title = tooltips[id];
        }
    });
}

// Accessibility Features
document.addEventListener('keydown', function(e) {
    // ESC key to close modals or reset forms
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            activeModal.classList.remove('active');
        }
    }
    
    // Enter key on buttons
    if (e.key === 'Enter' && e.target.classList.contains('btn-primary')) {
        e.target.click();
    }
});

// Print functionality
function printBookingDetails() {
    const printContent = document.querySelector('.booking-summary');
    if (printContent) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>RIDE - Booking Summary</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        h1 { color: #1e3a8a; }
                        .summary-details { margin: 20px 0; }
                        .summary-details p { margin: 10px 0; }
                    </style>
                </head>
                <body>
                    <h1>RIDE - Booking Summary</h1>
                    ${printContent.innerHTML}
                    <p><small>Generated on: ${new Date().toLocaleString()}</small></p>
                </body>
            </html>
        `);
        printWindow.print();
        printWindow.close();
    }
}

// Initialize on different pages
function initializePage() {
    const currentPage = window.location.pathname.split('/').pop();
    
    switch(currentPage) {
        case 'index.html':
        case '':
            initializeHomePage();
            break;
        case 'booking.html':
            initializeBookingPage();
            break;
        case 'fleet.html':
            initializeFleetPage();
            break;
        case 'services.html':
            initializeServicesPage();
            break;
        case 'about.html':
            initializeAboutPage();
            break;
    }
}

function initializeHomePage() {
    // Add hero image cycling
    const heroImages = [
        'images/hero-car.jpg',
        'images/car1.jpg',
        'images/car2.jpg',
        'images/car3.jpg'
    ];
    
    let currentImageIndex = 0;
    const heroImg = document.getElementById('hero-car');
    
    if (heroImg) {
        setInterval(() => {
            currentImageIndex = (currentImageIndex + 1) % heroImages.length;
            heroImg.style.opacity = '0';
            setTimeout(() => {
                heroImg.src = heroImages[currentImageIndex];
                heroImg.style.opacity = '1';
            }, 300);
        }, 5000);
    }
}

function initializeBookingPage() {
    // Set minimum date to today
    const pickupDate = document.getElementById('pickupDate');
    if (pickupDate) {
        const today = new Date().toISOString().split('T')[0];
        pickupDate.min = today;
    }
    
    // Auto-populate if car was selected
    if (bookingData.selectedCar) {
        const carTypeSelect = document.getElementById('carType');
        if (carTypeSelect) {
            const carCategories = {
                'Maruti Swift': 'economy',
                'Hyundai i20': 'economy',
                'Honda City': 'premium',
                'Toyota Camry': 'premium',
                'BMW 3 Series': 'luxury',
                'Audi Q5': 'luxury'
            };
            
            carTypeSelect.value = carCategories[bookingData.selectedCar] || '';
            updateBookingSummary();
        }
    }
}

function initializeFleetPage() {
    // Add image lazy loading
    const carImages = document.querySelectorAll('.car-image');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                // In a real application, you would replace data-src with src
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    carImages.forEach(img => imageObserver.observe(img));
}

function initializeServicesPage() {
    // Add interactive pricing calculator
    const priceCalculator = document.querySelector('.pricing-table');
    if (priceCalculator) {
        priceCalculator.addEventListener('click', function(e) {
            if (e.target.tagName === 'TD' && e.target.textContent.includes('₹')) {
                const price = e.target.textContent;
                const service = e.target.parentElement.querySelector('td:first-child').textContent;
                const category = priceCalculator.querySelector(`th:nth-child(${e.target.cellIndex + 1})`).textContent;
                
                if (confirm(`Selected: ${service} - ${category}\nPrice: ${price}\n\nWould you like to book this service?`)) {
                    window.location.href = 'booking.html';
                }
            }
        });
    }
}

function initializeAboutPage() {
    // Add team member interaction
    const teamMembers = document.querySelectorAll('.team-member');
    teamMembers.forEach(member => {
        member.addEventListener('click', function() {
            const name = this.querySelector('h4').textContent;
            const role = this.querySelector('p strong').textContent;
            const description = this.querySelectorAll('p')[1].textContent;
            
            alert(`${name}\n${role}\n\n${description}\n\nConnect with our team for personalized service!`);
        });
    });
}

// Call page-specific initialization
document.addEventListener('DOMContentLoaded', initializePage);

// Service Worker Registration (for offline functionality)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // In a real application, you would register a service worker here
        // navigator.serviceWorker.register('/sw.js');
    });
}

// Analytics and Tracking (placeholder)
function trackEvent(eventName, properties) {
    // In a real application, you would send analytics data here
    console.log('Track Event:', eventName, properties);
}

// Track form interactions
document.addEventListener('change', function(e) {
    if (e.target.form && e.target.form.id === 'bookingForm') {
        trackEvent('booking_form_interaction', {
            field: e.target.name,
            value: e.target.value
        });
    }
});

// Track button clicks
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-primary') || e.target.classList.contains('btn-secondary')) {
        trackEvent('button_click', {
            button_text: e.target.textContent,
            page: window.location.pathname
        });
    }
});