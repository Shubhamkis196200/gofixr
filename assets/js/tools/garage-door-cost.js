// Garage Door Replacement Cost Estimator
(function() {
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Garage Door Cost Estimator</h2>
            <form id="costForm" class="space-y-4">
                <div class="input-group">
                    <label>Door Size</label>
                    <select id="size">
                        <option value="single">Single Car (8-9 ft wide)</option>
                        <option value="double" selected>Double Car (16 ft wide)</option>
                        <option value="custom">Custom Size</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Material</label>
                    <select id="material">
                        <option value="steel">Steel (insulated)</option>
                        <option value="aluminum">Aluminum & Glass</option>
                        <option value="wood">Wood (carriage style)</option>
                        <option value="vinyl">Vinyl</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Opener Type</label>
                    <select id="opener">
                        <option value="none">No Opener (Manual)</option>
                        <option value="chain" selected>Chain Drive</option>
                        <option value="belt">Belt Drive (quieter)</option>
                        <option value="smart">Smart Opener (WiFi)</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Insulation Rating</label>
                    <select id="insulation">
                        <option value="none">No Insulation</option>
                        <option value="basic" selected>Basic (R-value 6-9)</option>
                        <option value="premium">Premium (R-value 16-19)</option>
                    </select>
                </div>
                <div class="input-group">
                    <label class="flex items-center gap-2"><input type="checkbox" id="removal" checked> Remove Old Door</label>
                </div>
                <button type="submit" class="btn-primary w-full">Calculate Cost</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Garage Door Replacement Guide</h2>
            <p class="mb-4">Garage door replacement is one of the highest-ROI home improvements, recouping 90-97% of cost at resale. A new door enhances curb appeal, security, and energy efficiency. Average cost: $800-1,500 for basic steel door with opener, $2,000-4,000 for insulated carriage-style doors.</p>
            <div class="pro-tip mb-6"><h4 class="font-bold">💡 Pro Tip</h4><p>Insulated doors reduce energy loss by 70% if your garage is attached and heated/cooled. The R-value difference costs only $200-400 more but pays back in 3-5 years through energy savings.</p></div>
            <h3 class="text-2xl font-bold mt-6 mb-3">Material Options</h3>
            <ul class="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Steel:</strong> Most popular. Durable, low-maintenance, affordable. Insulated models offer excellent R-values</li>
                <li><strong>Aluminum/Glass:</strong> Modern aesthetic, lets in natural light. Poor insulation but great for mid-century homes</li>
                <li><strong>Wood:</strong> Beautiful carriage-style doors. High maintenance (paint/stain every 3-5 years). Expensive ($3,000-6,000)</li>
                <li><strong>Vinyl:</strong> Won't dent or rust. Good for coastal areas. Limited color options</li>
            </ul>
        `
    };
    const sizeCosts = {single:{door:600,labor:250},double:{door:1000,labor:350},custom:{door:1500,labor:500}};
    const matMult = {steel:1.0,aluminum:1.3,wood:2.5,vinyl:1.4};
    const openerCosts = {none:0,chain:200,belt:350,smart:450};
    const insulMult = {none:1.0,basic:1.15,premium:1.35};
    function calculate(e) {
        e.preventDefault();
        const sz = document.getElementById('size').value;
        const mat = document.getElementById('material').value;
        const op = document.getElementById('opener').value;
        const ins = document.getElementById('insulation').value;
        const rem = document.getElementById('removal').checked;
        const sc = sizeCosts[sz];
        const doorCost = sc.door * matMult[mat] * insulMult[ins];
        const laborCost = sc.labor;
        const openerCost = openerCosts[op];
        const openerInstall = op !== 'none' ? 150 : 0;
        const removalCost = rem ? 150 : 0;
        const total = doorCost + laborCost + openerCost + openerInstall + removalCost;
        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-2xl font-bold mb-4">Estimate: $${Math.round(total).toLocaleString()}</h3>
            <div class="bg-white bg-opacity-20 rounded-lg p-4"><div class="space-y-2 text-sm">
                <div class="flex justify-between"><span>Garage Door:</span><span>$${Math.round(doorCost).toLocaleString()}</span></div>
                <div class="flex justify-between"><span>Installation Labor:</span><span>$${laborCost}</span></div>
                ${openerCost>0?`<div class="flex justify-between"><span>Opener:</span><span>$${openerCost}</span></div><div class="flex justify-between"><span>Opener Install:</span><span>$${openerInstall}</span></div>`:''}
                ${removalCost>0?`<div class="flex justify-between"><span>Old Door Removal:</span><span>$${removalCost}</span></div>`:''}
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
