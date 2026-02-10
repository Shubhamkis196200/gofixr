// Insulation Calculator - R-value, type selection, cost estimation
(function() {
    const insTypes = {
        'fiberglass-batt': { name: 'Fiberglass Batts', rPerInch: 3.2, costPerSqFt: [0.65, 1.20], coverage: 'Per batt pack covers ~40-80 sq ft' },
        'blown-fiberglass': { name: 'Blown-In Fiberglass', rPerInch: 2.5, costPerSqFt: [1.00, 1.50], coverage: 'Per bag covers ~20-40 sq ft at R-30' },
        'blown-cellulose': { name: 'Blown-In Cellulose', rPerInch: 3.5, costPerSqFt: [0.80, 1.30], coverage: 'Per bag covers ~30-60 sq ft at R-30' },
        'spray-open': { name: 'Open-Cell Spray Foam', rPerInch: 3.7, costPerSqFt: [1.00, 1.75], coverage: 'Professional install required' },
        'spray-closed': { name: 'Closed-Cell Spray Foam', rPerInch: 6.5, costPerSqFt: [1.75, 3.50], coverage: 'Professional install required' },
        'rigid-xps': { name: 'Rigid XPS Board', rPerInch: 5.0, costPerSqFt: [0.95, 1.50], coverage: 'Per 4×8 sheet = 32 sq ft' },
        'mineral-wool': { name: 'Mineral Wool Batts', rPerInch: 3.3, costPerSqFt: [1.10, 1.70], coverage: 'Per pack covers ~40-60 sq ft' }
    };
    const rValueGuide = {
        'attic': { cold: 60, moderate: 49, warm: 38 },
        'wall': { cold: 21, moderate: 18, warm: 13 },
        'floor': { cold: 30, moderate: 25, warm: 13 },
        'crawlspace': { cold: 25, moderate: 19, warm: 13 },
        'basement': { cold: 15, moderate: 11, warm: 11 }
    };

    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Insulation Calculator</h2>
            <p class="text-gray-600 mb-4">Calculate insulation needs based on area, target R-value, and insulation type.</p>
            <form id="planningForm" class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div class="input-group">
                        <label>Area Length (ft)</label>
                        <input type="number" id="length" min="1" value="30" step="1" required>
                    </div>
                    <div class="input-group">
                        <label>Area Width (ft)</label>
                        <input type="number" id="width" min="1" value="20" step="1" required>
                    </div>
                </div>
                <div class="input-group">
                    <label>Location in Home</label>
                    <select id="location">
                        <option value="attic">Attic / Ceiling</option>
                        <option value="wall">Exterior Walls</option>
                        <option value="floor">Floor (over unconditioned space)</option>
                        <option value="crawlspace">Crawl Space</option>
                        <option value="basement">Basement Walls</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Climate Zone</label>
                    <select id="climate">
                        <option value="cold">Cold (zones 5-8: MN, WI, ME, MT, etc.)</option>
                        <option value="moderate" selected>Moderate (zones 3-4: TN, NC, MO, etc.)</option>
                        <option value="warm">Warm (zones 1-2: FL, TX, AZ, etc.)</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Insulation Type</label>
                    <select id="insType">
                        ${Object.entries(insTypes).map(([k,v]) => `<option value="${k}">${v.name} (R-${v.rPerInch}/inch)</option>`).join('')}
                    </select>
                </div>
                <div class="input-group">
                    <label>Existing Insulation R-Value (0 if none)</label>
                    <input type="number" id="existingR" min="0" value="0" step="1">
                </div>
                <button type="submit" class="btn-primary w-full">Calculate Insulation Needs</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Insulation Guide</h2>
            <div class="pro-tip mb-6">
                <h4 class="font-bold mb-2">💡 Pro Tip</h4>
                <p>Don't compress insulation to fit — it reduces R-value. A R-19 batt compressed into a 2×4 wall only delivers about R-13.</p>
            </div>
            <h3 class="text-2xl font-bold mt-6 mb-3">Recommended R-Values by Zone</h3>
            <table class="w-full text-sm mb-4">
                <tr class="border-b"><th class="text-left py-1">Area</th><th>Cold</th><th>Moderate</th><th>Warm</th></tr>
                <tr class="border-b"><td class="py-1">Attic</td><td>R-60</td><td>R-49</td><td>R-38</td></tr>
                <tr class="border-b"><td class="py-1">Walls</td><td>R-21</td><td>R-18</td><td>R-13</td></tr>
                <tr class="border-b"><td class="py-1">Floor</td><td>R-30</td><td>R-25</td><td>R-13</td></tr>
            </table>
            <h3 class="text-2xl font-bold mt-6 mb-3">Type Comparison</h3>
            <ul class="list-disc pl-6 space-y-2">
                <li><strong>Fiberglass Batts:</strong> Cheapest, DIY-friendly, good for standard framing</li>
                <li><strong>Blown-In:</strong> Great for attics and retrofits, fills gaps well</li>
                <li><strong>Spray Foam:</strong> Best air seal + R-value, but expensive and needs pro install</li>
                <li><strong>Rigid Board:</strong> Best for basement walls and exterior sheathing</li>
            </ul>
        `
    };

    function calculate(e) {
        e.preventDefault();
        const sqft = parseFloat(document.getElementById('length').value) * parseFloat(document.getElementById('width').value);
        const loc = document.getElementById('location').value;
        const climate = document.getElementById('climate').value;
        const typeKey = document.getElementById('insType').value;
        const existingR = parseFloat(document.getElementById('existingR').value) || 0;
        const ins = insTypes[typeKey];
        const targetR = rValueGuide[loc][climate];
        const neededR = Math.max(0, targetR - existingR);
        const thickness = neededR / ins.rPerInch;
        const costLow = (sqft * ins.costPerSqFt[0]).toFixed(0);
        const costHigh = (sqft * ins.costPerSqFt[1]).toFixed(0);

        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-3xl font-bold mb-4">${neededR > 0 ? `Add R-${neededR} Insulation` : '✅ Already Meets Target!'}</h3>
            <div class="bg-white bg-opacity-20 rounded-lg p-4">
                <div class="space-y-2">
                    <div class="flex justify-between"><span>Area:</span><span>${sqft.toLocaleString()} sq ft</span></div>
                    <div class="flex justify-between"><span>Target R-value (${loc}, ${climate}):</span><span>R-${targetR}</span></div>
                    <div class="flex justify-between"><span>Existing R-value:</span><span>R-${existingR}</span></div>
                    <div class="flex justify-between"><span>R-value to add:</span><span class="font-bold">R-${neededR}</span></div>
                    <div class="border-t border-white border-opacity-30 my-2 pt-2"></div>
                    <div class="flex justify-between"><span>Material:</span><span>${ins.name}</span></div>
                    <div class="flex justify-between"><span>Thickness needed:</span><span>${thickness.toFixed(1)} inches</span></div>
                    <div class="flex justify-between"><span>Coverage:</span><span>${ins.coverage}</span></div>
                    <div class="flex justify-between"><span>Est. material cost:</span><span class="font-bold">$${costLow} – $${costHigh}</span></div>
                </div>
            </div>
            ${neededR > 0 && thickness > 6 ? '<p class="mt-3 text-sm opacity-80">⚠️ Thick insulation may require deeper framing or a combination of types.</p>' : ''}
        `;
    }

    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('planningForm').addEventListener('submit', calculate);
    loadRelatedTools('planning');
})();
