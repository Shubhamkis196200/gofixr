// HVAC Replacement Cost Estimator
(function() {
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">HVAC Replacement Cost Estimator</h2>
            <form id="costForm" class="space-y-4">
                <div class="input-group">
                    <label>System Type</label>
                    <select id="systemType">
                        <option value="ac">Central AC Only</option>
                        <option value="furnace">Furnace Only</option>
                        <option value="both" selected>AC + Furnace (both)</option>
                        <option value="heatpump">Heat Pump</option>
                        <option value="mini">Mini-Split System</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Home Size (sq ft)</label>
                    <input type="number" id="sqft" min="500" value="1800" step="100" required>
                </div>
                <div class="input-group">
                    <label>SEER Rating (efficiency)</label>
                    <select id="seer">
                        <option value="14">14 SEER (Standard)</option>
                        <option value="16" selected>16 SEER (High Efficiency)</option>
                        <option value="20">20+ SEER (Premium)</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Ductwork Condition</label>
                    <select id="ducts">
                        <option value="good" selected>Good (no work needed)</option>
                        <option value="minor">Minor Repairs Needed</option>
                        <option value="major">Major Repairs/Replacement</option>
                    </select>
                </div>
                <div class="input-group">
                    <label class="flex items-center gap-2"><input type="checkbox" id="smart"> Smart Thermostat</label>
                    <label class="flex items-center gap-2"><input type="checkbox" id="removal" checked> Remove Old System</label>
                </div>
                <button type="submit" class="btn-primary w-full">Calculate HVAC Cost</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">HVAC Replacement Cost Guide</h2>
            <p class="mb-4">HVAC replacement is one of the costliest home repairs, averaging $5,000-8,000 for standard systems, $8,000-15,000 for high-efficiency units. However, modern systems are 30-50% more efficient than 15-year-old units, saving $300-700/year on energy bills.</p>
            <div class="pro-tip mb-6"><h4 class="font-bold">💡 Pro Tip</h4><p>Don't oversize your system. Bigger isn't better — oversized units cycle on/off frequently, reducing efficiency and lifespan. A proper Manual J load calculation (required by code in many areas) ensures correct sizing.</p></div>
            <h3 class="text-2xl font-bold mt-6 mb-3">System Types</h3>
            <ul class="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Central AC:</strong> $3,500-7,000. Cools only. Pair with existing furnace</li>
                <li><strong>Furnace:</strong> Gas $2,500-6,000, Electric $1,500-4,000. Heating only</li>
                <li><strong>Heat Pump:</strong> $5,000-10,000. Both heating/cooling. Most efficient in mild climates</li>
                <li><strong>Mini-Split:</strong> $3,000-5,000 per zone. No ducts needed. Great for additions</li>
            </ul>
            <h3 class="text-2xl font-bold mt-6 mb-3">Understanding SEER Ratings</h3>
            <p class="mb-4">SEER (Seasonal Energy Efficiency Ratio) measures cooling efficiency. Minimum is 14 SEER. 16 SEER is the sweet spot for cost vs. efficiency. 20+ SEER units cost $2,000-4,000 more but only save $50-150/year extra compared to 16 SEER.</p>
        `
    };
    const systemBase = {ac:{base:3500,perTon:600},furnace:{base:2800,perTon:400},both:{base:6500,perTon:900},heatpump:{base:5500,perTon:800},mini:{base:3500,perTon:700}};
    const seerMult = {14:1.0,16:1.25,20:1.6};
    function calculate(e) {
        e.preventDefault();
        const sys = document.getElementById('systemType').value;
        const sqft = parseFloat(document.getElementById('sqft').value);
        const seer = document.getElementById('seer').value;
        const ducts = document.getElementById('ducts').value;
        const smart = document.getElementById('smart').checked;
        const rem = document.getElementById('removal').checked;
        const tons = Math.ceil(sqft / 600); // 1 ton per 600 sqft
        const sb = systemBase[sys];
        const equipCost = (sb.base + sb.perTon * tons) * seerMult[seer];
        const laborCost = 1500 + tons * 300;
        const ductCost = ducts === 'minor' ? 800 : ducts === 'major' ? sqft * 3 : 0;
        const thermCost = smart ? 250 : 0;
        const remCost = rem ? 500 : 0;
        const permitCost = 150;
        const total = equipCost + laborCost + ductCost + thermCost + remCost + permitCost;
        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-2xl font-bold mb-4">HVAC Estimate: $${Math.round(total).toLocaleString()}</h3>
            <p class="text-sm mb-3">System Size: ${tons} ton${tons>1?'s':''} (${sqft} sqft home)</p>
            <div class="bg-white bg-opacity-20 rounded-lg p-4"><div class="space-y-2 text-sm">
                <div class="flex justify-between"><span>Equipment (${seer} SEER):</span><span>$${Math.round(equipCost).toLocaleString()}</span></div>
                <div class="flex justify-between"><span>Installation Labor:</span><span>$${laborCost.toLocaleString()}</span></div>
                ${ductCost>0?`<div class="flex justify-between"><span>Ductwork Repair:</span><span>$${Math.round(ductCost).toLocaleString()}</span></div>`:''}
                ${thermCost>0?`<div class="flex justify-between"><span>Smart Thermostat:</span><span>$${thermCost}</span></div>`:''}
                ${remCost>0?`<div class="flex justify-between"><span>Old System Removal:</span><span>$${remCost}</span></div>`:''}
                <div class="flex justify-between"><span>Permit:</span><span>$${permitCost}</span></div>
                <hr class="border-white border-opacity-30 my-2">
                <div class="flex justify-between font-bold text-lg"><span>Total:</span><span>$${Math.round(total).toLocaleString()}</span></div>
            </div></div>
        `;
    }
    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('costForm').addEventListener('submit', calculate);
    loadRelatedTools('cost');
})();
