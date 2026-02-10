// Roof Replacement Cost Estimator — material-specific with pitch, square footage, and tearoff
(function() {
    const materials = {
        asphalt3:   { name: '3-Tab Asphalt Shingles', costPerSq: [90, 150], lifespan: 20, weight: 'Light' },
        asphaltArch:{ name: 'Architectural Asphalt', costPerSq: [120, 200], lifespan: 30, weight: 'Medium' },
        metal:      { name: 'Metal Roofing (steel)', costPerSq: [300, 600], lifespan: 50, weight: 'Light' },
        tile:       { name: 'Concrete/Clay Tile', costPerSq: [400, 900], lifespan: 50, weight: 'Heavy' },
        slate:      { name: 'Natural Slate', costPerSq: [800, 1500], lifespan: 100, weight: 'Heavy' },
        wood:       { name: 'Cedar Shake', costPerSq: [350, 700], lifespan: 30, weight: 'Medium' },
        tpo:        { name: 'TPO (flat/low-slope)', costPerSq: [250, 450], lifespan: 25, weight: 'Light' }
    };
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Roof Replacement Cost Estimator</h2>
            <form id="costForm" class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div class="input-group"><label>Roof Area (sq ft)</label><input type="number" id="sqft" min="800" value="2000" step="100" required>
                        <p class="text-xs text-gray-500 mt-1">Roofing pros use "squares" (1 square = 100 sqft)</p>
                    </div>
                    <div class="input-group"><label>Roof Pitch</label>
                        <select id="pitch"><option value="1.0">Low (≤4:12) — easy to walk</option><option value="1.15" selected>Medium (5-7:12) — standard</option><option value="1.3">Steep (8-12:12) — walkable with gear</option><option value="1.5">Very Steep (>12:12) — scaffolding</option></select>
                    </div>
                </div>
                <div class="input-group"><label>Roofing Material</label>
                    <select id="material"><option value="asphalt3">3-Tab Asphalt ($90-150/sq)</option><option value="asphaltArch" selected>Architectural Asphalt ($120-200/sq)</option><option value="metal">Metal Roofing ($300-600/sq)</option><option value="tile">Concrete/Clay Tile ($400-900/sq)</option><option value="slate">Natural Slate ($800-1500/sq)</option><option value="wood">Cedar Shake ($350-700/sq)</option><option value="tpo">TPO Flat Roof ($250-450/sq)</option></select>
                </div>
                <div class="input-group"><label>Roof Complexity</label>
                    <select id="complexity"><option value="1.0">Simple (1-2 planes, few penetrations)</option><option value="1.2" selected>Average (multiple planes, chimneys)</option><option value="1.4">Complex (valleys, dormers, skylights)</option></select>
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <label class="flex items-center gap-2"><input type="checkbox" id="tearoff" checked> Tear off old roof ($1-2/sqft)</label>
                    <label class="flex items-center gap-2"><input type="checkbox" id="plywood"> Replace damaged plywood (~10%)</label>
                    <label class="flex items-center gap-2"><input type="checkbox" id="underlayment" checked> Synthetic underlayment upgrade</label>
                    <label class="flex items-center gap-2"><input type="checkbox" id="iceWater"> Ice & water shield (cold climates)</label>
                </div>
                <button type="submit" class="btn-primary w-full">Calculate Roof Cost</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Roof Replacement Cost Guide</h2>
            <p class="mb-4">The average roof replacement costs $5,500-$12,000 for asphalt shingles on a 2,000 sqft roof. Roofing is priced by the "square" (100 sqft). A typical home is 15-25 squares. Material is 40% of cost, labor is 60%.</p>
            <div class="pro-tip mb-6"><h4 class="font-bold">💡 Pro Tip</h4><p>Never go with the lowest bid for roofing. A bad roof job can cost $10,000-$20,000 to fix (tear off and redo). Check references, verify insurance, and get a written warranty. Most quality roofers are booked 4-8 weeks out — if someone can "start tomorrow," that's a red flag.</p></div>
            <h3 class="text-2xl font-bold mt-6 mb-3">Roofing Material Lifespan</h3>
            <ul class="list-disc pl-6 space-y-2 mb-4">
                <li><strong>3-Tab Asphalt:</strong> 15-20 years. Cheapest option. Prone to wind damage.</li>
                <li><strong>Architectural Asphalt:</strong> 25-30 years. Most popular. Good wind/hail resistance. Best value.</li>
                <li><strong>Metal:</strong> 40-70 years. Expensive upfront but lasts 2-3× longer. Energy-efficient (reflects heat).</li>
                <li><strong>Tile:</strong> 40-50+ years. Very durable. Heavy — may require structural reinforcement.</li>
                <li><strong>Slate:</strong> 75-100+ years. Most expensive. Extremely heavy. Premium homes only.</li>
            </ul>
            <h3 class="text-2xl font-bold mt-6 mb-3">Signs You Need a New Roof</h3>
            <ul class="list-disc pl-6 space-y-2">
                <li>Shingles curling, cupping, or missing granules (balding)</li>
                <li>Missing or cracked shingles</li>
                <li>Roof age > 20 years (asphalt) or > 30 years (other)</li>
                <li>Daylight visible through roof boards (in attic)</li>
                <li>Water stains on ceiling or attic mold</li>
            </ul>
        `
    };
    function calculate(e) {
        e.preventDefault();
        const sqft = parseFloat(document.getElementById('sqft').value);
        const squares = sqft / 100;
        const pitch = parseFloat(document.getElementById('pitch').value);
        const matKey = document.getElementById('material').value;
        const complexity = parseFloat(document.getElementById('complexity').value);
        const tearoff = document.getElementById('tearoff').checked;
        const plywood = document.getElementById('plywood').checked;
        const underlayment = document.getElementById('underlayment').checked;
        const ice = document.getElementById('iceWater').checked;
        const mat = materials[matKey];
        const matLow = squares * mat.costPerSq[0];
        const matHigh = squares * mat.costPerSq[1];
        const laborLow = squares * 150 * pitch * complexity;
        const laborHigh = squares * 250 * pitch * complexity;
        const tearoffCost = tearoff ? sqft * 1.5 : 0;
        const plywoodCost = plywood ? Math.round(sqft * 0.1 * 3.5) : 0;
        const underlaymentCost = underlayment ? Math.round(squares * 80) : 0;
        const iceCost = ice ? Math.round(squares * 120) : 0;
        const permitCost = 200;
        const totalLow = Math.round(matLow + laborLow + tearoffCost + plywoodCost + underlaymentCost + iceCost + permitCost);
        const totalHigh = Math.round(matHigh + laborHigh + tearoffCost + plywoodCost + underlaymentCost + iceCost + permitCost);
        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-3xl font-bold mb-4">$${totalLow.toLocaleString()} – $${totalHigh.toLocaleString()}</h3>
            <div class="bg-white bg-opacity-20 rounded-lg p-4"><div class="space-y-2">
                <div class="flex justify-between"><span>Roof area:</span><span>${sqft.toLocaleString()} sqft (${squares.toFixed(1)} squares)</span></div>
                <div class="flex justify-between"><span>Material (${mat.name}):</span><span>$${Math.round(matLow).toLocaleString()} – $${Math.round(matHigh).toLocaleString()}</span></div>
                <div class="flex justify-between"><span>Labor:</span><span>$${Math.round(laborLow).toLocaleString()} – $${Math.round(laborHigh).toLocaleString()}</span></div>
                ${tearoffCost > 0 ? `<div class="flex justify-between"><span>Tear-off old roof:</span><span>$${tearoffCost.toLocaleString()}</span></div>` : ''}
                ${plywoodCost > 0 ? `<div class="flex justify-between"><span>Plywood replacement (~10%):</span><span>$${plywoodCost.toLocaleString()}</span></div>` : ''}
                ${underlaymentCost > 0 ? `<div class="flex justify-between"><span>Synthetic underlayment:</span><span>$${underlaymentCost.toLocaleString()}</span></div>` : ''}
                ${iceCost > 0 ? `<div class="flex justify-between"><span>Ice & water shield:</span><span>$${iceCost.toLocaleString()}</span></div>` : ''}
                <div class="flex justify-between"><span>Permit:</span><span>~$${permitCost}</span></div>
                <hr class="border-white border-opacity-30 my-2">
                <div class="flex justify-between font-bold text-lg"><span>Total:</span><span>$${totalLow.toLocaleString()} – $${totalHigh.toLocaleString()}</span></div>
                <div class="flex justify-between opacity-80"><span>Per square:</span><span>$${Math.round(totalLow/squares)} – $${Math.round(totalHigh/squares)}/sq</span></div>
                <div class="text-sm mt-2 opacity-80">Expected lifespan: ${mat.lifespan} years</div>
            </div></div>
        `;
    }
    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('costForm').addEventListener('submit', calculate);
    loadRelatedTools('cost');
})();