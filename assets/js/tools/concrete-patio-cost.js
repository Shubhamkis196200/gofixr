// Concrete Patio Cost Estimator
(function() {
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Concrete Patio Cost Estimator</h2>
            <form id="costForm" class="space-y-4">
                <div class="input-group">
                    <label>Patio Size (sq ft)</label>
                    <input type="number" id="sqft" min="50" value="300" step="10" required>
                </div>
                <div class="input-group">
                    <label>Concrete Thickness</label>
                    <select id="thickness">
                        <option value="4">4 inches (standard patio)</option>
                        <option value="6" selected>6 inches (heavy use/vehicles)</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Finish Type</label>
                    <select id="finish">
                        <option value="broom">Broom Finish (basic)</option>
                        <option value="smooth" selected>Smooth Trowel</option>
                        <option value="stamp">Stamped/Textured</option>
                        <option value="stain">Acid Stain/Color</option>
                        <option value="polish">Polished</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Site Preparation</label>
                    <select id="prep">
                        <option value="level">Level Ground (minimal prep)</option>
                        <option value="standard" selected>Standard (some grading)</option>
                        <option value="extensive">Extensive (major grading/removal)</option>
                    </select>
                </div>
                <div class="input-group">
                    <label class="flex items-center gap-2"><input type="checkbox" id="removal"> Remove Existing Patio/Concrete</label>
                    <label class="flex items-center gap-2"><input type="checkbox" id="rebar"> Rebar Reinforcement</label>
                </div>
                <button type="submit" class="btn-primary w-full">Calculate Patio Cost</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Concrete Patio Cost Guide</h2>
            <p class="mb-4">Concrete patios cost $4-15/sqft depending on finish, averaging $1,200-$4,500 for a typical 300 sqft patio. Basic broom-finish concrete is the cheapest at $4-8/sqft, while decorative stamped or stained concrete runs $8-18/sqft. Proper site prep and base are critical for longevity.</p>
            <div class="pro-tip mb-6"><h4 class="font-bold">💡 Pro Tip</h4><p>A proper base (4-6 inches of compacted gravel) prevents cracking and settling. Skimping on base prep to save $200 often leads to $2,000+ in crack repairs within 5 years. Pay for rebar or fiber mesh reinforcement — it costs $1-2/sqft but doubles the lifespan.</p></div>
            <h3 class="text-2xl font-bold mt-6 mb-3">Concrete Finish Options</h3>
            <ul class="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Broom Finish:</strong> Simplest and cheapest. Slip-resistant texture. Utilitarian look. $4-8/sqft</li>
                <li><strong>Smooth Trowel:</strong> Clean, modern appearance. Can be slippery when wet. $5-9/sqft</li>
                <li><strong>Stamped Concrete:</strong> Mimics stone, brick, or tile patterns. Looks high-end. Requires sealing every 2-3 years. $9-16/sqft</li>
                <li><strong>Acid Stain/Color:</strong> Adds custom color. Semi-transparent marbled effect. $8-15/sqft</li>
                <li><strong>Polished:</strong> Glass-smooth finish, mostly for indoor or covered patios. $10-18/sqft</li>
            </ul>
            <h3 class="text-2xl font-bold mt-6 mb-3">Maintenance & Longevity</h3>
            <p class="mb-4">Properly installed concrete lasts 30-50+ years. Seal stamped/stained concrete every 2-3 years ($0.75-1.50/sqft). Repair cracks immediately — small cracks (<1/4") are easy DIY fixes with concrete caulk. Large cracks or settling require professional mudjacking or replacement.</p>
        `
    };
    const thicknessMulti = {4:1.0,6:1.15};
    const finishCosts = {broom:4,smooth:6,stamp:12,stain:11,polish:14};
    const prepCosts = {level:1,standard:2.5,extensive:5};
    function calculate(e) {
        e.preventDefault();
        const sqft = parseFloat(document.getElementById('sqft').value);
        const thick = document.getElementById('thickness').value;
        const finish = document.getElementById('finish').value;
        const prep = document.getElementById('prep').value;
        const removal = document.getElementById('removal').checked;
        const rebar = document.getElementById('rebar').checked;
        const concreteCost = sqft * finishCosts[finish] * thicknessMulti[thick];
        const prepCost = sqft * prepCosts[prep];
        const laborBase = sqft * 3.5;
        const removalCost = removal ? sqft * 4 : 0;
        const rebarCost = rebar ? sqft * 1.5 : 0;
        const total = concreteCost + prepCost + laborBase + removalCost + rebarCost;
        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-2xl font-bold mb-4">Concrete Patio Estimate: $${Math.round(total).toLocaleString()}</h3>
            <div class="bg-white bg-opacity-20 rounded-lg p-4"><div class="space-y-2 text-sm">
                <div class="flex justify-between"><span>Concrete (${sqft} sqft, ${thick}" thick):</span><span>$${Math.round(concreteCost).toLocaleString()}</span></div>
                <div class="flex justify-between"><span>Site Prep & Base:</span><span>$${Math.round(prepCost).toLocaleString()}</span></div>
                <div class="flex justify-between"><span>Labor (pour & finish):</span><span>$${Math.round(laborBase).toLocaleString()}</span></div>
                ${rebarCost>0?`<div class="flex justify-between"><span>Rebar Reinforcement:</span><span>$${Math.round(rebarCost).toLocaleString()}</span></div>`:''}
                ${removalCost>0?`<div class="flex justify-between"><span>Old Concrete Removal:</span><span>$${Math.round(removalCost).toLocaleString()}</span></div>`:''}
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
