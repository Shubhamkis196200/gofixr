// Kitchen Remodel Cost Calculator — itemized by component with quality tiers
(function() {
    const components = {
        cabinets:    { label: 'Cabinets', budget: [4000,7000], standard: [8000,15000], premium: [15000,35000] },
        countertops: { label: 'Countertops', budget: [800,1500], standard: [2000,5000], premium: [5000,12000] },
        appliances:  { label: 'Appliances', budget: [1500,3000], standard: [3000,6000], premium: [6000,15000] },
        flooring:    { label: 'Flooring', budget: [500,1200], standard: [1200,3000], premium: [3000,6000] },
        backsplash:  { label: 'Backsplash', budget: [300,600], standard: [600,1500], premium: [1500,3500] },
        plumbing:    { label: 'Sink & Plumbing', budget: [300,600], standard: [600,1500], premium: [1500,3000] },
        lighting:    { label: 'Lighting', budget: [200,400], standard: [500,1200], premium: [1200,3000] },
        paint:       { label: 'Paint & Trim', budget: [200,400], standard: [400,800], premium: [800,1500] }
    };
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Kitchen Remodel Cost Calculator</h2>
            <form id="costForm" class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div class="input-group"><label>Kitchen Size (sq ft)</label><input type="number" id="sqft" min="40" value="150" step="10" required></div>
                    <div class="input-group"><label>Overall Quality</label>
                        <select id="quality"><option value="budget">Budget (stock cabinets, laminate)</option><option value="standard" selected>Standard (semi-custom, granite)</option><option value="premium">Premium (custom, quartz/marble)</option></select>
                    </div>
                </div>
                <h3 class="font-bold text-lg mt-2">Include in remodel:</h3>
                <div class="grid grid-cols-2 gap-2">
                    <label class="flex items-center gap-2"><input type="checkbox" id="inc_cabinets" checked> Cabinets</label>
                    <label class="flex items-center gap-2"><input type="checkbox" id="inc_countertops" checked> Countertops</label>
                    <label class="flex items-center gap-2"><input type="checkbox" id="inc_appliances" checked> Appliances</label>
                    <label class="flex items-center gap-2"><input type="checkbox" id="inc_flooring" checked> Flooring</label>
                    <label class="flex items-center gap-2"><input type="checkbox" id="inc_backsplash" checked> Backsplash</label>
                    <label class="flex items-center gap-2"><input type="checkbox" id="inc_plumbing" checked> Sink & Plumbing</label>
                    <label class="flex items-center gap-2"><input type="checkbox" id="inc_lighting" checked> Lighting</label>
                    <label class="flex items-center gap-2"><input type="checkbox" id="inc_paint" checked> Paint & Trim</label>
                </div>
                <div class="input-group"><label><input type="checkbox" id="layout"> Change layout (move plumbing/gas, $3,000-$8,000)</label></div>
                <div class="input-group"><label><input type="checkbox" id="wallRemoval"> Remove a wall ($1,500-$5,000)</label></div>
                <button type="submit" class="btn-primary w-full">Calculate Kitchen Cost</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Kitchen Remodel Cost Breakdown</h2>
            <p class="mb-4">The average kitchen remodel costs $15,000-$50,000. Cabinets typically consume 30-40% of the budget. A minor remodel (reface cabinets, new countertops, paint) averages $10,000-$18,000 with an 80% ROI at resale. Major remodels average $30,000-$75,000 with a 55-65% ROI.</p>
            <div class="pro-tip mb-6"><h4 class="font-bold">💡 Pro Tip</h4><p>Refacing cabinets ($4,000-$10,000) instead of replacing ($8,000-$35,000) saves 50-70% while getting 90% of the visual impact. Pair refaced cabinets with new hardware ($5-15/pull), countertops, and backsplash for a "new kitchen" look at half the cost.</p></div>
            <h3 class="text-2xl font-bold mt-6 mb-3">Countertop Comparison</h3>
            <ul class="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Laminate:</strong> $10-$40/sqft installed. Budget-friendly. 10-15 year lifespan.</li>
                <li><strong>Granite:</strong> $40-$100/sqft installed. Durable, heat-resistant. Needs annual sealing.</li>
                <li><strong>Quartz:</strong> $50-$120/sqft installed. Non-porous, no sealing needed. Most popular premium choice.</li>
                <li><strong>Butcher Block:</strong> $40-$80/sqft installed. Warm look. Needs regular oiling. Not for around sinks.</li>
                <li><strong>Marble:</strong> $75-$200/sqft installed. Beautiful but high-maintenance. Etches from acid (lemon, tomato).</li>
            </ul>
        `
    };
    function calculate(e) {
        e.preventDefault();
        const sqft = parseFloat(document.getElementById('sqft').value);
        const quality = document.getElementById('quality').value;
        const sizeMult = sqft / 150; // normalize to 150 sqft baseline
        let totalLow = 0, totalHigh = 0;
        const breakdown = [];
        Object.keys(components).forEach(key => {
            if (!document.getElementById('inc_' + key).checked) return;
            const c = components[key];
            const range = c[quality];
            const low = Math.round(range[0] * sizeMult);
            const high = Math.round(range[1] * sizeMult);
            totalLow += low; totalHigh += high;
            breakdown.push(`<div class="flex justify-between"><span>${c.label}:</span><span>$${low.toLocaleString()} – $${high.toLocaleString()}</span></div>`);
        });
        const layout = document.getElementById('layout').checked;
        const wall = document.getElementById('wallRemoval').checked;
        if (layout) { totalLow += 3000; totalHigh += 8000; breakdown.push(`<div class="flex justify-between"><span>Layout change:</span><span>$3,000 – $8,000</span></div>`); }
        if (wall) { totalLow += 1500; totalHigh += 5000; breakdown.push(`<div class="flex justify-between"><span>Wall removal:</span><span>$1,500 – $5,000</span></div>`); }
        const laborLow = Math.round(totalLow * 0.35);
        const laborHigh = Math.round(totalHigh * 0.45);
        const grandLow = totalLow + laborLow;
        const grandHigh = totalHigh + laborHigh;
        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-3xl font-bold mb-4">$${grandLow.toLocaleString()} – $${grandHigh.toLocaleString()}</h3>
            <div class="bg-white bg-opacity-20 rounded-lg p-4"><div class="space-y-2">
                ${breakdown.join('')}
                <hr class="border-white border-opacity-30 my-2">
                <div class="flex justify-between"><span>Installation labor:</span><span>$${laborLow.toLocaleString()} – $${laborHigh.toLocaleString()}</span></div>
                <hr class="border-white border-opacity-30 my-2">
                <div class="flex justify-between font-bold text-lg"><span>Grand total:</span><span>$${grandLow.toLocaleString()} – $${grandHigh.toLocaleString()}</span></div>
                <div class="flex justify-between opacity-80"><span>Per sq ft:</span><span>$${Math.round(grandLow/sqft)} – $${Math.round(grandHigh/sqft)}/sqft</span></div>
            </div></div>
        `;
    }
    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('costForm').addEventListener('submit', calculate);
    loadRelatedTools('cost');
})();