// Flooring Cost Calculator
(function() {
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Flooring Cost Calculator</h2>
            <form id="floorForm" class="space-y-4">
                <div class="input-group">
                    <label>Room Area (sq ft)</label>
                    <input type="number" id="area" min="10" value="200" step="10" required>
                </div>
                <div class="input-group">
                    <label>Flooring Material</label>
                    <select id="material">
                        <option value="lvp" selected>Luxury Vinyl Plank ($2-5/sqft)</option>
                        <option value="laminate">Laminate ($1-4/sqft)</option>
                        <option value="hardwood">Hardwood ($5-12/sqft)</option>
                        <option value="eng">Engineered Hardwood ($4-10/sqft)</option>
                        <option value="tile">Ceramic Tile ($1-6/sqft)</option>
                        <option value="carpet">Carpet ($2-7/sqft)</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Installation</label>
                    <select id="install">
                        <option value="diy">DIY</option>
                        <option value="pro" selected>Professional ($2-6/sqft)</option>
                    </select>
                </div>
                <div class="input-group">
                    <label><input type="checkbox" id="removal" checked> Include old floor removal ($1-2/sqft)</label>
                </div>
                <button type="submit" class="btn-primary w-full">Calculate Cost</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Flooring Guide</h2>
            <div class="pro-tip mb-6">
                <h4 class="font-bold mb-2">💡 Pro Tip</h4>
                <p>Buy 10% extra for cuts and waste. LVP and laminate are the most DIY-friendly. Hardwood and tile usually need a pro.</p>
            </div>
            <h3 class="text-2xl font-bold mt-6 mb-3">Best For Each Room</h3>
            <ul class="list-disc pl-6 space-y-2">
                <li><strong>Kitchen/Bath:</strong> LVP or tile (water resistant)</li>
                <li><strong>Living/Bedroom:</strong> Hardwood, LVP, or carpet</li>
                <li><strong>Basement:</strong> LVP or engineered (handles moisture)</li>
                <li><strong>High traffic:</strong> LVP or tile (most durable)</li>
            </ul>
        `
    };

    const matPrices = {
        lvp:      { low: 2, high: 5, installLow: 2, installHigh: 4 },
        laminate: { low: 1, high: 4, installLow: 1.5, installHigh: 3 },
        hardwood: { low: 5, high: 12, installLow: 3, installHigh: 6 },
        eng:      { low: 4, high: 10, installLow: 3, installHigh: 5 },
        tile:     { low: 1, high: 6, installLow: 4, installHigh: 8 },
        carpet:   { low: 2, high: 7, installLow: 1, installHigh: 2 }
    };

    function calculate(e) {
        e.preventDefault();
        const area = parseFloat(document.getElementById('area').value);
        const mat = document.getElementById('material').value;
        const isPro = document.getElementById('install').value === 'pro';
        const removal = document.getElementById('removal').checked;
        const p = matPrices[mat];

        const matLow = area * p.low;
        const matHigh = area * p.high;
        const instLow = isPro ? area * p.installLow : 0;
        const instHigh = isPro ? area * p.installHigh : 0;
        const removalCost = removal ? area * 1.5 : 0;
        const totalLow = matLow + instLow + removalCost;
        const totalHigh = matHigh + instHigh + removalCost;

        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-3xl font-bold mb-4">$${totalLow.toFixed(0)} – $${totalHigh.toFixed(0)}</h3>
            <div class="bg-white bg-opacity-20 rounded-lg p-4">
                <div class="space-y-2">
                    <div class="flex justify-between"><span>Area:</span><span>${area} sq ft</span></div>
                    <div class="flex justify-between"><span>Material:</span><span>$${matLow.toFixed(0)} – $${matHigh.toFixed(0)}</span></div>
                    ${isPro ? `<div class="flex justify-between"><span>Installation:</span><span>$${instLow.toFixed(0)} – $${instHigh.toFixed(0)}</span></div>` : '<div class="flex justify-between"><span>Installation:</span><span>DIY (free labor)</span></div>'}
                    ${removal ? `<div class="flex justify-between"><span>Old floor removal:</span><span>$${removalCost.toFixed(0)}</span></div>` : ''}
                    <div class="border-t border-white pt-2 flex justify-between font-bold"><span>Total:</span><span>$${totalLow.toFixed(0)} – $${totalHigh.toFixed(0)}</span></div>
                </div>
            </div>
        `;
    }

    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('floorForm').addEventListener('submit', calculate);
    loadRelatedTools('cost');
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
