// Energy Savings Calculator — real utility cost modeling with insulation, HVAC, and window upgrades
(function() {
    const upgrades = {
        insulation:   { name: 'Attic Insulation (R-30 to R-49)', cost: [1200, 2500], savingsPercent: 0.15, lifespan: 40 },
        sealAir:      { name: 'Air Sealing (caulk/weatherstrip)', cost: [200, 600], savingsPercent: 0.10, lifespan: 10 },
        windows:      { name: 'Window Replacement (single→double)', cost: [8000, 18000], savingsPercent: 0.12, lifespan: 25 },
        hvac16:       { name: 'HVAC Upgrade (14→16 SEER)', cost: [4000, 7500], savingsPercent: 0.14, lifespan: 15 },
        hvac18:       { name: 'HVAC Upgrade (14→18 SEER)', cost: [5000, 9000], savingsPercent: 0.28, lifespan: 15 },
        heatpump:     { name: 'Heat Pump (replace gas furnace)', cost: [5000, 10000], savingsPercent: 0.30, lifespan: 15 },
        tankless:     { name: 'Tankless Water Heater', cost: [2000, 4500], savingsPercent: 0.08, lifespan: 20 },
        solar:        { name: 'Solar Panels (5kW system)', cost: [12000, 20000], savingsPercent: 0.70, lifespan: 25 },
        smartTherm:   { name: 'Smart Thermostat', cost: [150, 300], savingsPercent: 0.10, lifespan: 10 },
        ledLights:    { name: 'LED Bulbs (whole house)', cost: [100, 300], savingsPercent: 0.04, lifespan: 15 }
    };
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Energy Savings Calculator</h2>
            <form id="energyForm" class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div class="input-group"><label>Monthly Energy Bill ($)</label><input type="number" id="monthlyBill" min="50" value="250" step="10" required>
                        <p class="text-xs text-gray-500 mt-1">Include electric + gas/heating oil</p>
                    </div>
                    <div class="input-group"><label>Home Size (sq ft)</label><input type="number" id="sqft" min="500" value="1800" step="100" required></div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="input-group"><label>Climate Zone</label>
                        <select id="climate"><option value="hot">Hot (Southeast, TX, AZ)</option><option value="mixed" selected>Mixed (Mid-Atlantic, Midwest)</option><option value="cold">Cold (Northeast, Mountain)</option><option value="mild">Mild (Pacific NW, CA)</option></select>
                    </div>
                    <div class="input-group"><label>Home Age</label>
                        <select id="homeAge"><option value="new">New (built after 2010)</option><option value="recent">Recent (1990-2010)</option><option value="older" selected>Older (1970-1990)</option><option value="old">Old (pre-1970)</option></select>
                    </div>
                </div>
                <div class="input-group"><label>Energy Upgrade</label>
                    <select id="upgrade"><option value="insulation" selected>Attic Insulation (15% savings)</option><option value="sealAir">Air Sealing (10% savings)</option><option value="windows">Window Replacement (12% savings)</option><option value="hvac16">HVAC to 16 SEER (14% savings)</option><option value="hvac18">HVAC to 18 SEER (28% savings)</option><option value="heatpump">Heat Pump (30% savings)</option><option value="tankless">Tankless Water Heater (8% savings)</option><option value="solar">Solar Panels (70% savings)</option><option value="smartTherm">Smart Thermostat (10% savings)</option><option value="ledLights">LED Bulbs (4% savings)</option></select>
                </div>
                <div class="input-group"><label>Local Electricity Rate (¢/kWh)</label><input type="number" id="rate" min="5" max="40" value="13" step="1" required>
                    <p class="text-xs text-gray-500 mt-1">National avg: 13¢. CA: 22¢. TX: 12¢. NY: 20¢.</p>
                </div>
                <button type="submit" class="btn-primary w-full">Calculate Energy Savings</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Home Energy Upgrade Guide</h2>
            <p class="mb-4">The average U.S. household spends $2,500-$3,000/year on utilities. Strategic energy upgrades can cut that by 20-50%. The key is focusing on the biggest energy hogs: heating/cooling (45%), water heating (18%), and air leaks (15-25%).</p>
            <div class="pro-tip mb-6"><h4 class="font-bold">💡 ROI Reality Check</h4><p>Most energy upgrades have a 5-15 year payback period. Attic insulation and air sealing pay back fastest (3-5 years). New windows take 15-30 years to break even on energy savings alone — their value is comfort and resale appeal. Solar panels pay back in 7-12 years and increase home value by $15,000-$25,000.</p></div>
            <h3 class="text-2xl font-bold mt-6 mb-3">Best Energy Upgrades by Payback Period</h3>
            <table class="w-full text-sm mb-6"><thead><tr class="border-b"><th class="text-left py-2">Upgrade</th><th>Cost</th><th>Savings/yr</th><th>Payback</th></tr></thead><tbody>
                <tr class="border-b"><td class="py-2">LED bulbs</td><td>$200</td><td>$120</td><td>1.7 yr</td></tr>
                <tr class="border-b"><td class="py-2">Smart thermostat</td><td>$225</td><td>$180</td><td>1.3 yr</td></tr>
                <tr class="border-b"><td class="py-2">Air sealing</td><td>$400</td><td>$300</td><td>1.3 yr</td></tr>
                <tr class="border-b"><td class="py-2">Attic insulation</td><td>$1,800</td><td>$450</td><td>4 yr</td></tr>
                <tr class="border-b"><td class="py-2">HVAC upgrade</td><td>$5,500</td><td>$420</td><td>13 yr</td></tr>
                <tr class="border-b"><td class="py-2">Windows</td><td>$13,000</td><td>$360</td><td>36 yr</td></tr>
                <tr><td class="py-2">Solar panels</td><td>$16,000</td><td>$1,800</td><td>9 yr</td></tr>
            </tbody></table>
            <h3 class="text-2xl font-bold mt-6 mb-3">Free/Low-Cost Energy Savers</h3>
            <ul class="list-disc pl-6 space-y-2">
                <li>Lower water heater to 120°F — saves $50-100/yr, no cost</li>
                <li>Clean HVAC filters monthly — saves 5-15% on heating/cooling</li>
                <li>Use ceiling fans — feels 4°F cooler, uses 1/10th the energy of AC</li>
                <li>Seal ducts with mastic (not tape) — saves 20-30% on HVAC</li>
            </ul>
        `
    };
    function calculate(e) {
        e.preventDefault();
        const monthlyBill = parseFloat(document.getElementById('monthlyBill').value);
        const annualBill = monthlyBill * 12;
        const upgradeKey = document.getElementById('upgrade').value;
        const u = upgrades[upgradeKey];
        const climate = document.getElementById('climate').value;
        const homeAge = document.getElementById('homeAge').value;
        // Older homes and extreme climates save more from upgrades
        const climateBonus = { hot: 1.2, mixed: 1.0, cold: 1.15, mild: 0.85 };
        const ageBonus = { new: 0.6, recent: 0.8, older: 1.0, old: 1.3 };
        const effectiveSavings = u.savingsPercent * climateBonus[climate] * ageBonus[homeAge];
        const annualSavings = Math.round(annualBill * effectiveSavings);
        const monthlySavings = Math.round(annualSavings / 12);
        const avgCost = (u.cost[0] + u.cost[1]) / 2;
        const paybackYears = (avgCost / annualSavings).toFixed(1);
        const lifetimeSavings = Math.round(annualSavings * u.lifespan);
        const netSavings = lifetimeSavings - avgCost;
        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-3xl font-bold mb-4">$${annualSavings.toLocaleString()}/year Savings</h3>
            <div class="bg-white bg-opacity-20 rounded-lg p-4"><div class="space-y-2">
                <div class="flex justify-between"><span>Upgrade:</span><span>${u.name}</span></div>
                <div class="flex justify-between"><span>Upfront cost:</span><span>$${Math.round(avgCost).toLocaleString()}</span></div>
                <div class="flex justify-between"><span>Annual savings:</span><span class="font-bold text-green-300">$${annualSavings.toLocaleString()}</span></div>
                <div class="flex justify-between"><span>Monthly savings:</span><span class="font-bold text-green-300">$${monthlySavings}</span></div>
                <hr class="border-white border-opacity-30 my-2">
                <div class="flex justify-between"><span>Payback period:</span><span class="font-bold">${paybackYears} years</span></div>
                <div class="flex justify-between"><span>Expected lifespan:</span><span>${u.lifespan} years</span></div>
                <div class="flex justify-between"><span>Lifetime savings:</span><span>$${lifetimeSavings.toLocaleString()}</span></div>
                <hr class="border-white border-opacity-30 my-2">
                <div class="flex justify-between font-bold text-lg ${netSavings > 0 ? 'text-green-300' : 'text-red-300'}"><span>Net savings over ${u.lifespan}yr:</span><span>$${netSavings.toLocaleString()}</span></div>
                <div class="text-sm mt-2 opacity-80">Your new monthly bill: ~$${Math.round(monthlyBill - monthlySavings)}</div>
            </div></div>
        `;
    }
    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('energyForm').addEventListener('submit', calculate);
    loadRelatedTools('planning');
})();