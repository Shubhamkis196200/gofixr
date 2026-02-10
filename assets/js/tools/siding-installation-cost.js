// Siding Installation Cost Estimator
(function() {
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Siding Installation Cost Estimator</h2>
            <form id="costForm" class="space-y-4">
                <div class="input-group">
                    <label>Siding Area (sq ft)</label>
                    <input type="number" id="sqft" min="500" value="1800" step="100" required>
                </div>
                <div class="input-group">
                    <label>Siding Material</label>
                    <select id="material">
                        <option value="vinyl">Vinyl ($3-8/sqft)</option>
                        <option value="fiber">Fiber Cement ($6-12/sqft)</option>
                        <option value="wood">Wood ($5-10/sqft)</option>
                        <option value="metal">Metal/Aluminum ($4-9/sqft)</option>
                        <option value="brick">Brick Veneer ($8-18/sqft)</option>
                        <option value="stone">Stone Veneer ($12-25/sqft)</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Home Stories</label>
                    <select id="stories">
                        <option value="1" selected>1 Story</option>
                        <option value="2">2 Stories</option>
                        <option value="3">3 Stories</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Trim & Details</label>
                    <select id="trim">
                        <option value="minimal">Minimal (few windows/doors)</option>
                        <option value="standard" selected>Standard</option>
                        <option value="complex">Complex (many angles/features)</option>
                    </select>
                </div>
                <div class="input-group">
                    <label class="flex items-center gap-2"><input type="checkbox" id="removal" checked> Remove Old Siding</label>
                    <label class="flex items-center gap-2"><input type="checkbox" id="insulation"> Add Foam Insulation Board</label>
                </div>
                <button type="submit" class="btn-primary w-full">Calculate Siding Cost</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Siding Replacement Cost Guide</h2>
            <p class="mb-4">New siding transforms curb appeal while protecting your home from weather. Average costs: $8,000-15,000 for vinyl on a typical home, $15,000-30,000 for fiber cement, and $30,000-60,000+ for brick or stone veneer. Siding projects recoup 68-76% at resale.</p>
            <div class="pro-tip mb-6"><h4 class="font-bold">💡 Pro Tip</h4><p>Fiber cement (Hardie Board) costs 40% more than vinyl upfront but lasts 50+ years vs 20-30 for vinyl. It won't melt near grills, resists woodpeckers, and holds paint beautifully. Best long-term value for most climates.</p></div>
            <h3 class="text-2xl font-bold mt-6 mb-3">Siding Material Comparison</h3>
            <ul class="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Vinyl:</strong> Affordable, low-maintenance. Won't rot. Can crack in extreme cold. 20-30 year lifespan</li>
                <li><strong>Fiber Cement:</strong> Fire-resistant, rot-proof, paintable. Looks like wood. Requires painting every 10-15 years. 50+ years</li>
                <li><strong>Wood:</strong> Classic beauty but high maintenance. Paint/stain every 5-7 years. Vulnerable to rot and insects. 20-40 years with care</li>
                <li><strong>Metal/Aluminum:</strong> Lightweight, rust-resistant, durable. Can dent. Great for modern homes. 40+ years</li>
                <li><strong>Brick/Stone Veneer:</strong> Best durability and resale value. Minimal maintenance. Very expensive. 100+ years</li>
            </ul>
            <h3 class="text-2xl font-bold mt-6 mb-3">Installation Factors</h3>
            <p class="mb-4">Two-story homes cost 30-50% more per sqft due to scaffolding. Homes with complex architecture (dormers, gables, bay windows) increase labor 20-40%. Removing old siding adds $1-3/sqft. Installing foam board insulation ($1.50-2.50/sqft) dramatically improves energy efficiency.</p>
        `
    };
    const matCosts = {vinyl:{min:3,max:8},fiber:{min:6,max:12},wood:{min:5,max:10},metal:{min:4,max:9},brick:{min:8,max:18},stone:{min:12,max:25}};
    const storyMult = {1:1.0,2:1.35,3:1.7};
    const trimMult = {minimal:0.9,standard:1.0,complex:1.25};
    function calculate(e) {
        e.preventDefault();
        const sqft = parseFloat(document.getElementById('sqft').value);
        const mat = document.getElementById('material').value;
        const stories = document.getElementById('stories').value;
        const trim = document.getElementById('trim').value;
        const removal = document.getElementById('removal').checked;
        const insul = document.getElementById('insulation').checked;
        const mc = matCosts[mat];
        const avgCost = (mc.min + mc.max) / 2;
        const materialCost = sqft * avgCost;
        const laborBase = sqft * 3;
        const laborAdj = laborBase * storyMult[stories] * trimMult[trim];
        const removalCost = removal ? sqft * 2.0 : 0;
        const insulCost = insul ? sqft * 2.0 : 0;
        const trimCost = sqft * 0.25 * (trim === 'complex' ? 1.5 : 1.0);
        const total = materialCost + laborAdj + removalCost + insulCost + trimCost;
        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-2xl font-bold mb-4">Siding Estimate: $${Math.round(total).toLocaleString()}</h3>
            <div class="bg-white bg-opacity-20 rounded-lg p-4"><div class="space-y-2 text-sm">
                <div class="flex justify-between"><span>Siding Material (${sqft} sqft):</span><span>$${Math.round(materialCost).toLocaleString()}</span></div>
                <div class="flex justify-between"><span>Installation Labor:</span><span>$${Math.round(laborAdj).toLocaleString()}</span></div>
                <div class="flex justify-between"><span>Trim & Accessories:</span><span>$${Math.round(trimCost).toLocaleString()}</span></div>
                ${removalCost>0?`<div class="flex justify-between"><span>Old Siding Removal:</span><span>$${Math.round(removalCost).toLocaleString()}</span></div>`:''}
                ${insulCost>0?`<div class="flex justify-between"><span>Foam Insulation Board:</span><span>$${Math.round(insulCost).toLocaleString()}</span></div>`:''}
                <hr class="border-white border-opacity-30 my-2">
                <div class="flex justify-between font-bold text-lg"><span>Total:</span><span>$${Math.round(total).toLocaleString()}</span></div>
                <div class="flex justify-between opacity-80"><span>Per sq ft:</span><span>$${(total/sqft).toFixed(2)}/sqft</span></div>
            </div></div>
        `;
    }
    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('costForm').addEventListener('submit', calculate);
    loadRelatedTools('cost');
})();
