// Electrical Work Cost Estimator
(function() {
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Electrical Work Cost Estimator</h2>
            <form id="costForm" class="space-y-4">
                <div class="input-group">
                    <label>Type of Electrical Work</label>
                    <select id="workType">
                        <option value="outlet">Add/Replace Outlets or Switches</option>
                        <option value="fixture">Light Fixture Installation</option>
                        <option value="ceiling">Ceiling Fan Installation</option>
                        <option value="circuit">Add New Circuit/Breaker</option>
                        <option value="panel">Panel Upgrade (100A to 200A)</option>
                        <option value="rewire">Partial Rewire (one room)</option>
                        <option value="gfci">GFCI Outlet Installation</option>
                        <option value="dedicated">Dedicated Appliance Circuit</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Quantity/Scope</label>
                    <input type="number" id="quantity" min="1" value="3" step="1" required>
                    <span class="text-sm text-gray-500" id="unitLabel">outlets/switches</span>
                </div>
                <div class="input-group">
                    <label>Wire Run Distance/Complexity</label>
                    <select id="complexity">
                        <option value="easy">Easy Access (exposed basement/attic)</option>
                        <option value="standard" selected>Standard (some fishing required)</option>
                        <option value="hard">Difficult (multiple walls, long runs)</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Existing Wiring Type</label>
                    <select id="wiring">
                        <option value="modern">Modern Romex (post-1970)</option>
                        <option value="aluminum">Aluminum Wiring (1960s-70s)</option>
                        <option value="knob">Knob & Tube (pre-1950)</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Include Permit & Inspection?</label>
                    <select id="permit">
                        <option value="yes" selected>Yes (required for most work)</option>
                        <option value="no">No</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary w-full">Calculate Electrical Cost</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Understanding Electrical Work Costs</h2>
            <p class="mb-4">Electrical work requires a licensed electrician in most jurisdictions — and for good reason. Mistakes can cause fires, electrocution, or code violations that complicate home sales. Licensed electricians charge $50-100/hour for labor, with most jobs billed at flat rates based on the task. This calculator estimates costs for common residential electrical projects based on national averages.</p>
            
            <div class="pro-tip mb-6">
                <h4 class="font-bold">⚠️ Safety Warning</h4>
                <p>Never attempt DIY electrical work beyond changing light bulbs unless you're a qualified electrician. Even "simple" tasks like adding an outlet involve working with live circuits, proper grounding, and code compliance. Homeowners insurance often doesn't cover fires caused by unpermitted DIY electrical work.</p>
            </div>
            
            <h3 class="text-2xl font-bold mt-6 mb-3">Common Electrical Project Costs</h3>
            <ul class="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Add/Replace Outlet:</strong> $120-200 per outlet (accessible location). Double for hidden walls or long wire runs</li>
                <li><strong>Replace Light Fixture:</strong> $100-250 for standard swap. $400+ for heavy chandeliers or high ceilings</li>
                <li><strong>Ceiling Fan Installation:</strong> $150-350 (must use fan-rated box). Add $100+ if box upgrade needed</li>
                <li><strong>New Circuit Breaker:</strong> $150-300 per breaker if panel has space. $1,500-3,000 for panel upgrade</li>
                <li><strong>GFCI Outlets:</strong> $150-250 each (required in kitchens, bathrooms, garages, outdoors)</li>
                <li><strong>Dedicated 240V Circuit:</strong> $300-800 (for electric dryers, ranges, EV chargers)</li>
            </ul>
            
            <h3 class="text-2xl font-bold mt-6 mb-3">When Permits Are Required</h3>
            <p class="mb-4">Most electrical work requires permits: adding circuits, replacing panels, running new wiring, installing hardwired fixtures. Simple fixture replacements (swapping a light) generally don't need permits. Permits cost $50-300 but ensure the work meets code and is inspected. Unpermitted work can prevent home sales and may void insurance if it causes damage.</p>
            
            <h3 class="text-2xl font-bold mt-6 mb-3">Red Flags: When to Upgrade</h3>
            <ul class="list-disc pl-6 space-y-2 mb-4">
                <li>Frequently tripping breakers — circuit overload, needs dedicated circuit</li>
                <li>Flickering lights — loose connections, undersized wire, or failing breaker</li>
                <li>Warm outlets or switch plates — dangerous loose connections, fire hazard</li>
                <li>Two-prong outlets throughout house — ungrounded system, major safety issue</li>
                <li>Fuse box instead of breaker panel — obsolete, needs full upgrade</li>
            </ul>
        `
    };

    const workCosts = {
        outlet:    {base:140, perUnit:120, labor:1.5, material:15, unitLabel:'outlets/switches'},
        fixture:   {base:0,   perUnit:180, labor:2.0, material:0,  unitLabel:'fixtures'},
        ceiling:   {base:0,   perUnit:280, labor:3.0, material:50, unitLabel:'ceiling fans'},
        circuit:   {base:0,   perUnit:220, labor:2.5, material:80, unitLabel:'circuits'},
        panel:     {base:2000,perUnit:500, labor:8.0, material:800,unitLabel:'panels'},
        rewire:    {base:0,   perUnit:2500,labor:20,  material:500,unitLabel:'rooms'},
        gfci:      {base:0,   perUnit:180, labor:1.5, material:25, unitLabel:'GFCI outlets'},
        dedicated: {base:0,   perUnit:550, labor:4.0, material:150,unitLabel:'appliance circuits'}
    };

    const complexityMult = {easy:0.8, standard:1.0, hard:1.5};
    const wiringAdder = {modern:0, aluminum:200, knob:500}; // safety surcharge

    window.updateUnitLabel = function() {
        const wt = document.getElementById('workType').value;
        document.getElementById('unitLabel').textContent = workCosts[wt].unitLabel;
    };

    function calculate(e) {
        e.preventDefault();
        const wt = document.getElementById('workType').value;
        const qty = parseInt(document.getElementById('quantity').value);
        const comp = document.getElementById('complexity').value;
        const wire = document.getElementById('wiring').value;
        const permitReq = document.getElementById('permit').value === 'yes';

        const w = workCosts[wt];
        const cm = complexityMult[comp];
        const baseCost = w.base;
        const unitCost = (w.perUnit + w.material) * cm;
        const totalUnits = baseCost + unitCost * qty;
        const wiringUpcharge = wiringAdder[wire] * (qty > 2 ? Math.min(qty,5) : 1);
        const permitCost = permitReq ? 150 + (wt === 'panel' || wt === 'rewire' ? 200 : 0) : 0;
        const total = totalUnits + wiringUpcharge + permitCost;

        const warnings = [];
        if (wire === 'knob') warnings.push('⚠️ Knob & tube wiring is obsolete and unsafe. Many electricians will recommend full rewiring before adding circuits.');
        if (wire === 'aluminum') warnings.push('⚠️ Aluminum wiring requires special handling. Ensure your electrician is certified for aluminum wiring work.');
        if (wt === 'panel') warnings.push('Panel upgrades often trigger additional electrical code compliance requirements (GFCI, AFCI breakers, etc.).');
        if (!permitReq && ['circuit','panel','rewire','dedicated'].includes(wt)) warnings.push('⚠️ This work almost always requires a permit. Unpermitted work may prevent home sale.');

        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-2xl font-bold mb-4">Electrical Work Estimate: $${Math.round(total).toLocaleString()}</h3>
            <div class="bg-white bg-opacity-20 rounded-lg p-4 mb-4">
                <div class="space-y-2 text-sm">
                    ${baseCost>0?`<div class="flex justify-between"><span>Base Cost:</span><span>$${baseCost.toLocaleString()}</span></div>`:''}
                    <div class="flex justify-between"><span>Work (${qty} ${w.unitLabel}):</span><span>$${Math.round(totalUnits-baseCost).toLocaleString()}</span></div>
                    ${wiringUpcharge>0?`<div class="flex justify-between"><span>${wire==='knob'?'Knob & Tube':'Aluminum Wiring'} Surcharge:</span><span>$${wiringUpcharge.toLocaleString()}</span></div>`:''}
                    ${permitCost>0?`<div class="flex justify-between"><span>Permit & Inspection:</span><span>$${permitCost}</span></div>`:''}
                    <hr class="border-white border-opacity-30 my-2">
                    <div class="flex justify-between font-bold text-lg"><span>Total Estimate:</span><span>$${Math.round(total).toLocaleString()}</span></div>
                    <div class="flex justify-between opacity-80 text-sm"><span>Estimated Hours:</span><span>${(w.labor * qty * cm).toFixed(1)} hours</span></div>
                </div>
            </div>
            ${warnings.length>0?`<div class="bg-orange-900 bg-opacity-40 rounded-lg p-3">${warnings.map(w=>`<p class="text-sm mb-1">${w}</p>`).join('')}</div>`:''}
        `;
    }

    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('workType').addEventListener('change', updateUnitLabel);
    document.getElementById('costForm').addEventListener('submit', calculate);
    loadRelatedTools('cost');
})();
