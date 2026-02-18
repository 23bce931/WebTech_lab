document.addEventListener('DOMContentLoaded', function() {
    const usernameInput = document.getElementById('username');
    const feedbackDiv = document.getElementById('usernameFeedback');
    const form = document.getElementById('registrationForm');
    const submitBtn = document.getElementById('submitBtn');

    let isUsernameAvailable = false;
    let isChecking = false;

    // Debounce function to limit API calls
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Check username availability
    async function checkUsernameAvailability(username) {
        if (username.length < 3) {
            feedbackDiv.textContent = '';
            updateFormState(false);
            return;
        }

        // Show loading state
        feedbackDiv.className = 'feedback loading';
        isChecking = true;
        submitBtn.disabled = true;

        try {
            const response = await fetch('usernames.json');
            if (!response.ok) {
                throw new Error('Failed to fetch usernames');
            }
            
            const takenUsernames = await response.json();
            
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 800));
            
            const isAvailable = !takenUsernames.includes(username.toLowerCase());
            
            // Update feedback
            feedbackDiv.textContent = isAvailable 
                ? 'Username available!' 
                : 'Username already taken';
            feedbackDiv.className = `feedback ${isAvailable ? 'available' : 'unavailable'}`;
            
            isUsernameAvailable = isAvailable;
            updateFormState(isAvailable);
            
        } catch (error) {
            feedbackDiv.textContent = 'Error checking availability';
            feedbackDiv.className = 'feedback unavailable';
            updateFormState(false);
            console.error('Username check error:', error);
        } finally {
            isChecking = false;
        }
    }

    // Update form submission state
    function updateFormState(available) {
        submitBtn.disabled = !available || isChecking;
    }

    // Debounced username check (300ms delay)
    const debouncedCheck = debounce(checkUsernameAvailability, 300);

    // Real-time username validation
    usernameInput.addEventListener('input', function() {
        const username = this.value.trim();
        debouncedCheck(username);
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!isUsernameAvailable) {
            alert('Please choose an available username.');
            return;
        }

        // Simulate successful registration
        const formData = new FormData(form);
        const userData = Object.fromEntries(formData);
        
        alert(`Registration successful!\nUsername: ${userData.username}\nEmail: ${userData.email}`);
        form.reset();
        feedbackDiv.textContent = '';
        updateFormState(false);
    });

    // Clear feedback on blur if empty
    usernameInput.addEventListener('blur', function() {
        if (!this.value.trim()) {
            feedbackDiv.textContent = '';
            updateFormState(false);
        }
    });
});
