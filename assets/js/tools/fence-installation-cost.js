// Fence Installation Cost Estimator
(function() {
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Fence Installation Cost Estimator</h2>
            <form id="costForm" class="space-y-4">
                <div class="input-group">
                    <label>Fence Length (linear feet)</label>
                    <input type="number" id="length" min="10" value="150" step="5" required>
                </div>
                <div class="input-group">
                    <label>Fence Type & Material</label>
                    <select id="material">
                        <option value="chainlink">Chain Link 4ft ($8-15/ft)</option>
                        <option value="wood4">Wood Privacy 4ft ($15-25/ft)</option>
                        <option value="wood6" selected>Wood Privacy 6ft ($20-35/ft)</option>
                        <option value="vinyl4">Vinyl Privacy 4ft ($25-40/ft)</option>
                        <option value="vinyl6">Vinyl Privacy 6ft ($30-50/ft)</option>
                        <option value="aluminum">Aluminum Decorative 4ft ($30-45/ft)</option>
                        <option value="wrought">Wrought Iron 4-6ft ($40-80/ft)</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Terrain & Soil Type</label>
                    <select id="terrain">
                        <option value="flat">Flat, Easy Digging</option>
                        <option value="standard" selected>Standard Soil</option>
                        <option value="rocky">Rocky/Clay Soil</option>
                        <option value="slope">Sloped Terrain</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Number of Gates</label>
                    <input type="number" id="gates" min="0" value="2" step="1" required>
                </div>
                <div class="input-group">
                    <label>Additional Features</label>
                    <div class="space-y-2 mt-1">
                        <label class="flex items-center gap-2"><input type="checkbox" id="removal"> Remove Existing Fence</label>
                        <label class="flex items-center gap-2"><input type="checkbox" id="concrete"> Concrete Post Footings (vs gravel)</label>
                        <label class="flex items-center gap-2"><input type="checkbox" id="stain"> Stain/Seal (wood only)</label>
                    </div>
                </div>
                <button type="submit" class="btn-primary w-full">Calculate Fence Cost</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Complete Fence Installation Cost Guide</h2>
            <p class="mb-4">A new fence enhances privacy, security, and curb appeal while clearly defining property boundaries. Average costs range from $1,500-$4,000 for a typical backyard with chain link or basic wood, up to $8,000-$15,000+ for premium materials like wrought iron or vinyl. Material choice, fence height, and terrain significantly impact total cost.</p>
            
            <div class="pro-tip mb-6">
                <h4 class="font-bold">💡 Pro Tip</h4>
                <p>Get your property surveyed before installing a fence. Building even 6 inches onto your neighbor's property can lead to expensive removal and legal issues. Most municipalities require setbacks from property lines (typically 2-6 inches) and permits for fences over 6 feet tall.</p>
            </div>
            
            <h3 class="text-2xl font-bold mt-6 mb-3">Fence Material Comparison</h3>
            <ul class="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Chain Link:</strong> Most affordable ($8-15/ft). Durable and low-maintenance but offers no privacy. Great for containing pets</li>
                <li><strong>Wood Privacy:</strong> $20-35/ft for 6ft cedar. Classic look, full privacy, but requires staining every 2-3 years. Lifespan 15-20 years</li>
                <li><strong>Vinyl:</strong> $30-50/ft. Never needs painting/staining. Won't rot or warp. Lasts 25-30 years. Best long-term value for privacy fences</li>
                <li><strong>Aluminum:</strong> $30-45/ft. Decorative/ornamental style. Low maintenance, won't rust. Good for front yards</li>
                <li><strong>Wrought Iron:</strong> $40-80/ft. Stunning curb appeal but expensive and requires periodic repainting. Lifespan 50+ years</li>
            </ul>
            
            <h3 class="text-2xl font-bold mt-6 mb-3">Installation Factors That Affect Cost</h3>
            <p class="mb-4">Post installation is the most labor-intensive part. Rocky soil or clay requires power augers or even jackhammers, adding $5-15/ft. Sloped terrain needs stepped or racked fencing, increasing material waste and labor by 20-40%. Concrete footings ($10-15 per post) are strongly recommended for vinyl and required in frost-prone areas to prevent heaving.</p>
        `
    };

    const matCosts = {chainlink:{min:8,max:15,gate:250},wood4:{min:15,max:25,gate:150},wood6:{min:20,max:35,gate:200},vinyl4:{min:25,max:40,gate:300},vinyl6:{min:30,max:50,gate:350},aluminum:{min:30,max:45,gate:400},wrought:{min:40,max:80,gate:800}};
    const terrainMult = {flat:0.9,standard:1.0,rocky:1.3,slope:1.35};

    function calculate(e) {
        e.preventDefault();
        const len = parseFloat(document.getElementById('length').value);
        const mat = document.getElementById('material').value;
        const terr = document.getElementById('terrain').value;
        const numGates = parseInt(document.getElementById('gates').value);
        const removal = document.getElementById('removal').checked;
        const concrete = document.getElementById('concrete').checked;
        const stain = document.getElementById('stain').checked;

        const mc = matCosts[mat];
        const avgCost = (mc.min + mc.max) / 2;
        const tm = terrainMult[terr];
        const fencingCost = len * avgCost * tm;
        const gatesCost = numGates * mc.gate;
        const removalCost = removal ? len * 3.5 : 0;
        const posts = Math.ceil(len / 8);
        const concreteCost = concrete ? posts * 12 : 0;
        const stainCost = (stain && mat.includes('wood')) ? len * 2.5 : 0;
        const total = fencingCost + gatesCost + removalCost + concreteCost + stainCost;

        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-2xl font-bold mb-4">Fence Estimate: $${Math.round(total).toLocaleString()}</h3>
            <div class="bg-white bg-opacity-20 rounded-lg p-4 mb-4">
                <div class="space-y-2 text-sm">
                    <div class="flex justify-between"><span>Fencing (${len} linear ft):</span><span>$${Math.round(fencingCost).toLocaleString()}</span></div>
                    ${gatesCost>0?`<div class="flex justify-between"><span>Gates (${numGates}):</span><span>$${Math.round(gatesCost).toLocaleString()}</span></div>`:''}
                    ${removalCost>0?`<div class="flex justify-between"><span>Old Fence Removal:</span><span>$${Math.round(removalCost).toLocaleString()}</span></div>`:''}
                    ${concreteCost>0?`<div class="flex justify-between"><span>Concrete Footings (${posts} posts):</span><span>$${Math.round(concreteCost).toLocaleString()}</span></div>`:''}
                    ${stainCost>0?`<div class="flex justify-between"><span>Initial Staining:</span><span>$${Math.round(stainCost).toLocaleString()}</span></div>`:''}
                    <hr class="border-white border-opacity-30 my-2">
                    <div class="flex justify-between font-bold text-lg"><span>Total:</span><span>$${Math.round(total).toLocaleString()}</span></div>
                    <div class="flex justify-between opacity-80"><span>Per linear foot:</span><span>$${(total/len).toFixed(2)}/ft</span></div>
                </div>
            </div>
        `;
    }

    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('costForm').addEventListener('submit', calculate);
    loadRelatedTools('cost');
})();
