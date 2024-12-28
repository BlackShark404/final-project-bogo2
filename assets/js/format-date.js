// Function to format the date into "Month YYYY" format
function formatDate(isoDate) {
    // Check if the input is just a year
    if (/^\d{4}$/.test(isoDate)) {
        return isoDate; // Return the year as is
    }
    
    // Otherwise, parse the date and format it
    const date = new Date(isoDate);
    const options = { year: 'numeric', month: 'long' };
    return new Date(date).toLocaleDateString(undefined, options);
}

// Apply formatting to all elements with the "formatted-date" class
document.addEventListener('DOMContentLoaded', () => {
    const dateElements = document.querySelectorAll('.formatted-date');
    dateElements.forEach(el => {
        const isoDate = el.getAttribute('data-date');
        if (isoDate) {
            el.textContent = formatDate(isoDate);
        }
    });
});
