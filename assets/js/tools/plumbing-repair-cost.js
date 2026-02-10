// Plumbing Repair Cost Estimator
(function() {
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Plumbing Repair Cost Estimator</h2>
            <form id="costForm" class="space-y-4">
                <div class="input-group">
                    <label>Type of Repair</label>
                    <select id="repairType">
                        <option value="faucet">Faucet Repair/Replace</option>
                        <option value="toilet">Toilet Repair</option>
                        <option value="drain">Drain Clog/Cleaning</option>
                        <option value="leak">Pipe Leak Repair</option>
                        <option value="water-heater">Water Heater Repair</option>
                        <option value="sewer">Main Sewer Line Issue</option>
                        <option value="repipe">Pipe Replacement (section)</option>
                        <option value="fixture">Install New Fixture</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Urgency</label>
                    <select id="urgency">
                        <option value="standard" selected>Standard (schedule appointment)</option>
                        <option value="urgent">Urgent (same day)</option>
                        <option value="emergency">Emergency (after hours)</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Pipe Type (if applicable)</label>
                    <select id="pipeType">
                        <option value="na">N/A</option>
                        <option value="copper" selected>Copper</option>
                        <option value="pex">PEX</option>
                        <option value="galv">Galvanized Steel</option>
                        <option value="pvc">PVC/CPVC</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Access Difficulty</label>
                    <select id="access">
                        <option value="easy">Easy (exposed pipes)</option>
                        <option value="standard" selected>Standard</option>
                        <option value="hard">Difficult (in walls/slab)</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary w-full">Calculate Plumbing Cost</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Understanding Plumbing Repair Costs</h2>
            <p class="mb-4">Plumbers charge $75-150/hour for service calls, with most repairs billed as flat rates. Simple fixes like replacing a faucet washer cost $100-200, while major jobs like sewer line replacement can run $3,000-$25,000. Emergency and after-hours calls often carry 1.5-2x surcharges.</p>
            <div class="pro-tip mb-6"><h4 class="font-bold">💡 Pro Tip</h4><p>Many "emergency" calls can wait until morning with a quick DIY fix. Locate your main water shutoff NOW before you need it. A shut-off valve under the leaking sink can buy you 12 hours until a plumber arrives during normal business hours, saving $200+ in emergency fees.</p></div>
            <h3 class="text-2xl font-bold mt-6 mb-3">Common Plumbing Repair Costs</h3>
            <ul class="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Faucet Repair:</strong> $120-250 for cartridge/washer replacement. $200-500 for full faucet replacement</li>
                <li><strong>Toilet Repair:</strong> $150-300 for flapper/fill valve. $200-500 for wax ring/reset. $400-800 for new toilet install</li>
                <li><strong>Drain Cleaning:</strong> $100-250 for simple snake. $350-600 for hydro-jetting. $3,000+ for sewer camera + repair</li>
                <li><strong>Pipe Leak:</strong> $150-350 for accessible copper pinhole. $500-2,000 for hidden leaks requiring wall/floor access</li>
                <li><strong>Water Heater:</strong> $150-400 for thermostat/element. $1,000-3,000 for full replacement</li>
            </ul>
            <h3 class="text-2xl font-bold mt-6 mb-3">When to Call a Plumber vs DIY</h3>
            <p class="mb-4"><strong>DIY-friendly:</strong> Replacing faucet aerators, toilet flappers, showerheads, or snaking a drain. <strong>Call a pro:</strong> Anything involving gas lines, sewer work, or cutting into walls. Plumbing mistakes cause water damage costing 10-100x the cost of hiring a pro from the start.</p>
        `
    };
    const repairBase = {faucet:{base:180,hours:1.5},toilet:{base:220,hours:2},drain:{base:200,hours:1.5},leak:{base:280,hours:2.5},waterheater:{base:350,hours:3},'sewer':{base:1200,hours:6},repipe:{base:500,hours:4},fixture:{base:300,hours:2}};
    const urgencyMult = {standard:1.0,urgent:1.5,emergency:2.0};
    const accessMult = {easy:0.85,standard:1.0,hard:1.6};
    function calculate(e) {
        e.preventDefault();
        const repair = document.getElementById('repairType').value;
        const urg = document.getElementById('urgency').value;
        const pipe = document.getElementById('pipeType').value;
        const acc = document.getElementById('access').value;
        const rb = repairBase[repair];
        const hourlyRate = 95;
        const laborCost = rb.hours * hourlyRate * accessMult[acc];
        const parts = rb.base - (rb.hours * hourlyRate * 0.4);
        const urgSurcharge = urg !== 'standard' ? rb.base * (urgencyMult[urg] - 1.0) : 0;
        const total = rb.base * accessMult[acc] * urgencyMult[urg];
        const callFee = urg === 'emergency' ? 150 : urg === 'urgent' ? 75 : 0;
        const finalTotal = total + callFee;
        const warnings = [];
        if (pipe === 'galv') warnings.push('⚠️ Galvanized pipes are obsolete and often corroded inside. Your plumber may recommend full replacement.');
        if (repair === 'sewer') warnings.push('💡 Sewer line issues often require camera inspection ($200-400) before repair to locate the problem.');
        if (acc === 'hard') warnings.push('Hidden pipe access may require cutting drywall, flooring, or exterior walls. Budget for repair/patching.');
        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-2xl font-bold mb-4">Plumbing Estimate: $${Math.round(finalTotal).toLocaleString()}</h3>
            <div class="bg-white bg-opacity-20 rounded-lg p-4 mb-4"><div class="space-y-2 text-sm">
                <div class="flex justify-between"><span>Base Repair Cost:</span><span>$${Math.round(rb.base).toLocaleString()}</span></div>
                ${acc!=='standard'?`<div class="flex justify-between"><span>Access ${acc==='hard'?'Difficulty':'Easy'} Adj:</span><span>${acc==='hard'?'+':'-'}${Math.abs((accessMult[acc]-1)*100).toFixed(0)}%</span></div>`:''}
                ${urgSurcharge>0?`<div class="flex justify-between"><span>${urg==='emergency'?'Emergency':'Urgent'} Surcharge:</span><span>$${Math.round(urgSurcharge).toLocaleString()}</span></div>`:''}
                ${callFee>0?`<div class="flex justify-between"><span>After-Hours Call Fee:</span><span>$${callFee}</span></div>`:''}
                <hr class="border-white border-opacity-30 my-2">
                <div class="flex justify-between font-bold text-lg"><span>Total:</span><span>$${Math.round(finalTotal).toLocaleString()}</span></div>
                <div class="flex justify-between opacity-80 text-sm"><span>Est. Hours:</span><span>${(rb.hours * accessMult[acc]).toFixed(1)} hrs</span></div>
            </div></div>
            ${warnings.length>0?`<div class="bg-orange-900 bg-opacity-40 rounded-lg p-3">${warnings.map(w=>`<p class="text-sm mb-1">${w}</p>`).join('')}</div>`:''}
        `;
    }
    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('costForm').addEventListener('submit', calculate);
    loadRelatedTools('cost');
})();
