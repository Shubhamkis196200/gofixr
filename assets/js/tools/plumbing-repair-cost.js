// Plumbing Repair Cost Estimator
(function() {
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Calculate Your Project Cost</h2>
            <form id="costForm" class="space-y-4">
                <div class="input-group">
                    <label>Project Size (sq ft)</label>
                    <input type="number" id="sqft" min="1" value="100" required>
                </div>
                <div class="input-group">
                    <label>Quality Level</label>
                    <select id="quality">
                        <option value="budget">Budget (Basic materials)</option>
                        <option value="standard" selected>Standard (Mid-grade)</option>
                        <option value="premium">Premium (High-end)</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Location Type</label>
                    <select id="location">
                        <option value="rural">Rural</option>
                        <option value="suburban" selected>Suburban</option>
                        <option value="urban">Urban</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Include Labor?</label>
                    <select id="labor">
                        <option value="yes" selected>Yes - Full Installation</option>
                        <option value="no">No - DIY (Materials Only)</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary w-full">Calculate Cost</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        
        education: `
            <h2 class="text-3xl font-bold mb-4">Understanding Project Costs</h2>
            <div class="pro-tip mb-6">
                <h4 class="font-bold mb-2">💡 Pro Tip</h4>
                <p>Get at least 3 quotes from licensed contractors. Costs vary by region.</p>
            </div>
            <h3 class="text-2xl font-bold mt-6 mb-3">Cost Breakdown</h3>
            <ul class="list-disc pl-6 space-y-2 my-4">
                <li><strong>Materials:</strong> 40-60% of total cost</li>
                <li><strong>Labor:</strong> 30-50% of total cost</li>
                <li><strong>Permits:</strong> 5-10% of total cost</li>
            </ul>
        `
    };

    function calculate(e) {
        e.preventDefault();
        const sqft = parseFloat(document.getElementById('sqft').value);
        const quality = document.getElementById('quality').value;
        const location = document.getElementById('location').value;
        const labor = document.getElementById('labor').value;
        
        const baseCosts = { budget: 15, standard: 30, premium: 60 };
        let costPerSqft = baseCosts[quality];
        const locationMult = { rural: 0.85, suburban: 1.0, urban: 1.25 };
        costPerSqft *= locationMult[location];
        
        let materialCost = sqft * costPerSqft * 0.5;
        let laborCost = labor === 'yes' ? sqft * costPerSqft * 0.5 : 0;
        let totalCost = materialCost + laborCost;
        const contingency = totalCost * 0.1;
        
        displayResult({ sqft, materialCost, laborCost, contingency, totalCost, quality, location });
    }

    function displayResult(d) {
        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-3xl font-bold mb-4">Estimated Cost: $${d.totalCost.toLocaleString('en-US', {maximumFractionDigits: 0})}</h3>
            <div class="bg-white bg-opacity-20 rounded-lg p-4">
                <div class="space-y-2">
                    <div class="flex justify-between"><span>Materials:</span><span class="font-bold">$${d.materialCost.toLocaleString()}</span></div>
                    ${d.laborCost > 0 ? `<div class="flex justify-between"><span>Labor:</span><span class="font-bold">$${d.laborCost.toLocaleString()}</span></div>` : ''}
                    <div class="flex justify-between"><span>Contingency:</span><span class="font-bold">$${d.contingency.toLocaleString()}</span></div>
                </div>
            </div>
        `;
    }

    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('costForm').addEventListener('submit', calculate);
    loadRelatedTools('cost');
})();

function loadRelatedTools(category) {
    fetch('../tools-data.json').then(r => r.json()).then(tools => {
        const related = tools.filter(t => t.category === category).slice(0, 3);
        document.getElementById('relatedTools').innerHTML = related.map(t => `
            <a href="${t.slug}.html" class="tool-card block">
                <div class="text-3xl mb-2">${t.icon}</div>
                <h4 class="font-bold text-lg mb-1">${t.name}</h4>
                <p class="text-sm text-gray-600">${t.desc}</p>
            </a>
        `).join('');
    });
}
