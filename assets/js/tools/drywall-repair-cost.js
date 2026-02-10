// Drywall Repair Cost Estimator
(function() {
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Drywall Repair Cost Estimator</h2>
            <form id="costForm" class="space-y-4">
                <div class="input-group">
                    <label>Type of Damage</label>
                    <select id="damageType">
                        <option value="nail">Nail Holes / Small Dents (under 1")</option>
                        <option value="small">Small Hole (1-6 inches)</option>
                        <option value="medium" selected>Medium Hole (6-12 inches)</option>
                        <option value="large">Large Hole / Section (1-4 feet)</option>
                        <option value="water">Water Damage (staining/bubbling)</option>
                        <option value="crack">Cracks (settling/stress)</option>
                        <option value="full">Full Sheet Replacement</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Number of Repairs Needed</label>
                    <input type="number" id="repairCount" min="1" value="2" step="1" required>
                </div>
                <div class="input-group">
                    <label>Wall or Ceiling?</label>
                    <select id="location">
                        <option value="wall" selected>Wall</option>
                        <option value="ceiling">Ceiling (harder access)</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Texture Match Required?</label>
                    <select id="texture">
                        <option value="smooth">Smooth (flat finish)</option>
                        <option value="orange">Orange Peel</option>
                        <option value="knockdown">Knockdown</option>
                        <option value="popcorn">Popcorn Ceiling</option>
                        <option value="skip">Skip Trowel</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Include Painting?</label>
                    <select id="painting">
                        <option value="patch">Patch Paint Only (repair area)</option>
                        <option value="wall" selected>Full Wall Repaint (better blend)</option>
                        <option value="none">No Painting</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary w-full">Calculate Repair Cost</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Understanding Drywall Repair Costs</h2>
            <p class="mb-4">Drywall damage is one of the most common household repairs — from doorknob holes and furniture bumps to water damage and settling cracks. The good news is that small repairs are very DIY-friendly, and even professional repairs are relatively affordable compared to most home repairs. Costs range from $50-150 for small holes to $300-800+ for large sections or water damage.</p>
            
            <div class="pro-tip mb-6">
                <h4 class="font-bold">💡 Pro Tip</h4>
                <p>The most expensive part of drywall repair is usually the finishing — mudding, taping, texturing, and painting to make the repair invisible. The actual drywall material is cheap ($12-15 per 4×8 sheet). If you're DIY-capable, patching the hole is the easy part; blending the texture is where skill really matters.</p>
            </div>
            
            <h3 class="text-2xl font-bold mt-6 mb-3">DIY vs. Professional Repair</h3>
            <ul class="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Nail holes & small dents:</strong> Easy DIY — spackle, sand, paint. Materials under $15</li>
                <li><strong>Small holes (1-6"):</strong> DIY with a patch kit ($10-20). Self-adhesive mesh patches make it simple</li>
                <li><strong>Medium holes (6-12"):</strong> DIY-possible but requires cutting a drywall patch, taping seams, and multiple coats of joint compound</li>
                <li><strong>Large holes / water damage:</strong> Consider hiring a pro. Requires cutting back to studs, ensuring the framing is dry and intact, and extensive finishing</li>
            </ul>
            
            <h3 class="text-2xl font-bold mt-6 mb-3">Water Damage Special Considerations</h3>
            <p class="mb-4">Before repairing water-damaged drywall, you MUST find and fix the water source first. Then ensure the area is completely dry (use a moisture meter — under 15% is safe). Check for mold behind the damaged drywall. If mold is present on more than 10 sq ft, hire a mold remediation professional. Water-damaged drywall should always be cut out and replaced, never just patched over.</p>
            
            <h3 class="text-2xl font-bold mt-6 mb-3">Texture Matching Tips</h3>
            <p class="mb-4">Matching existing wall texture is the hardest part of a seamless repair. For orange peel, use spray-can texture (practice on cardboard first). Knockdown texture requires spraying then lightly troweling. Popcorn ceilings can be matched with spray-on popcorn texture, but be aware that pre-1980 popcorn ceilings may contain asbestos — test before disturbing. When in doubt, hire a pro for texture matching; their hourly rate is worth the invisible result.</p>
        `
    };

    const damageCosts = {
        nail:   {labor:30,  material:5,   hours:0.25},
        small:  {labor:75,  material:15,  hours:0.5},
        medium: {labor:150, material:25,  hours:1.0},
        large:  {labor:300, material:50,  hours:2.0},
        water:  {labor:400, material:75,  hours:3.0},
        crack:  {labor:120, material:20,  hours:0.75},
        full:   {labor:250, material:40,  hours:1.5}
    };
    const textureCosts = {smooth:0,orange:35,knockdown:50,popcorn:60,skip:75};

    function calculate(e) {
        e.preventDefault();
        const dt = document.getElementById('damageType').value;
        const count = parseInt(document.getElementById('repairCount').value);
        const loc = document.getElementById('location').value;
        const tex = document.getElementById('texture').value;
        const paint = document.getElementById('painting').value;

        const d = damageCosts[dt];
        const ceilingMult = loc === 'ceiling' ? 1.4 : 1.0;
        const laborPerRepair = d.labor * ceilingMult;
        const materialPerRepair = d.material;
        const texturePerRepair = textureCosts[tex];
        const paintCost = paint === 'wall' ? 85 : paint === 'patch' ? 25 : 0;

        const totalLabor = laborPerRepair * count;
        const totalMaterial = materialPerRepair * count;
        const totalTexture = texturePerRepair * count;
        const totalPaint = paintCost * (paint === 'wall' ? Math.ceil(count/3) : count); // one wall per 3 repairs
        const subtotal = totalLabor + totalMaterial + totalTexture + totalPaint;
        const minCallFee = count === 1 && subtotal < 150 ? 150 - subtotal : 0; // minimum service call
        const total = subtotal + minCallFee;

        const diyMaterial = materialPerRepair * count + (paint !== 'none' ? 40 : 0);
        const savings = total - diyMaterial;
        const diyDifficulty = {nail:'Easy',small:'Easy',medium:'Moderate',large:'Hard',water:'Hard',crack:'Moderate',full:'Moderate'};

        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-2xl font-bold mb-4">Repair Estimate: $${Math.round(total).toLocaleString()}</h3>
            <div class="bg-white bg-opacity-20 rounded-lg p-4 mb-4">
                <div class="space-y-2 text-sm">
                    <div class="flex justify-between"><span>Labor (${count} repair${count>1?'s':''}):</span><span>$${Math.round(totalLabor).toLocaleString()}</span></div>
                    <div class="flex justify-between"><span>Materials (drywall, compound, tape):</span><span>$${Math.round(totalMaterial).toLocaleString()}</span></div>
                    ${totalTexture>0?`<div class="flex justify-between"><span>Texture Matching (${tex}):</span><span>$${Math.round(totalTexture).toLocaleString()}</span></div>`:''}
                    ${totalPaint>0?`<div class="flex justify-between"><span>Painting:</span><span>$${Math.round(totalPaint).toLocaleString()}</span></div>`:''}
                    ${minCallFee>0?`<div class="flex justify-between"><span>Minimum Service Call Fee:</span><span>$${Math.round(minCallFee)}</span></div>`:''}
                    <hr class="border-white border-opacity-30 my-2">
                    <div class="flex justify-between font-bold text-lg"><span>Professional Cost:</span><span>$${Math.round(total).toLocaleString()}</span></div>
                </div>
            </div>
            <div class="bg-green-900 bg-opacity-30 rounded-lg p-3">
                <h4 class="font-bold mb-1">🔧 DIY Option</h4>
                <p class="text-sm">DIY Difficulty: <strong>${diyDifficulty[dt]}</strong></p>
                <p class="text-sm">DIY Material Cost: <strong>$${Math.round(diyMaterial)}</strong> — Save ~$${Math.round(savings)}</p>
            </div>
        `;
    }

    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('costForm').addEventListener('submit', calculate);
    loadRelatedTools('cost');
})();
