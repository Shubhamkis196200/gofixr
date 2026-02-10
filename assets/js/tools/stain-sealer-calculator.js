// Stain & Sealer Calculator
(function() {
    const products = {
        'deck-stain': { name: 'Deck Stain (semi-transparent)', coverage: 250, coats: 2, price: 35 },
        'deck-stain-solid': { name: 'Deck Stain (solid)', coverage: 200, coats: 2, price: 40 },
        'fence-stain': { name: 'Fence Stain', coverage: 200, coats: 1, price: 30 },
        'concrete-sealer': { name: 'Concrete Sealer', coverage: 300, coats: 2, price: 45 },
        'wood-sealer': { name: 'Clear Wood Sealer', coverage: 275, coats: 1, price: 28 },
        'paver-sealer': { name: 'Paver Sealer', coverage: 200, coats: 2, price: 50 },
        'waterproofing': { name: 'Waterproofing Sealer', coverage: 125, coats: 2, price: 55 }
    };

    const surfaces = {
        'smooth': { name: 'Smooth (planed wood, concrete)', factor: 1.0 },
        'rough': { name: 'Rough-Sawn / Textured', factor: 1.3 },
        'weathered': { name: 'Weathered / Porous', factor: 1.5 },
        'new': { name: 'New / Previously Sealed', factor: 0.9 }
    };

    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Stain & Sealer Calculator</h2>
            <p class="text-gray-600 mb-4">Calculate gallons of stain or sealer needed based on surface area, product type, and surface condition.</p>
            <form id="planningForm" class="space-y-4">
                <div class="input-group">
                    <label>Total Surface Area (sq ft)</label>
                    <input type="number" id="sqft" min="1" value="300" step="1" required>
                    <small class="text-gray-500">Deck: length × width. Fence: length × height × 2 sides.</small>
                </div>
                <div class="input-group">
                    <label>Product Type</label>
                    <select id="product">
                        ${Object.entries(products).map(([k,v]) => `<option value="${k}">${v.name} (~${v.coverage} sq ft/gal, ${v.coats} coat${v.coats>1?'s':''})</option>`).join('')}
                    </select>
                </div>
                <div class="input-group">
                    <label>Surface Condition</label>
                    <select id="surface">
                        ${Object.entries(surfaces).map(([k,v]) => `<option value="${k}"${k==='smooth'?' selected':''}>${v.name}</option>`).join('')}
                    </select>
                </div>
                <button type="submit" class="btn-primary w-full">Calculate Gallons Needed</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Stain & Sealer Guide</h2>
            <div class="pro-tip mb-6">
                <h4 class="font-bold mb-2">💡 Pro Tip</h4>
                <p>Always do a test patch. Coverage varies wildly by wood species — cedar soaks up 50% more than pressure-treated pine.</p>
            </div>
            <h3 class="text-2xl font-bold mt-6 mb-3">Coverage Factors</h3>
            <ul class="list-disc pl-6 space-y-2">
                <li><strong>Smooth surfaces:</strong> Standard coverage per label</li>
                <li><strong>Rough-sawn:</strong> 25-30% more product needed</li>
                <li><strong>Weathered/porous:</strong> 40-50% more — first coat absorbs heavily</li>
                <li><strong>Previously sealed:</strong> ~10% less if surface is still in fair condition</li>
            </ul>
            <h3 class="text-2xl font-bold mt-6 mb-3">Prep Matters</h3>
            <p>Power wash and let dry 48+ hours before applying. Staining damp wood traps moisture and causes peeling.</p>
        `
    };

    function calculate(e) {
        e.preventDefault();
        const sqft = parseFloat(document.getElementById('sqft').value);
        const prodKey = document.getElementById('product').value;
        const surfKey = document.getElementById('surface').value;
        const prod = products[prodKey];
        const surf = surfaces[surfKey];

        const adjustedCoverage = prod.coverage / surf.factor;
        const gallonsPerCoat = sqft / adjustedCoverage;
        const totalGallons = gallonsPerCoat * prod.coats;
        const gallonsToOrder = Math.ceil(totalGallons);
        const totalCost = gallonsToOrder * prod.price;

        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-3xl font-bold mb-4">You Need: ${gallonsToOrder} Gallon${gallonsToOrder>1?'s':''}</h3>
            <div class="bg-white bg-opacity-20 rounded-lg p-4">
                <div class="space-y-2">
                    <div class="flex justify-between"><span>Surface area:</span><span>${sqft.toLocaleString()} sq ft</span></div>
                    <div class="flex justify-between"><span>Product:</span><span>${prod.name}</span></div>
                    <div class="flex justify-between"><span>Surface:</span><span>${surf.name}</span></div>
                    <div class="flex justify-between"><span>Adjusted coverage:</span><span>${adjustedCoverage.toFixed(0)} sq ft/gal</span></div>
                    <div class="flex justify-between"><span>Per coat:</span><span>${gallonsPerCoat.toFixed(1)} gal</span></div>
                    <div class="flex justify-between"><span>Number of coats:</span><span>${prod.coats}</span></div>
                    <div class="border-t border-white border-opacity-30 my-2 pt-2"></div>
                    <div class="flex justify-between"><span>Total needed:</span><span>${totalGallons.toFixed(1)} gal</span></div>
                    <div class="flex justify-between"><span>Order (rounded up):</span><span class="font-bold">${gallonsToOrder} gal</span></div>
                    <div class="flex justify-between"><span>Est. cost (~$${prod.price}/gal):</span><span class="font-bold">$${totalCost}</span></div>
                </div>
            </div>
        `;
    }

    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('planningForm').addEventListener('submit', calculate);
    loadRelatedTools('planning');
})();
