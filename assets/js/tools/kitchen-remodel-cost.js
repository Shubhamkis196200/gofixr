// Kitchen Remodel Cost Estimator
(function() {
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Kitchen Remodel Cost Estimator</h2>
            <form id="costForm" class="space-y-4">
                <div class="input-group">
                    <label>Kitchen Size (sq ft)</label>
                    <input type="number" id="sqft" min="50" value="150" step="10" required>
                </div>
                <div class="input-group">
                    <label>Remodel Scope</label>
                    <select id="scope">
                        <option value="cosmetic">Cosmetic (paint, hardware, fixtures)</option>
                        <option value="minor" selected>Minor (counters, appliances, backsplash)</option>
                        <option value="major">Major (cabinets, layout, everything)</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Cabinet Plan</label>
                    <select id="cabinets">
                        <option value="reface">Reface Existing</option>
                        <option value="stock">Stock Cabinets (big box)</option>
                        <option value="semi" selected>Semi-Custom</option>
                        <option value="custom">Full Custom</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Countertop Material</label>
                    <select id="counters">
                        <option value="laminate">Laminate</option>
                        <option value="granite" selected>Granite</option>
                        <option value="quartz">Quartz</option>
                        <option value="marble">Marble</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Appliances</label>
                    <select id="appliances">
                        <option value="none">Keep Existing</option>
                        <option value="basic" selected>Basic Package ($2,500)</option>
                        <option value="mid">Mid-Range Package ($5,000)</option>
                        <option value="high">High-End Package ($10,000+)</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Flooring</label>
                    <select id="flooring">
                        <option value="none">Keep Existing</option>
                        <option value="vinyl" selected>Vinyl/LVP</option>
                        <option value="tile">Tile</option>
                        <option value="hardwood">Hardwood</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary w-full">Calculate Kitchen Cost</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Kitchen Remodel Cost Breakdown</h2>
            <p class="mb-4">Kitchen remodels range from $15,000-$30,000 for minor updates to $60,000-$150,000+ for full gut renovations. The average midrange kitchen remodel costs $68,000 and recoups 72% at resale, while upscale remodels ($135,000+) recoup only 54%.</p>
            <div class="pro-tip mb-6"><h4 class="font-bold">💡 Pro Tip</h4><p>Cabinets consume 30-40% of your budget. Save big by refacing or painting existing cabinets instead of replacing. Modern hardware and paint can make 20-year-old cabinets look contemporary for 1/10th the replacement cost.</p></div>
            <h3 class="text-2xl font-bold mt-6 mb-3">Cost Breakdown by Category</h3>
            <ul class="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Cabinets:</strong> 30-40% ($10K-40K+ depending on custom vs stock)</li>
                <li><strong>Countertops:</strong> 10-15% ($3K-15K depending on material)</li>
                <li><strong>Appliances:</strong> 15-20% ($2.5K-15K for full package)</li>
                <li><strong>Labor:</strong> 20-35% of total budget</li>
                <li><strong>Flooring:</strong> 5-10%</li>
                <li><strong>Lighting & Electrical:</strong> 5-8%</li>
            </ul>
            <h3 class="text-2xl font-bold mt-6 mb-3">Where to Splurge vs. Save</h3>
            <p class="mb-4"><strong>Splurge on:</strong> Quality cabinets (you touch them daily), durable countertops, and proper lighting. <strong>Save on:</strong> Backsplash (easy DIY), decorative hardware, and appliances (mid-range performs as well as luxury brands).</p>
        `
    };
    const cabinetCosts = {reface:{perSqft:50,base:3000},stock:{perSqft:100,base:0},semi:{perSqft:150,base:0},custom:{perSqft:250,base:0}};
    const counterCosts = {laminate:30,granite:60,quartz:75,marble:100};
    const applianceCosts = {none:0,basic:2500,mid:5000,high:12000};
    const floorCosts = {none:0,vinyl:6,tile:12,hardwood:15};
    function calculate(e) {
        e.preventDefault();
        const sqft = parseFloat(document.getElementById('sqft').value);
        const scope = document.getElementById('scope').value;
        const cab = document.getElementById('cabinets').value;
        const cnt = document.getElementById('counters').value;
        const app = document.getElementById('appliances').value;
        const flr = document.getElementById('flooring').value;
        const cabCost = cabinetCosts[cab].base + sqft * 0.4 * cabinetCosts[cab].perSqft;
        const counterSqft = sqft * 0.15;
        const counterCost = counterSqft * counterCosts[cnt];
        const appCost = applianceCosts[app];
        const floorCost = floorCosts[flr] * sqft;
        const backsplash = scope !== 'cosmetic' ? sqft * 0.3 * 25 : 0;
        const plumbElec = scope === 'major' ? 3500 : scope === 'minor' ? 1500 : 500;
        const lighting = scope === 'major' ? 2000 : scope === 'minor' ? 800 : 0;
        const paint = 800;
        const materialTotal = cabCost + counterCost + appCost + floorCost + backsplash;
        const laborCost = materialTotal * (scope === 'major' ? 0.40 : scope === 'minor' ? 0.30 : 0.20) + plumbElec + lighting;
        const total = materialTotal + laborCost + paint;
        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-2xl font-bold mb-4">Kitchen Remodel: $${Math.round(total).toLocaleString()}</h3>
            <div class="bg-white bg-opacity-20 rounded-lg p-4"><div class="space-y-2 text-sm">
                <div class="flex justify-between"><span>Cabinets:</span><span>$${Math.round(cabCost).toLocaleString()}</span></div>
                <div class="flex justify-between"><span>Countertops:</span><span>$${Math.round(counterCost).toLocaleString()}</span></div>
                ${appCost>0?`<div class="flex justify-between"><span>Appliances:</span><span>$${appCost.toLocaleString()}</span></div>`:''}
                ${floorCost>0?`<div class="flex justify-between"><span>Flooring:</span><span>$${Math.round(floorCost).toLocaleString()}</span></div>`:''}
                ${backsplash>0?`<div class="flex justify-between"><span>Backsplash:</span><span>$${Math.round(backsplash).toLocaleString()}</span></div>`:''}
                <div class="flex justify-between"><span>Plumbing & Electrical:</span><span>$${plumbElec.toLocaleString()}</span></div>
                ${lighting>0?`<div class="flex justify-between"><span>Lighting:</span><span>$${lighting.toLocaleString()}</span></div>`:''}
                <div class="flex justify-between"><span>Labor:</span><span>$${Math.round(laborCost).toLocaleString()}</span></div>
                <hr class="border-white border-opacity-30 my-2">
                <div class="flex justify-between font-bold text-lg"><span>Total:</span><span>$${Math.round(total).toLocaleString()}</span></div>
                <div class="flex justify-between opacity-80"><span>Per sq ft:</span><span>$${(total/sqft).toFixed(0)}/sqft</span></div>
            </div></div>
        `;
    }
    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('costForm').addEventListener('submit', calculate);
    loadRelatedTools('cost');
})();
