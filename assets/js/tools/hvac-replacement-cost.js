// HVAC Replacement Cost Estimator — real tonnage sizing with Manual J simplified approach
(function() {
    const systems = {
        ac:       { name: 'Central AC Only',       baseLow: 2500, baseHigh: 4500 },
        furnace:  { name: 'Gas Furnace Only',      baseLow: 2000, baseHigh: 4000 },
        both:     { name: 'AC + Furnace Bundle',   baseLow: 4000, baseHigh: 7500 },
        heatpump: { name: 'Heat Pump',             baseLow: 3500, baseHigh: 7000 },
        mini:     { name: 'Ductless Mini-Split',   baseLow: 1500, baseHigh: 4000 }
    };
    const seerAdj = { '14': 1.0, '16': 1.15, '18': 1.3, '20': 1.5 };
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">HVAC Replacement Cost Estimator</h2>
            <form id="costForm" class="space-y-4">
                <div class="input-group"><label>System Type</label>
                    <select id="sys"><option value="ac">Central AC Only</option><option value="furnace">Gas Furnace Only</option><option value="both" selected>AC + Furnace Bundle</option><option value="heatpump">Heat Pump</option><option value="mini">Ductless Mini-Split</option></select>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="input-group"><label>Home Size (sq ft)</label><input type="number" id="sqft" min="500" value="1800" step="100" required></div>
                    <div class="input-group"><label>Climate Zone</label>
                        <select id="climate"><option value="1.3">Hot/Humid (Southeast, TX)</option><option value="1.15" selected>Mixed (Mid-Atlantic, Midwest)</option><option value="1.0">Cold (Northeast, Mountain)</option><option value="0.9">Mild (Pacific NW, CA coast)</option></select>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="input-group"><label>Efficiency (SEER/SEER2)</label>
                        <select id="seer"><option value="14">14 SEER (minimum legal)</option><option value="16" selected>16 SEER (mid-range)</option><option value="18">18 SEER (high-efficiency)</option><option value="20">20+ SEER (premium)</option></select>
                    </div>
                    <div class="input-group"><label>Existing Ductwork</label>
                        <select id="ducts"><option value="good">Good condition (reuse)</option><option value="repair" selected>Needs some repair</option><option value="replace">Replace ductwork</option><option value="none">No ducts (new install)</option></select>
                    </div>
                </div>
                <div class="input-group"><label class="flex items-center gap-2"><input type="checkbox" id="thermostat" checked> Add Smart Thermostat ($200-400)</label></div>
                <button type="submit" class="btn-primary w-full">Calculate HVAC Cost</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">HVAC Sizing & Cost Guide</h2>
            <p class="mb-4">Proper HVAC sizing is critical. An oversized unit short-cycles (turns on/off frequently), wastes energy, and fails to dehumidify. An undersized unit runs constantly and can't keep up on extreme days. The rule of thumb is 1 ton (12,000 BTU) per 500-600 sq ft, but climate, insulation, windows, and sun exposure all affect this.</p>
            <div class="pro-tip mb-6"><h4 class="font-bold">💡 Pro Tip</h4><p>A proper Manual J load calculation by an HVAC contractor costs $100-300 but ensures correct sizing. Don't let a contractor "eyeball" it based on square footage alone. An oversized system costs more upfront AND costs more to run.</p></div>
            <h3 class="text-2xl font-bold mt-6 mb-3">Understanding SEER Ratings</h3>
            <ul class="list-disc pl-6 space-y-2 mb-4">
                <li><strong>SEER 14:</strong> Federal minimum (as of 2023, SEER2 standards apply). Lowest upfront cost. ~$1,200-$1,500/year cooling for an average home.</li>
                <li><strong>SEER 16:</strong> Sweet spot for most homeowners. 15% less energy than SEER 14. Pays back in 5-7 years.</li>
                <li><strong>SEER 18-20:</strong> High-efficiency units with variable-speed compressors. Quieter, better humidity control, 30-40% savings over minimum.</li>
                <li><strong>SEER 20+:</strong> Premium systems. Best comfort but diminishing returns on energy savings vs. 18 SEER.</li>
            </ul>
            <h3 class="text-2xl font-bold mt-6 mb-3">Heat Pump vs. Traditional</h3>
            <p class="mb-4">Heat pumps provide both heating and cooling in one unit. Modern cold-climate heat pumps work down to -15°F. They're 2-3× more efficient than gas furnaces for heating. Best ROI in mild to moderate climates. In very cold climates, a dual-fuel system (heat pump + gas furnace backup) provides the best of both worlds.</p>
        `
    };
    function calculate(e) {
        e.preventDefault();
        const sqft = parseFloat(document.getElementById('sqft').value);
        const climate = parseFloat(document.getElementById('climate').value);
        const sys = document.getElementById('sys').value;
        const seer = document.getElementById('seer').value;
        const ducts = document.getElementById('ducts').value;
        const thermostat = document.getElementById('thermostat').checked;
        // Simplified sizing
        const tons = Math.ceil((sqft * climate) / 600 * 2) / 2; // round to nearest 0.5 ton
        const btu = tons * 12000;
        // Cost calculation
        const s = systems[sys];
        const sizeMult = tons / 2.5; // baseline is 2.5 ton
        let equipLow = s.baseLow * sizeMult * seerAdj[seer];
        let equipHigh = s.baseHigh * sizeMult * seerAdj[seer];
        const laborLow = 1500, laborHigh = 3500;
        const ductCosts = { good: 0, repair: 800, replace: 3000, none: 5000 };
        const ductCost = ductCosts[ducts];
        const thermCost = thermostat ? 300 : 0;
        const totalLow = Math.round(equipLow + laborLow + ductCost + thermCost);
        const totalHigh = Math.round(equipHigh + laborHigh + ductCost + thermCost);
        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-3xl font-bold mb-4">$${totalLow.toLocaleString()} – $${totalHigh.toLocaleString()}</h3>
            <div class="bg-white bg-opacity-20 rounded-lg p-4"><div class="space-y-2">
                <div class="flex justify-between"><span>Recommended size:</span><span>${tons} ton (${btu.toLocaleString()} BTU)</span></div>
                <div class="flex justify-between"><span>Equipment:</span><span>$${Math.round(equipLow).toLocaleString()} – $${Math.round(equipHigh).toLocaleString()}</span></div>
                <div class="flex justify-between"><span>Installation labor:</span><span>$${laborLow.toLocaleString()} – $${laborHigh.toLocaleString()}</span></div>
                ${ductCost > 0 ? `<div class="flex justify-between"><span>Ductwork:</span><span>$${ductCost.toLocaleString()}</span></div>` : ''}
                ${thermCost > 0 ? `<div class="flex justify-between"><span>Smart thermostat:</span><span>~$${thermCost}</span></div>` : ''}
                <hr class="border-white border-opacity-30 my-2">
                <div class="flex justify-between font-bold text-lg"><span>Total:</span><span>$${totalLow.toLocaleString()} – $${totalHigh.toLocaleString()}</span></div>
                <div class="text-sm mt-2 opacity-80">Annual energy savings upgrading from 14→${seer} SEER: ~$${Math.round(sqft * 0.15 * (1 - 1/seerAdj[seer]))}/yr</div>
            </div></div>
        `;
    }
    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('costForm').addEventListener('submit', calculate);
    loadRelatedTools('cost');
})();