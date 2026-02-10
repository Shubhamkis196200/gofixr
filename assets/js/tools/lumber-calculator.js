// Lumber Calculator
(function() {
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Lumber Calculator</h2>
            <form id="lumberForm" class="space-y-4">
                <div class="input-group">
                    <label>Lumber Size</label>
                    <select id="lumberSize">
                        <option value="2x4" selected>2×4</option>
                        <option value="2x6">2×6</option>
                        <option value="2x8">2×8</option>
                        <option value="2x10">2×10</option>
                        <option value="2x12">2×12</option>
                        <option value="4x4">4×4</option>
                    </select>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="input-group"><label>Length per piece (ft)</label><input type="number" id="pieceLen" min="1" value="8" step="1" required></div>
                    <div class="input-group"><label>Quantity needed</label><input type="number" id="qty" min="1" value="10" step="1" required></div>
                </div>
                <div class="input-group">
                    <label>Wood Type</label>
                    <select id="woodType">
                        <option value="SPF" selected>SPF (Spruce/Pine/Fir)</option>
                        <option value="PT">Pressure Treated</option>
                        <option value="Cedar">Cedar</option>
                        <option value="Doug">Douglas Fir</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary w-full">Calculate Board Feet & Cost</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Lumber Buying Guide</h2>
            <div class="pro-tip mb-6">
                <h4 class="font-bold mb-2">💡 Pro Tip</h4>
                <p>Board foot = 1" × 12" × 12". A 2×4×8' = 5.33 board feet. Nominal vs actual: a 2×4 is really 1.5" × 3.5".</p>
            </div>
            <h3 class="text-2xl font-bold mt-6 mb-3">Common Uses</h3>
            <ul class="list-disc pl-6 space-y-2">
                <li><strong>2×4:</strong> Wall framing, general framing</li>
                <li><strong>2×6:</strong> Floor joists, exterior walls, decking</li>
                <li><strong>2×8 to 2×12:</strong> Headers, beams, floor joists</li>
                <li><strong>4×4:</strong> Deck posts, fence posts</li>
            </ul>
        `
    };

    const dims = {'2x4':[2,4],'2x6':[2,6],'2x8':[2,8],'2x10':[2,10],'2x12':[2,12],'4x4':[4,4]};
    const prices = { // per linear foot estimates
        '2x4':{'SPF':0.50,'PT':0.75,'Cedar':1.50,'Doug':0.65},
        '2x6':{'SPF':0.80,'PT':1.10,'Cedar':2.25,'Doug':1.00},
        '2x8':{'SPF':1.10,'PT':1.60,'Cedar':3.00,'Doug':1.40},
        '2x10':{'SPF':1.50,'PT':2.20,'Cedar':4.00,'Doug':1.90},
        '2x12':{'SPF':2.00,'PT':3.00,'Cedar':5.50,'Doug':2.50},
        '4x4':{'SPF':1.50,'PT':2.00,'Cedar':3.50,'Doug':2.00}
    };

    function calculate(e) {
        e.preventDefault();
        const size = document.getElementById('lumberSize').value;
        const len = parseFloat(document.getElementById('pieceLen').value);
        const qty = parseInt(document.getElementById('qty').value);
        const wood = document.getElementById('woodType').value;
        const d = dims[size];
        const bf = (d[0] * d[1] * len / 12) * qty;
        const linFt = len * qty;
        const pricePerFt = prices[size][wood];
        const totalCost = (linFt * pricePerFt).toFixed(2);

        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-3xl font-bold mb-4">${qty} × ${size}×${len}' ${wood}</h3>
            <div class="bg-white bg-opacity-20 rounded-lg p-4">
                <div class="space-y-2">
                    <div class="flex justify-between"><span>Linear feet:</span><span>${linFt} ft</span></div>
                    <div class="flex justify-between"><span>Board feet:</span><span>${bf.toFixed(1)} BF</span></div>
                    <div class="flex justify-between"><span>Price/ft:</span><span>~$${pricePerFt.toFixed(2)}</span></div>
                    <div class="border-t border-white pt-2 flex justify-between font-bold"><span>Est. cost:</span><span>$${totalCost}</span></div>
                </div>
            </div>
        `;
    }

    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('lumberForm').addEventListener('submit', calculate);
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
