// Roof Replacement Cost Estimator
(function() {
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Roof Replacement Cost Estimator</h2>
            <form id="costForm" class="space-y-4">
                <div class="input-group">
                    <label>Roof Area (sq ft) — or home footprint × 1.15 for typical pitch</label>
                    <input type="number" id="sqft" min="500" value="2000" step="100" required>
                </div>
                <div class="input-group">
                    <label>Roofing Material</label>
                    <select id="material">
                        <option value="3tab">3-Tab Asphalt Shingles (20-yr)</option>
                        <option value="arch" selected>Architectural Asphalt (30-yr)</option>
                        <option value="metal">Standing Seam Metal</option>
                        <option value="tile">Clay/Concrete Tile</option>
                        <option value="slate">Natural Slate</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Roof Pitch (Steepness)</label>
                    <select id="pitch">
                        <option value="low">Low (3/12 or less — walkable)</option>
                        <option value="medium" selected>Medium (4/12 to 8/12 — standard)</option>
                        <option value="steep">Steep (9/12+ — requires special equipment)</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Layers to Remove</label>
                    <select id="layers">
                        <option value="1" selected>1 layer (standard tear-off)</option>
                        <option value="2">2 layers (double tear-off)</option>
                        <option value="3">3 layers (extensive removal)</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Additional Work Needed</label>
                    <div class="space-y-2 mt-1">
                        <label class="flex items-center gap-2"><input type="checkbox" id="decking"> Replace Damaged Decking/Sheathing</label>
                        <label class="flex items-center gap-2"><input type="checkbox" id="gutters"> New Gutters</label>
                        <label class="flex items-center gap-2"><input type="checkbox" id="skylights"> Skylights (re-flash or add)</label>
                        <label class="flex items-center gap-2"><input type="checkbox" id="chimney"> Chimney Flashing</label>
                    </div>
                </div>
                <button type="submit" class="btn-primary w-full">Calculate Roof Cost</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Complete Guide to Roof Replacement Costs</h2>
            <p class="mb-4">A new roof is one of the most expensive home maintenance projects, averaging $8,000-$15,000 for a typical home with asphalt shingles. However, costs vary dramatically based on material choice, roof size, pitch, and your location. This estimator accounts for the factors that actually drive roof pricing — not just square footage.</p>
            
            <div class="pro-tip mb-6">
                <h4 class="font-bold">💡 Pro Tip</h4>
                <p>Roofing is measured in "squares" (1 square = 100 sq ft). A typical 2,000 sq ft roof is 20 squares. When getting quotes, ask contractors to break down material cost per square, labor per square, tear-off, and any additional work. This makes apples-to-apples comparison possible.</p>
            </div>
            
            <h3 class="text-2xl font-bold mt-6 mb-3">Roofing Material Lifespans & Costs</h3>
            <ul class="list-disc pl-6 space-y-2 mb-4">
                <li><strong>3-Tab Asphalt:</strong> $3.50-5.50/sqft installed. 15-20 year lifespan. Most affordable, least durable</li>
                <li><strong>Architectural Asphalt:</strong> $4.50-7.50/sqft. 25-30 year lifespan. Best value for most homes</li>
                <li><strong>Standing Seam Metal:</strong> $9-14/sqft. 40-60 year lifespan. Energy-efficient, great for snow</li>
                <li><strong>Clay/Concrete Tile:</strong> $10-18/sqft. 50+ year lifespan. Excellent in hot climates. Very heavy — may need structural reinforcement</li>
                <li><strong>Natural Slate:</strong> $15-30/sqft. 75-100+ year lifespan. Stunning but extremely expensive and heavy</li>
            </ul>
            
            <h3 class="text-2xl font-bold mt-6 mb-3">Hidden Costs to Watch For</h3>
            <p class="mb-4">The biggest surprise cost is damaged decking (plywood sheathing under shingles). Roofers can't assess this until the old roof is removed. Budget $50-75 per sheet of plywood replacement. Other extras include ice & water shield in cold climates, ridge vent installation, drip edge replacement, and valley flashing. A reputable roofer will include these in their detailed quote.</p>
            
            <h3 class="text-2xl font-bold mt-6 mb-3">Signs You Need a New Roof</h3>
            <ul class="list-disc pl-6 space-y-2 mb-4">
                <li>Shingles are curling, cracking, or missing granules</li>
                <li>Multiple active leaks or water stains on ceilings</li>
                <li>Roof is 20+ years old (for asphalt shingles)</li>
                <li>Sagging roof deck visible from outside</li>
                <li>Daylight visible through roof boards in attic</li>
            </ul>
        `
    };

    const matCosts = {'3tab':{mat:1.80,lab:2.50},'arch':{mat:2.80,lab:3.00},'metal':{mat:5.50,lab:5.00},'tile':{mat:7.00,lab:6.50},'slate':{mat:12.00,lab:10.00}};
    const pitchMult = {low:1.0,medium:1.15,steep:1.45};

    function calculate(e) {
        e.preventDefault();
        const sqft = parseFloat(document.getElementById('sqft').value);
        const mat = document.getElementById('material').value;
        const pitch = document.getElementById('pitch').value;
        const layers = parseInt(document.getElementById('layers').value);
        const mc = matCosts[mat];
        const pm = pitchMult[pitch];

        const materialCost = sqft * mc.mat;
        const laborCost = sqft * mc.lab * pm;
        const tearOff = sqft * 1.00 * layers;
        const underlayment = sqft * 0.50;
        const flashingVents = sqft * 0.35;
        const dumpster = 350 + (layers > 1 ? 200 : 0);
        const permits = 300;

        let extras = 0, extraItems = [];
        if (document.getElementById('decking').checked) { const c = sqft * 0.15 * 50; extras += c; extraItems.push({name:'Decking Repair (~15%)',cost:c}); }
        if (document.getElementById('gutters').checked) { const p = Math.sqrt(sqft)*4; const c = p * 8; extras += c; extraItems.push({name:'New Gutters',cost:c}); }
        if (document.getElementById('skylights').checked) { extras += 1500; extraItems.push({name:'Skylight Flashing',cost:1500}); }
        if (document.getElementById('chimney').checked) { extras += 500; extraItems.push({name:'Chimney Flashing',cost:500}); }

        const subtotal = materialCost + laborCost + tearOff + underlayment + flashingVents + dumpster + permits + extras;
        const contingency = subtotal * 0.10;
        const total = subtotal + contingency;
        const squares = sqft / 100;

        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-2xl font-bold mb-4">Roof Estimate: $${Math.round(total).toLocaleString()}</h3>
            <p class="text-sm mb-3">${squares.toFixed(0)} squares · ${pitch} pitch · ${layers}-layer tear-off</p>
            <div class="bg-white bg-opacity-20 rounded-lg p-4 mb-4">
                <div class="space-y-2 text-sm">
                    <div class="flex justify-between"><span>Roofing Material:</span><span>$${Math.round(materialCost).toLocaleString()}</span></div>
                    <div class="flex justify-between"><span>Labor:</span><span>$${Math.round(laborCost).toLocaleString()}</span></div>
                    <div class="flex justify-between"><span>Tear-Off & Disposal:</span><span>$${Math.round(tearOff+dumpster).toLocaleString()}</span></div>
                    <div class="flex justify-between"><span>Underlayment:</span><span>$${Math.round(underlayment).toLocaleString()}</span></div>
                    <div class="flex justify-between"><span>Flashing & Vents:</span><span>$${Math.round(flashingVents).toLocaleString()}</span></div>
                    <div class="flex justify-between"><span>Permits:</span><span>$${permits}</span></div>
                    ${extraItems.map(x=>`<div class="flex justify-between"><span>${x.name}:</span><span>$${Math.round(x.cost).toLocaleString()}</span></div>`).join('')}
                    <div class="flex justify-between"><span>10% Contingency:</span><span>$${Math.round(contingency).toLocaleString()}</span></div>
                    <hr class="border-white border-opacity-30 my-2">
                    <div class="flex justify-between text-lg font-bold"><span>Total:</span><span>$${Math.round(total).toLocaleString()}</span></div>
                    <div class="flex justify-between opacity-80"><span>Per square (100 sqft):</span><span>$${Math.round(total/squares).toLocaleString()}</span></div>
                </div>
            </div>
        `;
    }

    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('costForm').addEventListener('submit', calculate);
    loadRelatedTools('cost');
})();
