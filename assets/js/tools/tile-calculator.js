// Tile Calculator
(function() {
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Tile Calculator</h2>
            <form id="tileForm" class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div class="input-group"><label>Area Length (ft)</label><input type="number" id="areaL" min="1" value="10" step="0.5" required></div>
                    <div class="input-group"><label>Area Width (ft)</label><input type="number" id="areaW" min="1" value="8" step="0.5" required></div>
                </div>
                <div class="input-group">
                    <label>Tile Size</label>
                    <select id="tileSize">
                        <option value="1">12×12 in (1 sq ft)</option>
                        <option value="1.78">16×16 in (1.78 sq ft)</option>
                        <option value="2.25" selected>18×18 in (2.25 sq ft)</option>
                        <option value="4">24×24 in (4 sq ft)</option>
                        <option value="0.69">6×12 in subway (0.5 sq ft)</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Waste Factor</label>
                    <select id="waste">
                        <option value="10" selected>10% (standard straight lay)</option>
                        <option value="15">15% (diagonal/herringbone)</option>
                        <option value="20">20% (complex pattern)</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Price per Tile ($)</label>
                    <input type="number" id="pricePerTile" min="0" value="3.50" step="0.25">
                </div>
                <button type="submit" class="btn-primary w-full">Calculate Tiles</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Tile Installation Guide</h2>
            <div class="pro-tip mb-6">
                <h4 class="font-bold mb-2">💡 Pro Tip</h4>
                <p>Always buy 10-15% extra tiles for cuts, breakage, and future replacements. Tile dye lots vary — you can't always match later.</p>
            </div>
            <h3 class="text-2xl font-bold mt-6 mb-3">Additional Supplies</h3>
            <ul class="list-disc pl-6 space-y-2">
                <li><strong>Thinset mortar:</strong> ~50 sq ft per 50-lb bag</li>
                <li><strong>Grout:</strong> ~25 sq ft per bag (varies by joint width)</li>
                <li><strong>Tile spacers:</strong> 1 bag per 100 sq ft</li>
                <li><strong>Backer board:</strong> needed for wet areas</li>
            </ul>
        `
    };

    function calculate(e) {
        e.preventDefault();
        const area = parseFloat(document.getElementById('areaL').value) * parseFloat(document.getElementById('areaW').value);
        const tileSize = parseFloat(document.getElementById('tileSize').value);
        const waste = parseFloat(document.getElementById('waste').value) / 100;
        const price = parseFloat(document.getElementById('pricePerTile').value);
        const tilesNeeded = Math.ceil((area * (1 + waste)) / tileSize);
        const totalCost = (tilesNeeded * price).toFixed(2);
        const thinsetBags = Math.ceil(area / 50);
        const groutBags = Math.ceil(area / 25);

        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-3xl font-bold mb-4">${tilesNeeded} Tiles Needed</h3>
            <div class="bg-white bg-opacity-20 rounded-lg p-4">
                <div class="space-y-2">
                    <div class="flex justify-between"><span>Area:</span><span>${area.toFixed(0)} sq ft</span></div>
                    <div class="flex justify-between"><span>+ Waste:</span><span>${(area * waste).toFixed(0)} sq ft</span></div>
                    <div class="flex justify-between"><span>Tiles:</span><span>${tilesNeeded} tiles</span></div>
                    <div class="border-t border-white pt-2 flex justify-between font-bold"><span>Tile cost:</span><span>$${totalCost}</span></div>
                    <div class="text-sm mt-2 opacity-80">Also need: ~${thinsetBags} bag(s) thinset, ~${groutBags} bag(s) grout</div>
                </div>
            </div>
        `;
    }

    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('tileForm').addEventListener('submit', calculate);
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
