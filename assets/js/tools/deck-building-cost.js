// Deck Building Cost Estimator
(function() {
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Deck Building Cost Estimator</h2>
            <form id="costForm" class="space-y-4">
                <div class="input-group">
                    <label>Deck Size (sq ft)</label>
                    <input type="number" id="sqft" min="50" value="300" step="10" required>
                </div>
                <div class="input-group">
                    <label>Decking Material</label>
                    <select id="material">
                        <option value="pt">Pressure-Treated Wood ($3-6/sqft)</option>
                        <option value="cedar" selected>Cedar ($5-9/sqft)</option>
                        <option value="composite">Composite ($8-14/sqft)</option>
                        <option value="pvc">PVC Decking ($9-16/sqft)</option>
                        <option value="ipe">Ipe/Exotic Hardwood ($12-20/sqft)</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Deck Height Above Ground</label>
                    <select id="height">
                        <option value="ground">Ground Level (0-2 ft)</option>
                        <option value="low" selected>Low (2-4 ft)</option>
                        <option value="elevated">Elevated (4-8 ft)</option>
                        <option value="second">Second Story (8+ ft)</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Railing Type</label>
                    <select id="railing">
                        <option value="none">No Railing</option>
                        <option value="wood" selected>Wood Railing</option>
                        <option value="composite">Composite Railing</option>
                        <option value="cable">Cable Railing</option>
                        <option value="glass">Glass Panel Railing</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Additional Features</label>
                    <div class="space-y-2 mt-1">
                        <label class="flex items-center gap-2"><input type="checkbox" id="stairs" checked> Built-in Stairs</label>
                        <label class="flex items-center gap-2"><input type="checkbox" id="lighting"> Deck Lighting</label>
                        <label class="flex items-center gap-2"><input type="checkbox" id="pergola"> Pergola/Shade Structure</label>
                        <label class="flex items-center gap-2"><input type="checkbox" id="builtin"> Built-in Seating/Planters</label>
                    </div>
                </div>
                <button type="submit" class="btn-primary w-full">Calculate Deck Cost</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Complete Guide to Deck Building Costs</h2>
            <p class="mb-4">A new deck is one of the best outdoor investments you can make, extending your living space and adding 65-75% of its cost in home value. The national average cost for a new deck is $7,700-$10,500 for a basic 12×20 ft pressure-treated wood deck, with high-end composite builds reaching $30,000-$60,000+ for larger multi-level designs.</p>
            
            <div class="pro-tip mb-6">
                <h4 class="font-bold">💡 Pro Tip</h4>
                <p>The substructure (posts, beams, joists) costs roughly the same regardless of decking material. Splurging on composite or PVC decking only increases your total cost by 20-30%, not double — because you're upgrading just the surface, not the whole structure.</p>
            </div>
            
            <h3 class="text-2xl font-bold mt-6 mb-3">Cost Breakdown by Material</h3>
            <ul class="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Pressure-Treated Pine:</strong> Cheapest option at $15-25/sqft installed. Requires annual sealing/staining. Lasts 10-15 years</li>
                <li><strong>Cedar/Redwood:</strong> Natural beauty at $20-35/sqft installed. Naturally rot-resistant but needs periodic sealing. 15-20 year lifespan</li>
                <li><strong>Composite (Trex, TimberTech):</strong> $30-45/sqft installed. Virtually maintenance-free — no staining, sealing, or splinters. 25-30 year warranty</li>
                <li><strong>PVC Decking:</strong> $35-50/sqft installed. 100% synthetic, won't rot or mold even in wet climates. Lightest weight, coolest underfoot</li>
                <li><strong>Ipe/Exotic Hardwood:</strong> $40-60/sqft installed. Stunning appearance, incredibly durable (40+ years). Very hard to work with — requires specialized tools</li>
            </ul>
            
            <h3 class="text-2xl font-bold mt-6 mb-3">Don't Forget These Costs</h3>
            <ul class="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Permits:</strong> Most areas require building permits for decks ($200-$500)</li>
                <li><strong>Footings/Foundation:</strong> Concrete piers or helical piles ($50-150 per footing)</li>
                <li><strong>Demolition:</strong> Removing an old deck costs $500-$2,500</li>
                <li><strong>Design complexity:</strong> Multi-level, curved, or wraparound decks cost 50-100% more than simple rectangles</li>
            </ul>
        `
    };

    const matCosts = {pt:{min:3.5,max:6},cedar:{min:5.5,max:9},composite:{min:8,max:14},pvc:{min:9.5,max:16},ipe:{min:12,max:20}};
    const heightMult = {ground:0.85,low:1.0,elevated:1.35,second:1.7};
    const railCosts = {none:0,wood:25,composite:40,cable:60,glass:90}; // per linear ft

    function calculate(e) {
        e.preventDefault();
        const sqft = parseFloat(document.getElementById('sqft').value);
        const mat = document.getElementById('material').value;
        const height = document.getElementById('height').value;
        const railing = document.getElementById('railing').value;
        const hasStairs = document.getElementById('stairs').checked;
        const hasLighting = document.getElementById('lighting').checked;
        const hasPergola = document.getElementById('pergola').checked;
        const hasBuiltin = document.getElementById('builtin').checked;

        const mc = matCosts[mat];
        const avgMatCost = (mc.min + mc.max) / 2;
        const substructure = sqft * 8 * heightMult[height]; // framing/posts/beams
        const deckingSurface = sqft * avgMatCost;
        const perimeter = Math.sqrt(sqft) * 4; // approximate
        const railingCost = railing !== 'none' ? perimeter * 0.75 * railCosts[railing] : 0;
        const stairsCost = hasStairs ? 800 + (height === 'second' ? 2000 : height === 'elevated' ? 1200 : 400) : 0;
        const lightingCost = hasLighting ? sqft * 3 : 0;
        const pergolaCost = hasPergola ? 3500 + sqft * 0.1 * 50 : 0;
        const builtinCost = hasBuiltin ? 1500 : 0;
        const laborCost = sqft * 12 * heightMult[height];
        const permits = 350;
        const fasteners = sqft * 1.5;

        const materialTotal = deckingSurface + substructure + fasteners;
        const addonsTotal = railingCost + stairsCost + lightingCost + pergolaCost + builtinCost;
        const total = materialTotal + addonsTotal + laborCost + permits;
        const contingency = total * 0.10;
        const grandTotal = total + contingency;

        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-2xl font-bold mb-4">Deck Cost Estimate: $${Math.round(grandTotal).toLocaleString()}</h3>
            <div class="bg-white bg-opacity-20 rounded-lg p-4 mb-4">
                <div class="space-y-2 text-sm">
                    <div class="flex justify-between"><span>Decking Surface (${sqft} sqft):</span><span>$${Math.round(deckingSurface).toLocaleString()}</span></div>
                    <div class="flex justify-between"><span>Substructure & Framing:</span><span>$${Math.round(substructure).toLocaleString()}</span></div>
                    <div class="flex justify-between"><span>Hardware & Fasteners:</span><span>$${Math.round(fasteners).toLocaleString()}</span></div>
                    ${railingCost>0?`<div class="flex justify-between"><span>Railing:</span><span>$${Math.round(railingCost).toLocaleString()}</span></div>`:''}
                    ${stairsCost>0?`<div class="flex justify-between"><span>Stairs:</span><span>$${Math.round(stairsCost).toLocaleString()}</span></div>`:''}
                    ${lightingCost>0?`<div class="flex justify-between"><span>Deck Lighting:</span><span>$${Math.round(lightingCost).toLocaleString()}</span></div>`:''}
                    ${pergolaCost>0?`<div class="flex justify-between"><span>Pergola/Shade:</span><span>$${Math.round(pergolaCost).toLocaleString()}</span></div>`:''}
                    ${builtinCost>0?`<div class="flex justify-between"><span>Built-in Seating/Planters:</span><span>$${Math.round(builtinCost).toLocaleString()}</span></div>`:''}
                    <hr class="border-white border-opacity-30 my-2">
                    <div class="flex justify-between"><span>Labor (installation):</span><span>$${Math.round(laborCost).toLocaleString()}</span></div>
                    <div class="flex justify-between"><span>Permits:</span><span>$${permits}</span></div>
                    <div class="flex justify-between"><span>10% Contingency:</span><span>$${Math.round(contingency).toLocaleString()}</span></div>
                    <hr class="border-white border-opacity-30 my-2">
                    <div class="flex justify-between text-lg font-bold"><span>Total Estimate:</span><span>$${Math.round(grandTotal).toLocaleString()}</span></div>
                    <div class="flex justify-between text-sm opacity-80"><span>Cost per sq ft:</span><span>$${(grandTotal/sqft).toFixed(2)}/sqft</span></div>
                </div>
            </div>
        `;
    }

    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('costForm').addEventListener('submit', calculate);
    loadRelatedTools('cost');
})();
