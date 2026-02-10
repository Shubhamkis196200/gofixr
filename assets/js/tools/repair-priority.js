// Repair Priority Matrix - Rate and prioritize home repairs
(function() {
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Repair Priority Matrix</h2>
            <p class="text-gray-600 mb-4">List your home repairs, rate each one, and get a prioritized action plan.</p>
            <div id="repairList" class="space-y-4"></div>
            <button type="button" id="addRepair" class="w-full border-2 border-dashed border-gray-300 rounded-lg p-3 text-gray-500 hover:border-blue-400 hover:text-blue-500 mt-4">+ Add Another Repair</button>
            <button type="button" id="prioritize" class="btn-primary w-full mt-4">Prioritize My Repairs</button>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">How to Prioritize Home Repairs</h2>
            <div class="pro-tip mb-6">
                <h4 class="font-bold mb-2">💡 Pro Tip</h4>
                <p>Safety issues always come first. A cosmetic kitchen update can wait — a leaking roof or faulty wiring cannot.</p>
            </div>
            <h3 class="text-2xl font-bold mt-6 mb-3">Priority Framework</h3>
            <ul class="list-disc pl-6 space-y-2">
                <li><strong>Safety (weight: 5×):</strong> Could this hurt someone? Electrical hazards, structural issues, mold, tripping hazards</li>
                <li><strong>Damage Prevention (4×):</strong> Will this get worse if ignored? Leaks, foundation cracks, pest infestations</li>
                <li><strong>Urgency (3×):</strong> How soon does it need attention? Is something not functional?</li>
                <li><strong>Cost to Fix (2×):</strong> Is it cheap now but expensive later? Catching problems early saves money</li>
                <li><strong>Home Value (1×):</strong> Does this affect resale or livability?</li>
            </ul>
        `
    };

    let repairCount = 0;

    function addRepairRow() {
        repairCount++;
        const div = document.createElement('div');
        div.className = 'bg-gray-50 rounded-lg p-4 repair-item';
        div.innerHTML = `
            <div class="flex justify-between items-center mb-2">
                <span class="font-bold text-sm">Repair #${repairCount}</span>
                <button type="button" class="text-red-400 text-sm remove-btn" onclick="this.closest('.repair-item').remove()">✕ Remove</button>
            </div>
            <div class="input-group mb-2">
                <input type="text" class="repair-name" placeholder="What needs fixing? (e.g., Leaking bathroom faucet)" required>
            </div>
            <div class="grid grid-cols-5 gap-2 text-xs">
                <div class="input-group">
                    <label>Safety Risk</label>
                    <select class="r-safety"><option value="1">1-None</option><option value="2">2-Low</option><option value="3" selected>3-Med</option><option value="4">4-High</option><option value="5">5-Critical</option></select>
                </div>
                <div class="input-group">
                    <label>Gets Worse?</label>
                    <select class="r-damage"><option value="1">1-Stable</option><option value="2">2-Slow</option><option value="3" selected>3-Moderate</option><option value="4">4-Fast</option><option value="5">5-Rapidly</option></select>
                </div>
                <div class="input-group">
                    <label>Urgency</label>
                    <select class="r-urgency"><option value="1">1-Someday</option><option value="2">2-This year</option><option value="3" selected>3-Soon</option><option value="4">4-This month</option><option value="5">5-Now!</option></select>
                </div>
                <div class="input-group">
                    <label>Est. Cost</label>
                    <select class="r-cost"><option value="1">1-$$$$$</option><option value="2">2-$$$$</option><option value="3" selected>3-$$$</option><option value="4">4-$$</option><option value="5">5-$</option></select>
                </div>
                <div class="input-group">
                    <label>Value Impact</label>
                    <select class="r-value"><option value="1">1-None</option><option value="2">2-Low</option><option value="3" selected>3-Med</option><option value="4">4-High</option><option value="5">5-Major</option></select>
                </div>
            </div>
        `;
        document.getElementById('repairList').appendChild(div);
    }

    function prioritize() {
        const items = document.querySelectorAll('.repair-item');
        if (items.length === 0) { addRepairRow(); return; }
        
        const repairs = [];
        items.forEach(item => {
            const name = item.querySelector('.repair-name').value.trim();
            if (!name) return;
            const safety = parseInt(item.querySelector('.r-safety').value);
            const damage = parseInt(item.querySelector('.r-damage').value);
            const urgency = parseInt(item.querySelector('.r-urgency').value);
            const cost = parseInt(item.querySelector('.r-cost').value);
            const value = parseInt(item.querySelector('.r-value').value);
            // Weighted score: safety 5x, damage 4x, urgency 3x, cost efficiency 2x, value 1x
            const score = safety * 5 + damage * 4 + urgency * 3 + cost * 2 + value * 1;
            const maxScore = 75; // 5*5 + 5*4 + 5*3 + 5*2 + 5*1
            repairs.push({ name, safety, damage, urgency, cost, value, score, pct: (score / maxScore * 100).toFixed(0) });
        });

        if (repairs.length === 0) return;
        repairs.sort((a, b) => b.score - a.score);

        const tierLabels = (pct) => {
            if (pct >= 75) return ['🔴 DO NOW', 'bg-red-600'];
            if (pct >= 55) return ['🟠 DO SOON', 'bg-orange-500'];
            if (pct >= 35) return ['🟡 PLAN FOR', 'bg-yellow-600'];
            return ['🟢 CAN WAIT', 'bg-green-600'];
        };

        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-3xl font-bold mb-4">Prioritized Repair Plan</h3>
            <p class="mb-4 opacity-80">${repairs.length} repairs ranked by weighted score</p>
            <div class="space-y-3">
                ${repairs.map((r, idx) => {
                    const [label, bgClass] = tierLabels(parseInt(r.pct));
                    return `
                    <div class="bg-white bg-opacity-10 rounded-lg p-4">
                        <div class="flex justify-between items-center mb-2">
                            <span class="font-bold">#${idx + 1}. ${r.name}</span>
                            <span class="text-xs px-2 py-1 rounded ${bgClass}">${label}</span>
                        </div>
                        <div class="w-full bg-white bg-opacity-10 rounded-full h-2 mb-2">
                            <div class="bg-blue-400 h-2 rounded-full" style="width:${r.pct}%"></div>
                        </div>
                        <div class="grid grid-cols-5 gap-1 text-xs opacity-70">
                            <span>Safety: ${r.safety}/5</span>
                            <span>Damage: ${r.damage}/5</span>
                            <span>Urgency: ${r.urgency}/5</span>
                            <span>Cost: ${r.cost}/5</span>
                            <span>Value: ${r.value}/5</span>
                        </div>
                        <div class="text-right text-sm font-bold mt-1">Score: ${r.score}/75 (${r.pct}%)</div>
                    </div>`;
                }).join('')}
            </div>
        `;
    }

    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    // Add 3 starter rows
    addRepairRow(); addRepairRow(); addRepairRow();
    document.getElementById('addRepair').addEventListener('click', addRepairRow);
    document.getElementById('prioritize').addEventListener('click', prioritize);
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
