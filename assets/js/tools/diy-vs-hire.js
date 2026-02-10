// DIY vs Hire a Pro Calculator
(function() {
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">DIY vs Hire a Pro</h2>
            <form id="diyForm" class="space-y-4">
                <div class="input-group">
                    <label>Project Type</label>
                    <select id="project">
                        <option value="painting">Interior Painting</option>
                        <option value="tile">Tile Installation</option>
                        <option value="deck">Deck Building</option>
                        <option value="plumbing">Plumbing Repair</option>
                        <option value="electrical">Electrical Work</option>
                        <option value="drywall">Drywall Repair</option>
                        <option value="flooring">Flooring Installation</option>
                        <option value="fence">Fence Installation</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Your Skill Level</label>
                    <select id="skill">
                        <option value="1">Beginner (never done it)</option>
                        <option value="2">Some Experience</option>
                        <option value="3" selected>Handy (done similar projects)</option>
                        <option value="4">Experienced DIYer</option>
                        <option value="5">Semi-Pro</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Project Size (estimated material cost $)</label>
                    <input type="number" id="materialCost" min="50" value="500" step="50" required>
                </div>
                <div class="input-group">
                    <label>Your hourly wage / value of time ($/hr)</label>
                    <input type="number" id="hourlyRate" min="0" value="30" step="5" required>
                </div>
                <button type="submit" class="btn-primary w-full">Compare DIY vs Pro</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">When to DIY vs Hire</h2>
            <div class="pro-tip mb-6">
                <h4 class="font-bold mb-2">💡 Pro Tip</h4>
                <p>DIY saves 40-60% on labor but costs you time. Factor in tool rental, learning curve, and risk of mistakes.</p>
            </div>
            <h3 class="text-2xl font-bold mt-6 mb-3">Always Hire a Pro For:</h3>
            <ul class="list-disc pl-6 space-y-2">
                <li>Electrical panel work (safety + code)</li>
                <li>Gas line work (explosion risk)</li>
                <li>Structural modifications (load-bearing walls)</li>
                <li>Roofing (fall risk + warranty)</li>
                <li>Anything requiring permits in your area</li>
            </ul>
        `
    };

    const projectData = {
        painting:    { proRate: 3.50, diyHours: 1.5, proHours: 0.8, toolCost: 80, difficulty: 2, permitReq: false, safetyRisk: 'Low' },
        tile:        { proRate: 8.00, diyHours: 3.0, proHours: 1.2, toolCost: 150, difficulty: 4, permitReq: false, safetyRisk: 'Low' },
        deck:        { proRate: 15.0, diyHours: 4.0, proHours: 1.5, toolCost: 200, difficulty: 4, permitReq: true, safetyRisk: 'Medium' },
        plumbing:    { proRate: 5.00, diyHours: 3.0, proHours: 1.0, toolCost: 100, difficulty: 3, permitReq: true, safetyRisk: 'Medium' },
        electrical:  { proRate: 6.00, diyHours: 3.0, proHours: 1.0, toolCost: 75, difficulty: 5, permitReq: true, safetyRisk: 'High' },
        drywall:     { proRate: 3.00, diyHours: 2.0, proHours: 0.7, toolCost: 60, difficulty: 3, permitReq: false, safetyRisk: 'Low' },
        flooring:    { proRate: 5.00, diyHours: 2.5, proHours: 1.0, toolCost: 120, difficulty: 3, permitReq: false, safetyRisk: 'Low' },
        fence:       { proRate: 10.0, diyHours: 3.5, proHours: 1.5, toolCost: 100, difficulty: 3, permitReq: true, safetyRisk: 'Low' }
    };

    function calculate(e) {
        e.preventDefault();
        const project = document.getElementById('project').value;
        const skill = parseInt(document.getElementById('skill').value);
        const matCost = parseFloat(document.getElementById('materialCost').value);
        const hourly = parseFloat(document.getElementById('hourlyRate').value);
        const p = projectData[project];

        // Estimate sq ft from material cost (rough)
        const sqft = matCost / (p.proRate * 0.4); // material is ~40% of pro rate
        const diyTimeMult = 1 + (3 - Math.min(skill, 3)) * 0.5; // beginners take longer
        const diyHours = (sqft / 100) * p.diyHours * diyTimeMult;
        const proLabor = sqft * p.proRate;
        const diyCost = matCost + p.toolCost + (diyHours * hourly);
        const proCost = matCost + proLabor;
        const savings = proCost - diyCost;
        const rec = (savings > 0 && p.difficulty <= skill + 1 && p.safetyRisk !== 'High') ? 'DIY' : 'Hire a Pro';

        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-3xl font-bold mb-4">Recommendation: ${rec}</h3>
            <div class="bg-white bg-opacity-20 rounded-lg p-4">
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div class="text-center border-r border-white">
                        <div class="text-sm opacity-80">DIY Cost</div>
                        <div class="text-2xl font-bold">$${diyCost.toFixed(0)}</div>
                        <div class="text-xs opacity-70">${diyHours.toFixed(0)} hrs your time</div>
                    </div>
                    <div class="text-center">
                        <div class="text-sm opacity-80">Pro Cost</div>
                        <div class="text-2xl font-bold">$${proCost.toFixed(0)}</div>
                        <div class="text-xs opacity-70">materials + labor</div>
                    </div>
                </div>
                <div class="space-y-2 text-sm">
                    <div class="flex justify-between"><span>Materials:</span><span>$${matCost}</span></div>
                    <div class="flex justify-between"><span>Tool rental/purchase:</span><span>$${p.toolCost}</span></div>
                    <div class="flex justify-between"><span>Your time value:</span><span>$${(diyHours * hourly).toFixed(0)} (${diyHours.toFixed(0)} hrs × $${hourly})</span></div>
                    <div class="flex justify-between"><span>Pro labor:</span><span>$${proLabor.toFixed(0)}</span></div>
                    <div class="flex justify-between"><span>Difficulty:</span><span>${'★'.repeat(p.difficulty)}${'☆'.repeat(5 - p.difficulty)}</span></div>
                    <div class="flex justify-between"><span>Permit needed:</span><span>${p.permitReq ? '⚠️ Yes' : 'No'}</span></div>
                    <div class="flex justify-between"><span>Safety risk:</span><span>${p.safetyRisk}</span></div>
                    ${savings > 0 ? `<div class="border-t border-white pt-2 font-bold">💰 DIY saves ~$${savings.toFixed(0)}</div>` : `<div class="border-t border-white pt-2 font-bold">💡 Hiring a pro saves time and hassle</div>`}
                </div>
            </div>
        `;
    }

    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('diyForm').addEventListener('submit', calculate);
    loadRelatedTools('planning');
})();

function loadRelatedTools(category) {
    fetch('../tools-data.json').then(r => r.json()).then(tools => {
        const related = tools.filter(t => t.category === category).slice(0, 3);
        document.getElementById('relatedTools').innerHTML = related.map(t => `
            <a href="${t.slug}.html" class="tool-card block">
                <div class="text-3xl mb-2">${t.icon}</div>
                <h4 class="font-bold">${t.name}</h4>
                <p class="text-sm text-gray-600">${t.desc}</p>
            </a>
        `).join('');
    });
}
