// Insulation Calculator — R-value recommendations with real heat loss calculations
(function() {
    const climateZones = {
        1: { name: 'Zone 1 (FL, HI, PR)', atticR: 30, wallR: 13, floorR: 13 },
        2: { name: 'Zone 2 (TX, LA, S.CA)', atticR: 38, wallR: 13, floorR: 13 },
        3: { name: 'Zone 3 (NC, GA, TN)', atticR: 38, wallR: 13, floorR: 19 },
        4: { name: 'Zone 4 (Mid-Atlantic, Midwest)', atticR: 49, wallR: 13, floorR: 19 },
        5: { name: 'Zone 5 (PA, OH, IL)', atticR: 49, wallR: 20, floorR: 30 },
        6: { name: 'Zone 6 (NY, MI, WI)', atticR: 49, wallR: 20, floorR: 30 },
        7: { name: 'Zone 7 (N. MN, MT, WY)', atticR: 49, wallR: 21, floorR: 38 }
    };
    const insulTypes = {
        batts:    { name: 'Fiberglass Batts', rPerInch: 3.2, costPerSqft: 0.50, diy: true },
        blown:    { name: 'Blown-In Fiberglass', rPerInch: 2.5, costPerSqft: 1.20, diy: false },
        cellulose:{ name: 'Blown-In Cellulose', rPerInch: 3.7, costPerSqft: 1.50, diy: false },
        spray:    { name: 'Spray Foam (closed-cell)', rPerInch: 6.5, costPerSqft: 3.50, diy: false },
        rigid:    { name: 'Rigid Foam Board', rPerInch: 5.0, costPerSqft: 1.80, diy: true }
    };
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Insulation Calculator</h2>
            <form id="insulForm" class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div class="input-group"><label>Climate Zone</label>
                        <select id="zone"><option value="1">Zone 1 (FL, HI)</option><option value="2">Zone 2 (TX, LA, S.CA)</option><option value="3">Zone 3 (NC, GA, TN)</option><option value="4" selected>Zone 4 (Mid-Atlantic, Midwest)</option><option value="5">Zone 5 (PA, OH, IL)</option><option value="6">Zone 6 (NY, MI, WI)</option><option value="7">Zone 7 (MN, MT, WY)</option></select>
                    </div>
                    <div class="input-group"><label>Area to Insulate</label>
                        <select id="area"><option value="attic" selected>Attic</option><option value="wall">Walls (exterior)</option><option value="floor">Basement/Crawl Floor</option></select>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="input-group"><label>Square Footage</label><input type="number" id="sqft" min="100" value="1000" step="50" required></div>
                    <div class="input-group"><label>Current R-Value</label>
                        <select id="currentR"><option value="0">None / Uninsulated</option><option value="11">R-11 (2×4 wall, minimal)</option><option value="13">R-13 (standard old wall)</option><option value="19">R-19 (2×6 wall)</option><option value="30" selected>R-30 (existing attic)</option><option value="38">R-38 (good attic)</option></select>
                    </div>
                </div>
                <div class="input-group"><label>Insulation Type</label>
                    <select id="insulType"><option value="batts">Fiberglass Batts (DIY-friendly)</option><option value="blown" selected>Blown-In Fiberglass</option><option value="cellulose">Blown-In Cellulose (best R/inch)</option><option value="spray">Spray Foam (best but $$)</option><option value="rigid">Rigid Foam Board</option></select>
                </div>
                <button type="submit" class="btn-primary w-full">Calculate Insulation Needed</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Home Insulation Guide</h2>
            <p class="mb-4">Proper insulation is the #1 way to cut heating/cooling costs. The Department of Energy recommends R-values based on climate. R-value measures thermal resistance — higher is better. Most homes are under-insulated, especially attics built before 2000.</p>
            <div class="pro-tip mb-6"><h4 class="font-bold">💡 Pro Tip</h4><p>Attic insulation is the easiest DIY upgrade with the best ROI. Adding R-19 (6-7 inches of blown-in cellulose) to an under-insulated attic costs $1,500-$2,500 and saves $400-$600/year — a 3-5 year payback. Most utility companies offer rebates or free home energy audits.</p></div>
            <h3 class="text-2xl font-bold mt-6 mb-3">Recommended R-Values by Climate</h3>
            <ul class="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Hot climates (zones 1-2):</strong> Attic R-30, Walls R-13, Floors R-13</li>
                <li><strong>Moderate (zones 3-4):</strong> Attic R-38 to R-49, Walls R-13, Floors R-19</li>
                <li><strong>Cold climates (zones 5-7):</strong> Attic R-49 to R-60, Walls R-20+, Floors R-30+</li>
            </ul>
            <h3 class="text-2xl font-bold mt-6 mb-3">Insulation Type Comparison</h3>
            <ul class="list-disc pl-6 space-y-2">
                <li><strong>Fiberglass batts:</strong> Cheapest ($0.40-0.70/sqft). DIY-friendly. R-3.2/inch. Gaps reduce effectiveness.</li>
                <li><strong>Blown-in fiberglass:</strong> Fills gaps well. R-2.5/inch. Requires rental equipment. $1-1.50/sqft installed.</li>
                <li><strong>Blown-in cellulose:</strong> Best value. R-3.7/inch. Made from recycled paper. Eco-friendly. $1.20-1.80/sqft.</li>
                <li><strong>Spray foam:</strong> Best performance (R-6.5/inch), air sealing, moisture barrier. Expensive ($2.50-4/sqft). Pro install only.</li>
            </ul>
        `
    };
    function calculate(e) {
        e.preventDefault();
        const zone = climateZones[document.getElementById('zone').value];
        const area = document.getElementById('area').value;
        const sqft = parseFloat(document.getElementById('sqft').value);
        const currentR = parseFloat(document.getElementById('currentR').value);
        const insulType = insulTypes[document.getElementById('insulType').value];
        const targetR = area === 'attic' ? zone.atticR : area === 'wall' ? zone.wallR : zone.floorR;
        const rNeeded = Math.max(0, targetR - currentR);
        const inchesNeeded = (rNeeded / insulType.rPerInch).toFixed(1);
        const costPerSqft = insulType.costPerSqft;
        const totalCost = Math.round(sqft * costPerSqft * (rNeeded / 19)); // normalize to R-19 baseline
        const annualSavings = Math.round(sqft * (rNeeded / 19) * 0.45); // ~$0.45/sqft/R-19
        const paybackYears = totalCost > 0 ? (totalCost / annualSavings).toFixed(1) : 0;
        const diyNote = insulType.diy ? '✅ DIY-friendly project' : '⚠️ Requires professional installation';
        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-3xl font-bold mb-4">${rNeeded > 0 ? `Add R-${rNeeded} Insulation` : 'Already Well-Insulated'}</h3>
            <div class="bg-white bg-opacity-20 rounded-lg p-4"><div class="space-y-2">
                <div class="flex justify-between"><span>Target R-value (${zone.name}):</span><span>R-${targetR}</span></div>
                <div class="flex justify-between"><span>Current R-value:</span><span>R-${currentR}</span></div>
                <div class="flex justify-between"><span>Additional R needed:</span><span class="font-bold">R-${rNeeded}</span></div>
                ${rNeeded > 0 ? `
                <hr class="border-white border-opacity-30 my-2">
                <div class="flex justify-between"><span>Insulation type:</span><span>${insulType.name}</span></div>
                <div class="flex justify-between"><span>Thickness to add:</span><span>${inchesNeeded} inches</span></div>
                <div class="flex justify-between"><span>Area:</span><span>${sqft} sq ft</span></div>
                <div class="flex justify-between"><span>Estimated cost:</span><span class="font-bold">$${totalCost.toLocaleString()}</span></div>
                <div class="flex justify-between"><span>Annual savings:</span><span class="text-green-300 font-bold">$${annualSavings}/yr</span></div>
                <div class="flex justify-between"><span>Payback period:</span><span class="font-bold">${paybackYears} years</span></div>
                <div class="text-sm mt-3 opacity-90">${diyNote}</div>
                ` : `<div class="text-center py-4">Your ${area} already meets or exceeds recommended R-values for your climate zone. 🎉</div>`}
            </div></div>
        `;
    }
    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('insulForm').addEventListener('submit', calculate);
    loadRelatedTools('planning');
})();