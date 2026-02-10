// Paint Calculator - Real paint estimation
(function() {
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Paint Calculator</h2>
            <form id="paintForm" class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div class="input-group">
                        <label>Room Length (ft)</label>
                        <input type="number" id="roomLength" min="1" value="12" step="0.5" required>
                    </div>
                    <div class="input-group">
                        <label>Room Width (ft)</label>
                        <input type="number" id="roomWidth" min="1" value="10" step="0.5" required>
                    </div>
                </div>
                <div class="input-group">
                    <label>Wall Height (ft)</label>
                    <input type="number" id="wallHeight" min="1" value="8" step="0.5" required>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="input-group">
                        <label>Number of Doors</label>
                        <input type="number" id="doors" min="0" value="1" required>
                    </div>
                    <div class="input-group">
                        <label>Number of Windows</label>
                        <input type="number" id="windows" min="0" value="2" required>
                    </div>
                </div>
                <div class="input-group">
                    <label>Number of Coats</label>
                    <select id="coats">
                        <option value="1">1 Coat (touch-up)</option>
                        <option value="2" selected>2 Coats (standard)</option>
                        <option value="3">3 Coats (dark to light)</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Paint Coverage</label>
                    <select id="coverage">
                        <option value="250">250 sq ft/gal (textured walls)</option>
                        <option value="350" selected>350 sq ft/gal (standard)</option>
                        <option value="400">400 sq ft/gal (smooth walls)</option>
                    </select>
                </div>
                <div class="input-group">
                    <label><input type="checkbox" id="ceiling"> Include Ceiling</label>
                </div>
                <button type="submit" class="btn-primary w-full">Calculate Paint Needed</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">How to Estimate Paint</h2>
            <div class="pro-tip mb-6">
                <h4 class="font-bold mb-2">💡 Pro Tip</h4>
                <p>One gallon covers about 350 sq ft on smooth walls. Textured surfaces need more. Always buy an extra quart for touch-ups.</p>
            </div>
            <h3 class="text-2xl font-bold mt-6 mb-3">Coverage Factors</h3>
            <ul class="list-disc pl-6 space-y-2">
                <li><strong>Standard doors</strong> = ~21 sq ft each (subtracted)</li>
                <li><strong>Standard windows</strong> = ~15 sq ft each (subtracted)</li>
                <li><strong>Dark to light</strong> color changes need primer + 2-3 coats</li>
                <li><strong>Ceiling paint</strong> is thicker — budget ~300 sq ft/gal</li>
            </ul>
            <h3 class="text-2xl font-bold mt-6 mb-3">Typical Paint Costs</h3>
            <ul class="list-disc pl-6 space-y-2">
                <li>Economy: $25-35/gallon</li>
                <li>Mid-range: $35-50/gallon</li>
                <li>Premium: $50-80/gallon</li>
            </ul>
        `
    };

    function calculate(e) {
        e.preventDefault();
        const l = parseFloat(document.getElementById('roomLength').value);
        const w = parseFloat(document.getElementById('roomWidth').value);
        const h = parseFloat(document.getElementById('wallHeight').value);
        const doors = parseInt(document.getElementById('doors').value);
        const windows = parseInt(document.getElementById('windows').value);
        const coats = parseInt(document.getElementById('coats').value);
        const coverage = parseInt(document.getElementById('coverage').value);
        const incCeiling = document.getElementById('ceiling').checked;

        const wallArea = 2 * (l + w) * h;
        const doorArea = doors * 21;
        const windowArea = windows * 15;
        let paintableArea = wallArea - doorArea - windowArea;
        if (incCeiling) paintableArea += l * w;
        const totalArea = paintableArea * coats;
        const gallons = Math.ceil(totalArea / coverage);
        const costLow = gallons * 30;
        const costHigh = gallons * 55;

        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-3xl font-bold mb-4">You Need: ${gallons} Gallon${gallons > 1 ? 's' : ''}</h3>
            <div class="bg-white bg-opacity-20 rounded-lg p-4">
                <div class="space-y-2">
                    <div class="flex justify-between"><span>Wall area:</span><span>${wallArea.toFixed(0)} sq ft</span></div>
                    <div class="flex justify-between"><span>Doors (${doors} × 21):</span><span>-${doorArea} sq ft</span></div>
                    <div class="flex justify-between"><span>Windows (${windows} × 15):</span><span>-${windowArea} sq ft</span></div>
                    ${incCeiling ? `<div class="flex justify-between"><span>Ceiling:</span><span>+${(l*w).toFixed(0)} sq ft</span></div>` : ''}
                    <div class="flex justify-between"><span>Paintable area:</span><span>${paintableArea.toFixed(0)} sq ft</span></div>
                    <div class="flex justify-between"><span>× ${coats} coat${coats > 1 ? 's' : ''}:</span><span>${totalArea.toFixed(0)} sq ft total</span></div>
                    <div class="border-t border-white pt-2 flex justify-between font-bold"><span>Gallons needed:</span><span>${gallons}</span></div>
                    <div class="flex justify-between"><span>Est. cost:</span><span>$${costLow} – $${costHigh}</span></div>
                </div>
            </div>
        `;
    }

    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('paintForm').addEventListener('submit', calculate);
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
