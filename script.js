var typed = new Typed('#element', {
    strings: ['Discover', 'Invest', 'Thrive'],
    typeSpeed: 50,
});


document.getElementById("githubBtn").addEventListener("click", function () {
    window.open("https://www.chicago.gov/content/dam/city/sites/invest_sw/rfp/11339-43_s_michigan_appraisal.pdf", "_blank");

});
document.getElementById('analysisBtn').addEventListener('click', () => {
    fetch('https://rdestroyer1.github.io/Real-estate-database/database.json')
        .then(response => response.json())
        .then(data => {
            // Example output to console
            console.log("Database Loaded:", data);

            // Create a display for properties
            let output = '<h2>Available Properties</h2><ul>';
            data.properties.forEach(prop => {
                output += `<li><strong>${prop.name}</strong> - ${prop.price} - ${prop.location}</li>`;
            });
            output += '</ul>';

            // Show it in a modal or alert
            const container = document.createElement('div');
            container.innerHTML = output;
            container.style.position = 'fixed';
            container.style.top = '50%';
            container.style.left = '50%';
            container.style.transform = 'translate(-50%, -50%)';
            container.style.background = 'white';
            container.style.padding = '20px';
            container.style.border = '2px solid black';
            container.style.zIndex = '9999';
            document.body.appendChild(container);
        })
        .catch(err => {
            console.error('Error fetching database:', err);
            alert('Unable to load real-time data.');
        });
});
