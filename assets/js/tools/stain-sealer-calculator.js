// Stain & Sealer Calculator
(function() {
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Calculate Materials Needed</h2>
            <form id="planningForm" class="space-y-4">
                <div class="input-group">
                    <label>Length (feet)</label>
                    <input type="number" id="length" min="1" value="10" step="0.1" required>
                </div>
                <div class="input-group">
                    <label>Width (feet)</label>
                    <input type="number" id="width" min="1" value="10" step="0.1" required>
                </div>
                <div class="input-group">
                    <label>Waste Factor</label>
                    <select id="waste">
                        <option value="5">5% - Simple</option>
                        <option value="10" selected>10% - Standard</option>
                        <option value="15">15% - Complex</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary w-full">Calculate</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Material Planning Guide</h2>
            <div class="pro-tip mb-6">
                <h4 class="font-bold mb-2">💡 Pro Tip</h4>
                <p>Always buy extra for cuts, mistakes, and future repairs.</p>
            </div>
            <h3 class="text-2xl font-bold mt-6 mb-3">Why Waste Factor?</h3>
            <ul class="list-disc pl-6 space-y-2">
                <li>Cuts and trims at edges</li>
                <li>Pattern matching</li>
                <li>Damaged pieces</li>
                <li>Future repairs</li>
            </ul>
        `
    };

    function calculate(e) {
        e.preventDefault();
        const length = parseFloat(document.getElementById('length').value);
        const width = parseFloat(document.getElementById('width').value);
        const waste = parseFloat(document.getElementById('waste').value);
        
        const sqft = length * width;
        const wasteAmt = sqft * (waste / 100);
        const total = sqft + wasteAmt;
        
        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-3xl font-bold mb-4">You Need: ${total.toFixed(1)} sq ft</h3>
            <div class="bg-white bg-opacity-20 rounded-lg p-4">
                <div class="space-y-2">
                    <div class="flex justify-between"><span>Room:</span><span>${length}' × ${width}' = ${sqft.toFixed(1)} sq ft</span></div>
                    <div class="flex justify-between"><span>Waste (${waste}%):</span><span>+${wasteAmt.toFixed(1)} sq ft</span></div>
                    <div class="border-t border-white pt-2"><span class="font-bold">Total:</span><span class="font-bold">${total.toFixed(1)} sq ft</span></div>
                </div>
            </div>
        `;
    }

    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('planningForm').addEventListener('submit', calculate);
    loadRelatedTools('planning');
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
