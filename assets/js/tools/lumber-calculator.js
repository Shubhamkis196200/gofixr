// Lumber Calculator — board feet, linear feet, cost with real lumber pricing
(function() {
    const prices = {
        '2x4':  { nominal: [1.5, 3.5],  bdftPerLf: 0.667,  prices: { pine: 0.55, cedar: 1.80, pt: 0.85, df: 0.70 }},
        '2x6':  { nominal: [1.5, 5.5],  bdftPerLf: 1.0,    prices: { pine: 0.85, cedar: 2.50, pt: 1.20, df: 1.05 }},
        '2x8':  { nominal: [1.5, 7.25], bdftPerLf: 1.333,  prices: { pine: 1.20, cedar: 3.50, pt: 1.70, df: 1.45 }},
        '2x10': { nominal: [1.5, 9.25], bdftPerLf: 1.667,  prices: { pine: 1.60, cedar: 5.00, pt: 2.30, df: 1.90 }},
        '2x12': { nominal: [1.5, 11.25],bdftPerLf: 2.0,    prices: { pine: 2.20, cedar: 6.50, pt: 3.10, df: 2.60 }},
        '4x4':  { nominal: [3.5, 3.5],  bdftPerLf: 1.333,  prices: { pine: 1.30, cedar: 3.00, pt: 1.80, df: 1.50 }},
        '4x6':  { nominal: [3.5, 5.5],  bdftPerLf: 2.0,    prices: { pine: 2.80, cedar: 5.50, pt: 3.50, df: 3.00 }},
        '1x6':  { nominal: [0.75, 5.5], bdftPerLf: 0.5,    prices: { pine: 0.70, cedar: 1.40, pt: 0.90, df: 0.80 }}
    };
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Lumber Calculator</h2>
            <p class="text-gray-600 mb-4">Calculate board feet, total cost, and weight for your lumber order.</p>
            <form id="lumberForm" class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div class="input-group"><label>Lumber Size</label>
                        <select id="size"><option value="2x4" selected>2×4</option><option value="2x6">2×6</option><option value="2x8">2×8</option><option value="2x10">2×10</option><option value="2x12">2×12</option><option value="4x4">4×4</option><option value="4x6">4×6</option><option value="1x6">1×6</option></select>
                    </div>
                    <div class="input-group"><label>Species</label>
                        <select id="species"><option value="pine" selected>SPF / Pine (cheapest)</option><option value="pt">Pressure Treated</option><option value="df">Douglas Fir</option><option value="cedar">Western Red Cedar</option></select>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="input-group"><label>Length per piece (ft)</label><input type="number" id="len" min="1" value="8" step="1" required></div>
                    <div class="input-group"><label>Quantity</label><input type="number" id="qty" min="1" value="20" step="1" required></div>
                </div>
                <div class="input-group"><label>Waste Factor</label>
                    <select id="waste"><option value="0">0% (exact cut list)</option><option value="10" selected>10% (standard)</option><option value="15">15% (complex cuts)</option><option value="20">20% (first-time DIY)</option></select>
                </div>
                <button type="submit" class="btn-primary w-full">Calculate Lumber</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Understanding Lumber Dimensions & Board Feet</h2>
            <div class="pro-tip mb-6"><h4 class="font-bold">💡 What's a Board Foot?</h4>
                <p>A board foot = 1" thick × 12" wide × 12" long (144 cubic inches). It's the standard unit for buying hardwood and pricing dimensional lumber in bulk. A 2×4×8' piece = 5.33 board feet. Formula: (Thickness × Width × Length) / 144, using nominal dimensions.</p>
            </div>
            <h3 class="text-2xl font-bold mt-6 mb-3">Nominal vs. Actual Dimensions</h3>
            <p class="mb-4">A "2×4" actually measures 1.5" × 3.5" after kiln-drying and planing. This matters for structural calculations. All actual dimensions: 2×4=1.5×3.5, 2×6=1.5×5.5, 2×8=1.5×7.25, 2×10=1.5×9.25, 2×12=1.5×11.25, 4×4=3.5×3.5.</p>
            <h3 class="text-2xl font-bold mt-6 mb-3">Choosing the Right Species</h3>
            <ul class="list-disc pl-6 space-y-2 mb-4">
                <li><strong>SPF (Spruce-Pine-Fir):</strong> Cheapest option. Good for framing, interior projects. Not rot-resistant.</li>
                <li><strong>Pressure Treated:</strong> Chemical-treated for ground contact and outdoor use. Required for decks, fence posts, sill plates. Don't burn PT lumber — toxic fumes.</li>
                <li><strong>Douglas Fir:</strong> Stronger than SPF. Excellent for structural beams, headers, and exposed framing. Beautiful grain if stained.</li>
                <li><strong>Western Red Cedar:</strong> Naturally rot and insect resistant. Premium choice for decks, fences, siding. No chemicals needed. 2-3× the price of pine.</li>
            </ul>
            <h3 class="text-2xl font-bold mt-6 mb-3">Buying Tips</h3>
            <ul class="list-disc pl-6 space-y-2">
                <li>Check every board for straightness by sighting down its length</li>
                <li>Avoid boards with large knots on edges — they weaken structural members</li>
                <li>Look for KD-HT stamp (Kiln-Dried, Heat-Treated) for interior use</li>
                <li>Buy 10-15% extra — you'll reject some boards and make cutting errors</li>
            </ul>
        `
    };
    function calculate(e) {
        e.preventDefault();
        const size = document.getElementById('size').value;
        const species = document.getElementById('species').value;
        const len = parseFloat(document.getElementById('len').value);
        const qty = parseInt(document.getElementById('qty').value);
        const waste = parseFloat(document.getElementById('waste').value) / 100;
        const p = prices[size];
        const totalQty = Math.ceil(qty * (1 + waste));
        const totalLinFt = totalQty * len;
        const totalBdFt = totalLinFt * p.bdftPerLf;
        const pricePerLf = p.prices[species];
        const totalCost = totalLinFt * pricePerLf;
        const weightPerBdFt = species === 'cedar' ? 2.0 : species === 'pt' ? 3.5 : 2.8;
        const totalWeight = totalBdFt * weightPerBdFt;
        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-3xl font-bold mb-4">${totalQty} Pieces — ${totalBdFt.toFixed(1)} Board Feet</h3>
            <div class="bg-white bg-opacity-20 rounded-lg p-4"><div class="space-y-2">
                <div class="flex justify-between"><span>Size:</span><span>${size} × ${len}ft</span></div>
                <div class="flex justify-between"><span>Actual dimensions:</span><span>${p.nominal[0]}" × ${p.nominal[1]}"</span></div>
                <div class="flex justify-between"><span>Pieces (incl. waste):</span><span>${totalQty}</span></div>
                <div class="flex justify-between"><span>Total linear feet:</span><span>${totalLinFt} LF</span></div>
                <div class="flex justify-between"><span>Board feet:</span><span>${totalBdFt.toFixed(1)} BF</span></div>
                <div class="flex justify-between"><span>Est. weight:</span><span>${Math.round(totalWeight)} lbs</span></div>
                <hr class="border-white border-opacity-30 my-2">
                <div class="flex justify-between"><span>Price per LF:</span><span>$${pricePerLf.toFixed(2)}</span></div>
                <div class="flex justify-between font-bold text-lg"><span>Total cost:</span><span>$${totalCost.toFixed(2)}</span></div>
            </div></div>
        `;
    }
    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('lumberForm').addEventListener('submit', calculate);
    loadRelatedTools('planning');
})();