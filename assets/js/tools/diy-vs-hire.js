// DIY vs Hire a Pro — decision calculator with real cost comparisons and risk assessment
(function() {
    const projects = {
        painting:    { name: 'Interior Painting', diyHrs: 16, proCost: [800, 2500], diyMat: [200, 400], skillLevel: 'easy', riskLevel: 'low', proQualityBonus: 'Cleaner lines, faster, no ladder work' },
        tile:        { name: 'Tile Floor Installation', diyHrs: 24, proCost: [1500, 4000], diyMat: [500, 1200], skillLevel: 'medium', riskLevel: 'medium', proQualityBonus: 'Level substrate, waterproof membrane, consistent grout' },
        electrical:  { name: 'Electrical Panel Upgrade', diyHrs: 8, proCost: [1500, 3000], diyMat: [400, 800], skillLevel: 'hard', riskLevel: 'high', proQualityBonus: 'Required by code in most areas. Permit required.' },
        plumbing:    { name: 'Bathroom Plumbing Rough-In', diyHrs: 16, proCost: [2000, 5000], diyMat: [300, 800], skillLevel: 'hard', riskLevel: 'high', proQualityBonus: 'Code compliance, proper venting, no leaks' },
        deck:        { name: 'Build a Deck', diyHrs: 40, proCost: [5000, 15000], diyMat: [2000, 5000], skillLevel: 'medium', riskLevel: 'medium', proQualityBonus: 'Structural engineering, proper footings, faster' },
        drywall:     { name: 'Drywall Repair/Hang', diyHrs: 8, proCost: [300, 1200], diyMat: [50, 200], skillLevel: 'easy', riskLevel: 'low', proQualityBonus: 'Invisible seams, faster mud/tape work' },
        roof:        { name: 'Roof Replacement', diyHrs: 40, proCost: [5000, 15000], diyMat: [2000, 5000], skillLevel: 'hard', riskLevel: 'very high', proQualityBonus: 'Safety, warranty, proper flashing, code compliance' },
        faucet:      { name: 'Replace a Faucet', diyHrs: 1, proCost: [150, 350], diyMat: [80, 300], skillLevel: 'easy', riskLevel: 'low', proQualityBonus: 'Faster, handles corroded connections' },
        cabinet:     { name: 'Kitchen Cabinet Install', diyHrs: 20, proCost: [1500, 4000], diyMat: [200, 500], skillLevel: 'medium', riskLevel: 'medium', proQualityBonus: 'Level, plumb, and properly secured' },
        insulation:  { name: 'Attic Insulation', diyHrs: 8, proCost: [1000, 2500], diyMat: [400, 800], skillLevel: 'easy', riskLevel: 'low', proQualityBonus: 'Even coverage, air sealing, handles tight spaces' }
    };
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">DIY vs. Hire a Pro Calculator</h2>
            <form id="diyForm" class="space-y-4">
                <div class="input-group"><label>Project Type</label>
                    <select id="project"><option value="painting" selected>Interior Painting</option><option value="tile">Tile Floor</option><option value="electrical">Electrical Panel</option><option value="plumbing">Bathroom Plumbing</option><option value="deck">Build a Deck</option><option value="drywall">Drywall Repair</option><option value="roof">Roof Replacement</option><option value="faucet">Replace a Faucet</option><option value="cabinet">Cabinet Install</option><option value="insulation">Attic Insulation</option></select>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="input-group"><label>Your hourly rate/value ($)</label><input type="number" id="hourlyRate" min="0" value="35" step="5" required>
                        <p class="text-xs text-gray-500 mt-1">What's your time worth? Use your hourly wage or opportunity cost.</p>
                    </div>
                    <div class="input-group"><label>Your DIY Skill Level</label>
                        <select id="skill"><option value="beginner">Beginner (add 50% time)</option><option value="intermediate" selected>Intermediate</option><option value="experienced">Experienced (-25% time)</option></select>
                    </div>
                </div>
                <div class="input-group"><label><input type="checkbox" id="ownTools"> Already own required tools</label></div>
                <button type="submit" class="btn-primary w-full">Compare DIY vs Pro</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">When to DIY vs. Hire a Professional</h2>
            <div class="pro-tip mb-6"><h4 class="font-bold">💡 The Real Cost of DIY</h4><p>DIY isn't free — your time has value. A project that saves $2,000 in labor but takes 40 hours of your weekend time costs you $50/hour. If you earn more than that, hiring a pro is actually cheaper. Factor in the learning curve, tool purchases, and the risk of costly mistakes.</p></div>
            <h3 class="text-2xl font-bold mt-6 mb-3">Always Hire a Pro For:</h3>
            <ul class="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Structural work:</strong> Load-bearing walls, foundation, framing</li>
                <li><strong>Gas lines:</strong> One mistake = explosion risk. Always licensed plumber.</li>
                <li><strong>Electrical panel/service:</strong> Code requirement, inspection required</li>
                <li><strong>Roofing:</strong> Fall risk, warranty requirements, flashing expertise</li>
                <li><strong>Anything requiring permits:</strong> Inspectors check pro work more favorably</li>
            </ul>
            <h3 class="text-2xl font-bold mt-6 mb-3">Best DIY Projects:</h3>
            <ul class="list-disc pl-6 space-y-2">
                <li>Painting (interior) — biggest bang for your buck, low risk</li>
                <li>Faucet/fixture replacement — save $150-300 per fixture</li>
                <li>Attic insulation — blown-in rental from Home Depot is $40/day</li>
                <li>Drywall patching — easy to learn, minimal tools</li>
                <li>Landscaping/mulching — labor-intensive but zero risk</li>
            </ul>
        `
    };
    function calculate(e) {
        e.preventDefault();
        const proj = projects[document.getElementById('project').value];
        const hourly = parseFloat(document.getElementById('hourlyRate').value);
        const skill = document.getElementById('skill').value;
        const ownTools = document.getElementById('ownTools').checked;
        const skillMult = { beginner: 1.5, intermediate: 1.0, experienced: 0.75 };
        const diyHrs = Math.round(proj.diyHrs * skillMult[skill]);
        const timeCost = diyHrs * hourly;
        const toolCost = ownTools ? 0 : Math.round((proj.diyMat[0] + proj.diyMat[1]) * 0.3);
        const diyLow = proj.diyMat[0] + timeCost + toolCost;
        const diyHigh = proj.diyMat[1] + timeCost + toolCost;
        const proLow = proj.proCost[0];
        const proHigh = proj.proCost[1];
        const savings = Math.round(((proLow + proHigh) / 2) - ((diyLow + diyHigh) / 2));
        const riskColors = { low: '🟢', medium: '🟡', high: '🔴', 'very high': '🔴🔴' };
        const recommendation = savings > hourly * 8 && proj.riskLevel !== 'very high' && proj.riskLevel !== 'high' ? 'DIY' : 'Hire a Pro';
        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-3xl font-bold mb-4">Recommendation: ${recommendation}</h3>
            <div class="bg-white bg-opacity-20 rounded-lg p-4"><div class="space-y-3">
                <div class="grid grid-cols-2 gap-4">
                    <div class="text-center p-3 bg-white bg-opacity-10 rounded"><div class="text-sm opacity-80">DIY Total Cost</div><div class="text-2xl font-bold">$${Math.round(diyLow).toLocaleString()} – $${Math.round(diyHigh).toLocaleString()}</div><div class="text-sm">${diyHrs} hours of your time</div></div>
                    <div class="text-center p-3 bg-white bg-opacity-10 rounded"><div class="text-sm opacity-80">Professional Cost</div><div class="text-2xl font-bold">$${proLow.toLocaleString()} – $${proHigh.toLocaleString()}</div><div class="text-sm">Done in 1-3 days</div></div>
                </div>
                <div class="flex justify-between"><span>Savings (DIY):</span><span class="font-bold">${savings > 0 ? '$' + savings.toLocaleString() : 'None — pro is cheaper'}</span></div>
                <div class="flex justify-between"><span>Your effective hourly rate (DIY):</span><span class="font-bold">$${diyHrs > 0 ? Math.round(savings / diyHrs) : 0}/hr</span></div>
                <div class="flex justify-between"><span>Skill required:</span><span>${proj.skillLevel.charAt(0).toUpperCase() + proj.skillLevel.slice(1)}</span></div>
                <div class="flex justify-between"><span>Risk level:</span><span>${riskColors[proj.riskLevel]} ${proj.riskLevel.charAt(0).toUpperCase() + proj.riskLevel.slice(1)}</span></div>
                <div class="text-sm mt-2 opacity-80"><strong>Pro advantage:</strong> ${proj.proQualityBonus}</div>
            </div></div>
        `;
    }
    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('diyForm').addEventListener('submit', calculate);
    loadRelatedTools('planning');
})();