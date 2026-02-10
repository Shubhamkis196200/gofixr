// Fence Installation Cost Estimator — per-linear-foot with gate, post, and terrain calculations
(function() {
    const fenceTypes = {
        wood4:    { name: '4ft Wood Privacy', matPerFt: 12, labPerFt: 8, lifespan: 15 },
        wood6:    { name: '6ft Wood Privacy', matPerFt: 18, labPerFt: 10, lifespan: 15 },
        cedar6:   { name: '6ft Cedar Privacy', matPerFt: 25, labPerFt: 10, lifespan: 25 },
        chainlink:{ name: 'Chain Link (4ft)', matPerFt: 7, labPerFt: 5, lifespan: 20 },
        vinyl:    { name: 'Vinyl Privacy (6ft)', matPerFt: 22, labPerFt: 8, lifespan: 30 },
        aluminum: { name: 'Aluminum Ornamental', matPerFt: 28, labPerFt: 10, lifespan: 40 },
        composite:{ name: 'Composite (6ft)', matPerFt: 30, labPerFt: 12, lifespan: 30 },
        wrought:  { name: 'Wrought Iron', matPerFt: 28, labPerFt: 15, lifespan: 50 }
    };
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Fence Installation Cost Estimator</h2>
            <form id="costForm" class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div class="input-group"><label>Total Fence Length (linear ft)</label><input type="number" id="length" min="10" value="150" step="5" required>
                        <p class="text-xs text-gray-500 mt-1">Average backyard: 100-200 LF</p>
                    </div>
                    <div class="input-group"><label>Fence Type</label>
                        <select id="fenceType"><option value="wood6" selected>6ft Wood Privacy</option><option value="wood4">4ft Wood Privacy</option><option value="cedar6">6ft Cedar Privacy</option><option value="chainlink">Chain Link (4ft)</option><option value="vinyl">Vinyl Privacy (6ft)</option><option value="aluminum">Aluminum Ornamental</option><option value="composite">Composite (6ft)</option><option value="wrought">Wrought Iron</option></select>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="input-group"><label>Number of Gates</label>
                        <select id="gates"><option value="0">No gates</option><option value="1" selected>1 walk gate ($150-350)</option><option value="2">2 walk gates</option><option value="3">1 walk + 1 double/drive gate</option></select>
                    </div>
                    <div class="input-group"><label>Terrain</label>
                        <select id="terrain"><option value="1.0" selected>Flat</option><option value="1.15">Slight slope</option><option value="1.3">Hilly / stepped</option><option value="1.2">Rocky (post holes harder)</option></select>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <label class="flex items-center gap-2"><input type="checkbox" id="removal"> Remove old fence ($3-5/LF)</label>
                    <label class="flex items-center gap-2"><input type="checkbox" id="stain"> Stain/seal wood ($1.50-3/LF)</label>
                    <label class="flex items-center gap-2"><input type="checkbox" id="permit"> Building permit ($50-500)</label>
                    <label class="flex items-center gap-2"><input type="checkbox" id="concrete"> Concrete posts (vs. gravel set)</label>
                </div>
                <button type="submit" class="btn-primary w-full">Calculate Fence Cost</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Fence Installation Guide</h2>
            <p class="mb-4">Average fence installation: $1,500-$4,500 for 150 linear feet. Wood privacy fencing is the most popular choice at $15-35/linear foot installed. Before building, check your property survey, HOA rules, and local setback requirements — most municipalities require fences to be 6-12 inches inside your property line.</p>
            <div class="pro-tip mb-6"><h4 class="font-bold">💡 Pro Tip</h4><p>Call 811 (free) before digging post holes. Underground utilities can be just 18 inches deep. Hitting a gas line, fiber optic cable, or irrigation pipe turns a $3,000 project into a $15,000 disaster. Utility marking takes 2-3 business days.</p></div>
            <h3 class="text-2xl font-bold mt-6 mb-3">Post Spacing & Depth</h3>
            <ul class="list-disc pl-6 space-y-2 mb-4">
                <li>Posts every 6-8 feet (6ft for high-wind areas, 8ft for sheltered)</li>
                <li>Post depth = 1/3 of total post length (e.g., 8ft post → 2.67ft deep, round up to 3ft)</li>
                <li>Concrete footings should be 3× the post diameter and bell-shaped at the bottom</li>
                <li>Set posts slightly proud of the frost line to prevent heaving</li>
            </ul>
            <h3 class="text-2xl font-bold mt-6 mb-3">Material Longevity</h3>
            <ul class="list-disc pl-6 space-y-2">
                <li><strong>Pressure-treated pine:</strong> 15-20 years. Cheapest upfront, needs stain every 2-3 years.</li>
                <li><strong>Cedar:</strong> 20-30 years. Natural rot resistance. Turns silver-gray without stain.</li>
                <li><strong>Vinyl:</strong> 25-30 years. Zero maintenance. Can crack in extreme cold. Limited colors.</li>
                <li><strong>Aluminum/iron:</strong> 30-50 years. Best for ornamental, not privacy. Rust-proof (aluminum) or requires maintenance (iron).</li>
            </ul>
        `
    };
    function calculate(e) {
        e.preventDefault();
        const length = parseFloat(document.getElementById('length').value);
        const ft = fenceTypes[document.getElementById('fenceType').value];
        const gateVal = parseInt(document.getElementById('gates').value);
        const terrain = parseFloat(document.getElementById('terrain').value);
        const removal = document.getElementById('removal').checked;
        const stain = document.getElementById('stain').checked;
        const permit = document.getElementById('permit').checked;
        const concrete = document.getElementById('concrete').checked;
        const numPosts = Math.ceil(length / 7) + 1;
        const matCost = length * ft.matPerFt;
        const labCost = length * ft.labPerFt * terrain;
        const gateCost = gateVal === 3 ? 250 + 500 : gateVal * 250;
        const removalCost = removal ? length * 4 : 0;
        const stainCost = stain ? length * 2.25 : 0;
        const permitCost = permit ? 200 : 0;
        const concreteCost = concrete ? numPosts * 15 : 0;
        const total = Math.round(matCost + labCost + gateCost + removalCost + stainCost + permitCost + concreteCost);
        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-3xl font-bold mb-4">$${total.toLocaleString()}</h3>
            <div class="bg-white bg-opacity-20 rounded-lg p-4"><div class="space-y-2">
                <div class="flex justify-between"><span>Fence (${length} LF × ${ft.name}):</span><span>$${Math.round(matCost).toLocaleString()}</span></div>
                <div class="flex justify-between"><span>Labor:</span><span>$${Math.round(labCost).toLocaleString()}</span></div>
                <div class="flex justify-between"><span>Posts needed:</span><span>~${numPosts} posts (every 7ft)</span></div>
                ${gateCost > 0 ? `<div class="flex justify-between"><span>Gate(s):</span><span>$${gateCost}</span></div>` : ''}
                ${concreteCost > 0 ? `<div class="flex justify-between"><span>Concrete footings:</span><span>$${concreteCost}</span></div>` : ''}
                ${removalCost > 0 ? `<div class="flex justify-between"><span>Old fence removal:</span><span>$${removalCost}</span></div>` : ''}
                ${stainCost > 0 ? `<div class="flex justify-between"><span>Stain/seal:</span><span>$${Math.round(stainCost)}</span></div>` : ''}
                ${permitCost > 0 ? `<div class="flex justify-between"><span>Permit:</span><span>$${permitCost}</span></div>` : ''}
                <hr class="border-white border-opacity-30 my-2">
                <div class="flex justify-between font-bold text-lg"><span>Total:</span><span>$${total.toLocaleString()}</span></div>
                <div class="flex justify-between opacity-80"><span>Per linear foot:</span><span>$${(total/length).toFixed(2)}/LF</span></div>
                <div class="text-sm mt-2 opacity-80">Expected lifespan: ~${ft.lifespan} years</div>
            </div></div>
        `;
    }
    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('costForm').addEventListener('submit', calculate);
    loadRelatedTools('cost');
})();