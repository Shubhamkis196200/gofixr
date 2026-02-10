// Siding Installation Cost — material-specific with R-value, maintenance, and lifespan data
(function() {
    const materials = {
        vinyl:  { name: 'Vinyl', matLow: 3, matHigh: 8, laborLow: 2, laborHigh: 5, lifespan: 30, maintenance: 'Low — wash annually', rValue: 0.6 },
        fiber:  { name: 'Fiber Cement (Hardie)', matLow: 6, matHigh: 12, laborLow: 4, laborHigh: 8, lifespan: 50, maintenance: 'Paint every 10-15 yr', rValue: 0.5 },
        wood:   { name: 'Wood (cedar/pine)', matLow: 5, matHigh: 10, laborLow: 4, laborHigh: 7, lifespan: 25, maintenance: 'Paint/stain every 3-7 yr', rValue: 0.8 },
        metal:  { name: 'Metal/Aluminum', matLow: 4, matHigh: 9, laborLow: 3, laborHigh: 6, lifespan: 40, maintenance: 'Touch up scratches', rValue: 0.0 },
        brick:  { name: 'Brick Veneer', matLow: 8, matHigh: 18, laborLow: 8, laborHigh: 15, lifespan: 100, maintenance: 'Repoint mortar every 25 yr', rValue: 0.2 },
        stone:  { name: 'Stone Veneer', matLow: 12, matHigh: 25, laborLow: 10, laborHigh: 20, lifespan: 75, maintenance: 'Seal every 5 yr', rValue: 0.1 }
    };
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Siding Installation Cost Estimator</h2>
            <form id="costForm" class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div class="input-group"><label>Siding Area (sq ft)</label><input type="number" id="sqft" min="200" value="1800" step="100" required>
                        <p class="text-xs text-gray-500 mt-1">Tip: multiply house perimeter (ft) × wall height (ft), then subtract window/door area</p>
                    </div>
                    <div class="input-group"><label>Stories</label>
                        <select id="stories"><option value="1.0">1 story</option><option value="1.15" selected>2 stories</option><option value="1.3">3 stories</option></select>
                    </div>
                </div>
                <div class="input-group"><label>Siding Material</label>
                    <select id="material"><option value="vinyl" selected>Vinyl ($3-8/sqft)</option><option value="fiber">Fiber Cement / Hardie ($6-12/sqft)</option><option value="wood">Wood ($5-10/sqft)</option><option value="metal">Metal / Aluminum ($4-9/sqft)</option><option value="brick">Brick Veneer ($8-18/sqft)</option><option value="stone">Stone Veneer ($12-25/sqft)</option></select>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="input-group"><label><input type="checkbox" id="removal" checked> Remove old siding ($1-3/sqft)</label></div>
                    <div class="input-group"><label><input type="checkbox" id="insulation"> Add insulation wrap ($0.50-1.50/sqft)</label></div>
                </div>
                <div class="input-group"><label><input type="checkbox" id="trim"> Replace trim & fascia ($500-2,000)</label></div>
                <button type="submit" class="btn-primary w-full">Calculate Siding Cost</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Siding Material Comparison Guide</h2>
            <p class="mb-4">New siding recoups 60-80% of its cost at resale and dramatically improves curb appeal. National average: $7,500-$18,000 for a 2-story home. Material choice drives most of the cost difference.</p>
            <div class="pro-tip mb-6"><h4 class="font-bold">💡 Pro Tip</h4><p>Fiber cement (James Hardie) offers the best balance of durability, appearance, and value. It resists rot, termites, and fire. It costs 50% more than vinyl upfront but lasts 60% longer and needs painting only every 10-15 years. Most Realtors say it has higher perceived value than vinyl.</p></div>
            <h3 class="text-2xl font-bold mt-6 mb-3">Material Lifespan & Maintenance</h3>
            <table class="w-full text-sm mb-6"><thead><tr class="border-b"><th class="text-left py-2">Material</th><th>Lifespan</th><th>Maintenance</th><th>Fire Rating</th></tr></thead><tbody>
                <tr class="border-b"><td class="py-2">Vinyl</td><td>20-40 yr</td><td>Wash annually</td><td>Melts</td></tr>
                <tr class="border-b"><td class="py-2">Fiber Cement</td><td>40-50+ yr</td><td>Paint every 10-15 yr</td><td>Excellent</td></tr>
                <tr class="border-b"><td class="py-2">Wood</td><td>15-30 yr</td><td>Paint/stain every 3-7 yr</td><td>Poor</td></tr>
                <tr class="border-b"><td class="py-2">Metal</td><td>30-50 yr</td><td>Touch up scratches</td><td>Excellent</td></tr>
                <tr class="border-b"><td class="py-2">Brick</td><td>75-100+ yr</td><td>Repoint mortar every 25 yr</td><td>Excellent</td></tr>
                <tr><td class="py-2">Stone</td><td>50-75+ yr</td><td>Seal every 5 yr</td><td>Excellent</td></tr>
            </tbody></table>
        `
    };
    function calculate(e) {
        e.preventDefault();
        const sqft = parseFloat(document.getElementById('sqft').value);
        const stories = parseFloat(document.getElementById('stories').value);
        const matKey = document.getElementById('material').value;
        const m = materials[matKey];
        const removal = document.getElementById('removal').checked;
        const insul = document.getElementById('insulation').checked;
        const trim = document.getElementById('trim').checked;
        const matLow = sqft * m.matLow;
        const matHigh = sqft * m.matHigh;
        const labLow = sqft * m.laborLow * stories;
        const labHigh = sqft * m.laborHigh * stories;
        const remCost = removal ? sqft * 2 : 0;
        const insCost = insul ? sqft * 1.0 : 0;
        const trimCost = trim ? 1200 : 0;
        const totalLow = Math.round(matLow + labLow + remCost + insCost + trimCost);
        const totalHigh = Math.round(matHigh + labHigh + remCost + insCost + trimCost);
        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-3xl font-bold mb-4">$${totalLow.toLocaleString()} – $${totalHigh.toLocaleString()}</h3>
            <div class="bg-white bg-opacity-20 rounded-lg p-4"><div class="space-y-2">
                <div class="flex justify-between"><span>Material (${m.name}):</span><span>$${Math.round(matLow).toLocaleString()} – $${Math.round(matHigh).toLocaleString()}</span></div>
                <div class="flex justify-between"><span>Labor:</span><span>$${Math.round(labLow).toLocaleString()} – $${Math.round(labHigh).toLocaleString()}</span></div>
                ${removal ? `<div class="flex justify-between"><span>Old siding removal:</span><span>$${remCost.toLocaleString()}</span></div>` : ''}
                ${insul ? `<div class="flex justify-between"><span>Insulation wrap:</span><span>$${insCost.toLocaleString()}</span></div>` : ''}
                ${trim ? `<div class="flex justify-between"><span>Trim & fascia:</span><span>~$${trimCost.toLocaleString()}</span></div>` : ''}
                <hr class="border-white border-opacity-30 my-2">
                <div class="flex justify-between font-bold text-lg"><span>Total:</span><span>$${totalLow.toLocaleString()} – $${totalHigh.toLocaleString()}</span></div>
                <div class="flex justify-between opacity-80"><span>Per sq ft:</span><span>$${(totalLow/sqft).toFixed(2)} – $${(totalHigh/sqft).toFixed(2)}</span></div>
                <div class="text-sm mt-3 opacity-80">Expected lifespan: ${m.lifespan} years | Maintenance: ${m.maintenance}</div>
            </div></div>
        `;
    }
    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('costForm').addEventListener('submit', calculate);
    loadRelatedTools('cost');
})();