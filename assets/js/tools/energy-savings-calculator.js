// Energy Savings Calculator
(function() {
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Home Energy Savings Calculator</h2>
            <form id="utilityForm" class="space-y-4">
                <div class="input-group">
                    <label>Monthly Electric Bill ($)</label>
                    <input type="number" id="electricBill" min="20" value="150" step="5" required>
                </div>
                <div class="input-group">
                    <label>Monthly Gas/Heating Bill ($)</label>
                    <input type="number" id="gasBill" min="0" value="80" step="5" required>
                </div>
                <div class="input-group">
                    <label>Upgrade Type</label>
                    <select id="upgrade">
                        <option value="insulation">Insulation (attic/walls)</option>
                        <option value="windows">Energy-Efficient Windows</option>
                        <option value="hvac">High-Efficiency HVAC</option>
                        <option value="waterheater">Tankless Water Heater</option>
                        <option value="led">LED Lighting Conversion</option>
                        <option value="thermostat">Smart Thermostat</option>
                        <option value="sealing">Air Sealing & Weatherstripping</option>
                        <option value="solar">Solar Panels</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Home Size (sq ft)</label>
                    <input type="number" id="homeSize" min="500" value="1800" step="100" required>
                </div>
                <div class="input-group">
                    <label>Home Age</label>
                    <select id="homeAge">
                        <option value="new">Built after 2010</option>
                        <option value="mid" selected>Built 1980-2010</option>
                        <option value="old">Built before 1980</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary w-full">Calculate Savings</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Saving Energy and Money at Home</h2>
            <p class="mb-4">The average American household spends over $2,000 per year on energy bills. Strategic upgrades can cut that by 20-40%, paying for themselves within a few years while improving comfort year-round. This calculator estimates your potential savings based on your current bills, home characteristics, and the upgrade you're considering.</p>

            <div class="pro-tip mb-6">
                <h4 class="font-bold">💡 Pro Tip</h4>
                <p>Start with an energy audit. Many utilities offer free or subsidized audits that identify your biggest energy losses. The cheapest fixes — air sealing, weatherstripping, and attic insulation — often deliver the highest ROI before you invest in expensive equipment upgrades.</p>
            </div>

            <h3 class="text-2xl font-bold mt-6 mb-3">Best Energy Upgrades by Impact</h3>
            <ul class="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Air Sealing & Insulation:</strong> Reduces heating/cooling loss by 15-30%. Low cost, fast payback</li>
                <li><strong>Smart Thermostat:</strong> Saves 10-15% on heating/cooling with automated schedules</li>
                <li><strong>LED Lighting:</strong> Uses 75% less electricity than incandescent bulbs. $200-400 to convert a whole house</li>
                <li><strong>High-Efficiency HVAC:</strong> Modern systems are 30-50% more efficient than 15-year-old units</li>
                <li><strong>Energy-Efficient Windows:</strong> Reduce heat loss by 25-30%, but higher upfront cost means longer payback</li>
                <li><strong>Solar Panels:</strong> Can eliminate electric bills entirely; 25-year lifespan with 6-10 year payback depending on location and incentives</li>
            </ul>

            <h3 class="text-2xl font-bold mt-6 mb-3">Tax Credits & Incentives</h3>
            <p class="mb-4">The federal Inflation Reduction Act provides tax credits of up to 30% for qualifying energy improvements including heat pumps, insulation, windows, and solar panels. Many states and utilities offer additional rebates. Check the DSIRE database (dsireusa.org) for incentives in your area. These credits can dramatically reduce the effective cost and shorten your payback period.</p>
        `
    };

    const upgrades = {
        insulation:   {name:'Insulation Upgrade',     costPer:1.50, electricSave:0.08, gasSave:0.22, minCost:1500,  maxCost:5000},
        windows:      {name:'Energy-Efficient Windows',costPer:12,  electricSave:0.10, gasSave:0.18, minCost:8000,  maxCost:20000},
        hvac:         {name:'High-Efficiency HVAC',    costPer:4,   electricSave:0.18, gasSave:0.25, minCost:5000,  maxCost:15000},
        waterheater:  {name:'Tankless Water Heater',   costPer:0,   electricSave:0.08, gasSave:0.12, minCost:2500,  maxCost:4500},
        led:          {name:'LED Lighting Conversion',  costPer:0.15,electricSave:0.12, gasSave:0.0,  minCost:200,   maxCost:600},
        thermostat:   {name:'Smart Thermostat',        costPer:0,   electricSave:0.10, gasSave:0.12, minCost:200,   maxCost:400},
        sealing:      {name:'Air Sealing',             costPer:0.75,electricSave:0.05, gasSave:0.15, minCost:500,   maxCost:2500},
        solar:        {name:'Solar Panels',            costPer:4,   electricSave:0.85, gasSave:0.0,  minCost:15000, maxCost:35000}
    };

    function calculate(e) {
        e.preventDefault();
        const elec = parseFloat(document.getElementById('electricBill').value);
        const gas = parseFloat(document.getElementById('gasBill').value);
        const up = document.getElementById('upgrade').value;
        const sqft = parseFloat(document.getElementById('homeSize').value);
        const age = document.getElementById('homeAge').value;

        const ageMult = {new:0.7, mid:1.0, old:1.3};
        const u = upgrades[up];
        const eSave = elec * u.electricSave * ageMult[age];
        const gSave = gas * u.gasSave * ageMult[age];
        const monthlySavings = eSave + gSave;
        const annualSavings = monthlySavings * 12;
        
        let installCost = u.costPer > 0 ? Math.max(u.minCost, Math.min(u.maxCost, sqft * u.costPer)) : (u.minCost + u.maxCost) / 2;
        const taxCredit = ['insulation','windows','hvac','waterheater','solar'].includes(up) ? installCost * 0.30 : 0;
        const netCost = installCost - taxCredit;
        const paybackYears = annualSavings > 0 ? netCost / annualSavings : 999;
        const savings10yr = annualSavings * 10 - netCost;

        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-2xl font-bold mb-4">${u.name} — Energy Savings</h3>
            <div class="bg-white bg-opacity-20 rounded-lg p-4 mb-4">
                <div class="space-y-2">
                    <div class="flex justify-between"><span>Monthly Electric Savings:</span><span class="font-bold">$${eSave.toFixed(0)}/mo</span></div>
                    <div class="flex justify-between"><span>Monthly Gas/Heat Savings:</span><span class="font-bold">$${gSave.toFixed(0)}/mo</span></div>
                    <hr class="border-white border-opacity-30 my-2">
                    <div class="flex justify-between"><span>Total Monthly Savings:</span><span class="font-bold text-green-300">$${monthlySavings.toFixed(0)}/mo</span></div>
                    <div class="flex justify-between"><span>Annual Savings:</span><span class="font-bold text-green-300">$${annualSavings.toFixed(0)}/yr</span></div>
                    <hr class="border-white border-opacity-30 my-2">
                    <div class="flex justify-between"><span>Estimated Install Cost:</span><span class="font-bold">$${Math.round(installCost).toLocaleString()}</span></div>
                    ${taxCredit>0?`<div class="flex justify-between"><span>Federal Tax Credit (30%):</span><span class="font-bold text-green-300">-$${Math.round(taxCredit).toLocaleString()}</span></div>`:''}
                    <div class="flex justify-between"><span>Net Cost:</span><span class="font-bold">$${Math.round(netCost).toLocaleString()}</span></div>
                    <div class="flex justify-between"><span>Payback Period:</span><span class="font-bold">${paybackYears<20?paybackYears.toFixed(1)+' years':'20+ years'}</span></div>
                    <div class="flex justify-between"><span>10-Year Net Savings:</span><span class="font-bold ${savings10yr>=0?'text-green-300':'text-red-300'}">$${Math.round(savings10yr).toLocaleString()}</span></div>
                </div>
            </div>
            <p class="text-sm opacity-80">Estimates based on national averages. Actual savings depend on climate, usage patterns, and local energy rates.</p>
        `;
    }

    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('utilityForm').addEventListener('submit', calculate);
    loadRelatedTools('utility');
})();
