// Contractor Comparison Checklist
(function() {
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Use This Tool</h2>
            <form id="utilityForm" class="space-y-4">
                <div class="input-group">
                    <label>Input Value</label>
                    <input type="number" id="input1" step="0.1" required>
                </div>
                <div class="input-group">
                    <label>Options</label>
                    <select id="option1">
                        <option value="standard">Standard</option>
                        <option value="advanced">Advanced</option>
                        <option value="professional">Professional</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary w-full">Calculate</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">How to Use This Tool</h2>
            <div class="pro-tip mb-6">
                <h4 class="font-bold">💡 Pro Tip</h4>
                <p>Quick estimates for planning. Verify with professionals for critical projects.</p>
            </div>
            <h3 class="text-2xl font-bold mb-3">Best Practices</h3>
            <ul class="list-disc pl-6 space-y-2">
                <li>Double-check measurements</li>
                <li>Factor safety margins</li>
                <li>Consult professionals</li>
            </ul>
        `
    };

    function calculate(e) {
        e.preventDefault();
        const input = parseFloat(document.getElementById('input1').value);
        const option = document.getElementById('option1').value;
        const mult = { standard: 1.0, advanced: 1.25, professional: 1.5 };
        const result = input * mult[option];
        
        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-3xl font-bold mb-4">Result: ${result.toFixed(2)}</h3>
            <p>Based on ${option} calculation</p>
        `;
    }

    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('utilityForm').addEventListener('submit', calculate);
    loadRelatedTools('utility');
})();

function loadRelatedTools(category) {
    fetch('../tools-data.json').then(r => r.json()).then(tools => {
        const related = tools.filter(t => t.category === category).slice(0, 3);
        document.getElementById('relatedTools').innerHTML = related.map(t => `
            <a href="${t.slug}.html" class="tool-card block">
                <div class="text-3xl mb-2">${t.icon}</div>
                <h4 class="font-bold">${t.name}</h4>
                <p class="text-sm text-gray-600">${t.desc}</p>
            </a>
        `).join('');
    });
}
