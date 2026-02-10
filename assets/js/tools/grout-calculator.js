// Grout Calculator
(function() {
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Grout Calculator</h2>
            <form id="groutForm" class="space-y-4">
                <div class="input-group">
                    <label>Area to Grout (sq ft)</label>
                    <input type="number" id="area" min="1" value="100" step="5" required>
                </div>
                <div class="input-group">
                    <label>Tile Size</label>
                    <select id="tileSize">
                        <option value="4">4×4 inches (mosaic)</option>
                        <option value="6">6×6 inches</option>
                        <option value="12" selected>12×12 inches</option>
                        <option value="18">18×18 inches</option>
                        <option value="24">24×24 inches</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Joint Width</label>
                    <select id="jointWidth">
                        <option value="0.0625">1/16" (rectified tile)</option>
                        <option value="0.125" selected>1/8" (standard)</option>
                        <option value="0.1875">3/16"</option>
                        <option value="0.25">1/4" (wide joint)</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Tile Thickness</label>
                    <select id="tileThick">
                        <option value="0.25">1/4" (wall tile)</option>
                        <option value="0.375" selected>3/8" (standard floor)</option>
                        <option value="0.5">1/2" (porcelain)</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary w-full">Calculate Grout</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Grout Guide</h2>
            <div class="pro-tip mb-6">
                <h4 class="font-bold mb-2">💡 Pro Tip</h4>
                <p>Sanded grout for joints 1/8" and wider. Unsanded for 1/16" joints. Always seal grout in wet areas.</p>
            </div>
            <h3 class="text-2xl font-bold mt-6 mb-3">Grout Types</h3>
            <ul class="list-disc pl-6 space-y-2">
                <li><strong>Sanded:</strong> For joints 1/8" to 1/2" — stronger, less shrinkage</li>
                <li><strong>Unsanded:</strong> For joints under 1/8" — smoother finish</li>
                <li><strong>Epoxy:</strong> Waterproof, stain-proof — best for showers/kitchens</li>
            </ul>
        `
    };

    function calculate(e) {
        e.preventDefault();
        const area = parseFloat(document.getElementById('area').value);
        const tileSize = parseFloat(document.getElementById('tileSize').value);
        const jointW = parseFloat(document.getElementById('jointWidth').value);
        const thick = parseFloat(document.getElementById('tileThick').value);
        
        // Grout volume formula: (area × joint_width × tile_thickness × joint_length_per_sqft) / coverage
        // Joint length per sq ft = 2 × 12 / tileSize (linear inches of grout line per sq ft)
        const jointLengthPerSqFt = 2 * (12 / tileSize) * 12; // in inches
        const groutVolume = area * jointLengthPerSqFt * jointW * thick; // cubic inches
        const lbs = groutVolume * 0.05; // rough: ~0.05 lbs per cubic inch for dry grout
        const bags25 = Math.ceil(lbs / 25);
        const cost = (bags25 * 15).toFixed(0);

        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-3xl font-bold mb-4">${bags25} × 25-lb Bag${bags25 > 1 ? 's' : ''}</h3>
            <div class="bg-white bg-opacity-20 rounded-lg p-4">
                <div class="space-y-2">
                    <div class="flex justify-between"><span>Area:</span><span>${area} sq ft</span></div>
                    <div class="flex justify-between"><span>Grout needed:</span><span>~${lbs.toFixed(1)} lbs</span></div>
                    <div class="flex justify-between"><span>25-lb bags:</span><span>${bags25}</span></div>
                    <div class="border-t border-white pt-2 flex justify-between font-bold"><span>Est. cost:</span><span>~$${cost}</span></div>
                </div>
            </div>
        `;
    }

    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('groutForm').addEventListener('submit', calculate);
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
