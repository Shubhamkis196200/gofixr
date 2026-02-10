// Bathroom Remodel Cost Calculator — domain-specific with fixture-level breakdown
(function() {
    const fixtures = {
        vanity:    { budget: [200,400],  standard: [500,1200],  premium: [1500,4000] },
        toilet:    { budget: [100,200],  standard: [250,500],   premium: [600,1500] },
        shower:    { budget: [300,800],  standard: [1000,3000], premium: [3500,8000] },
        tub:       { budget: [200,500],  standard: [600,1500],  premium: [2000,6000] },
        flooring:  { budget: [3,5],      standard: [6,10],      premium: [12,25] },  // per sqft
        lighting:  { budget: [50,150],   standard: [200,500],   premium: [600,1500] },
        plumbing:  { budget: [500,1000], standard: [1500,3000], premium: [3000,6000] }
    };
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Bathroom Remodel Cost Calculator</h2>
            <form id="costForm" class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div class="input-group"><label>Bathroom Size (sq ft)</label><input type="number" id="sqft" min="20" value="75" step="5" required></div>
                    <div class="input-group"><label>Quality Level</label>
                        <select id="quality"><option value="budget">Budget</option><option value="standard" selected>Standard</option><option value="premium">Premium</option></select>
                    </div>
                </div>
                <h3 class="font-bold text-lg mt-4">Select what you're replacing:</h3>
                <div class="grid grid-cols-2 gap-2">
                    <label class="flex items-center gap-2"><input type="checkbox" id="inc_vanity" checked> Vanity & Sink</label>
                    <label class="flex items-center gap-2"><input type="checkbox" id="inc_toilet" checked> Toilet</label>
                    <label class="flex items-center gap-2"><input type="checkbox" id="inc_shower" checked> Shower</label>
                    <label class="flex items-center gap-2"><input type="checkbox" id="inc_tub"> Bathtub</label>
                    <label class="flex items-center gap-2"><input type="checkbox" id="inc_flooring" checked> Flooring</label>
                    <label class="flex items-center gap-2"><input type="checkbox" id="inc_lighting" checked> Lighting</label>
                    <label class="flex items-center gap-2"><input type="checkbox" id="inc_plumbing"> Move Plumbing</label>
                </div>
                <div class="input-group"><label>Your ZIP Code Region</label>
                    <select id="region"><option value="0.85">Rural / Low COL</option><option value="1.0" selected>Suburban / Average</option><option value="1.2">Urban / High COL</option><option value="1.4">Major Metro (NYC, SF, LA)</option></select>
                </div>
                <button type="submit" class="btn-primary w-full">Calculate Remodel Cost</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Bathroom Remodel Cost Breakdown</h2>
            <p class="mb-4">The national average bathroom remodel costs $6,000-$15,000 for a standard quality full renovation. Half-bath refreshes can be done for $2,000-$5,000, while luxury master bath overhauls reach $25,000-$50,000+.</p>
            <div class="pro-tip mb-6"><h4 class="font-bold">💡 Pro Tip</h4><p>The biggest hidden cost is moving plumbing — relocating a toilet or shower by even a few feet can add $1,500-$6,000. Keep fixtures in their current locations to save thousands. Also budget 15-20% contingency for unexpected issues like water damage behind walls.</p></div>
            <h3 class="text-2xl font-bold mt-6 mb-3">Where the Money Goes</h3>
            <ul class="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Labor:</strong> 40-65% of total cost (tile setters, plumbers, electricians)</li>
                <li><strong>Fixtures:</strong> 15-25% (vanity, toilet, tub/shower)</li>
                <li><strong>Tile & Flooring:</strong> 10-20%</li>
                <li><strong>Plumbing/Electrical:</strong> 10-15%</li>
                <li><strong>Permits & Design:</strong> 3-5%</li>
            </ul>
            <h3 class="text-2xl font-bold mt-6 mb-3">Best ROI Upgrades</h3>
            <ul class="list-disc pl-6 space-y-2">
                <li>Replace vanity and mirror — biggest visual impact per dollar</li>
                <li>Retile the shower surround — modernizes the whole room</li>
                <li>Add a ventilation fan — prevents mold and is often code-required</li>
                <li>Heated floor mat — adds luxury for only $200-500 in materials</li>
            </ul>
        `
    };

    function calculate(e) {
        e.preventDefault();
        const sqft = parseFloat(document.getElementById('sqft').value);
        const quality = document.getElementById('quality').value;
        const region = parseFloat(document.getElementById('region').value);
        const items = ['vanity','toilet','shower','tub','flooring','lighting','plumbing'];
        let lowTotal = 0, highTotal = 0;
        const breakdown = [];
        items.forEach(item => {
            if (!document.getElementById('inc_' + item).checked) return;
            const range = fixtures[item][quality];
            let low = range[0], high = range[1];
            if (item === 'flooring') { low *= sqft; high *= sqft; }
            low *= region; high *= region;
            lowTotal += low; highTotal += high;
            const label = item.charAt(0).toUpperCase() + item.slice(1);
            breakdown.push(`<div class="flex justify-between"><span>${label}:</span><span>$${Math.round(low).toLocaleString()} – $${Math.round(high).toLocaleString()}</span></div>`);
        });
        const laborLow = lowTotal * 0.5, laborHigh = highTotal * 0.6;
        const contingencyLow = (lowTotal + laborLow) * 0.15;
        const contingencyHigh = (highTotal + laborHigh) * 0.15;
        const grandLow = lowTotal + laborLow + contingencyLow;
        const grandHigh = highTotal + laborHigh + contingencyHigh;
        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-3xl font-bold mb-4">$${Math.round(grandLow).toLocaleString()} – $${Math.round(grandHigh).toLocaleString()}</h3>
            <div class="bg-white bg-opacity-20 rounded-lg p-4"><div class="space-y-2">
                <div class="font-bold text-sm mb-2 opacity-80">Materials & Fixtures</div>
                ${breakdown.join('')}
                <hr class="border-white border-opacity-30 my-2">
                <div class="flex justify-between"><span>Labor (est.):</span><span>$${Math.round(laborLow).toLocaleString()} – $${Math.round(laborHigh).toLocaleString()}</span></div>
                <div class="flex justify-between"><span>Contingency (15%):</span><span>$${Math.round(contingencyLow).toLocaleString()} – $${Math.round(contingencyHigh).toLocaleString()}</span></div>
                <hr class="border-white border-opacity-30 my-2">
                <div class="flex justify-between font-bold text-lg"><span>Total:</span><span>$${Math.round(grandLow).toLocaleString()} – $${Math.round(grandHigh).toLocaleString()}</span></div>
                <div class="flex justify-between opacity-80"><span>Per sq ft:</span><span>$${Math.round(grandLow/sqft)} – $${Math.round(grandHigh/sqft)}/sqft</span></div>
            </div></div>
        `;
    }
    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('costForm').addEventListener('submit', calculate);
    loadRelatedTools('cost');
})();