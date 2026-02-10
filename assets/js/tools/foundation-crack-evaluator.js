// Foundation Crack Evaluator
(function() {
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Foundation Crack Evaluator</h2>
            <form id="diagForm" class="space-y-4">
                <div class="input-group">
                    <label>What type of crack do you see?</label>
                    <select id="symptom" required>
                        <option value="">Select crack type...</option>
                        <option value="hairline">Hairline crack (less than 1/16")</option>
                        <option value="vertical">Vertical crack</option>
                        <option value="horizontal">Horizontal crack</option>
                        <option value="diagonal">Diagonal / stair-step crack</option>
                        <option value="wide">Wide crack (over 1/4")</option>
                        <option value="leaking">Crack with water seepage</option>
                        <option value="bowing">Wall bowing or bulging</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Is the crack growing?</label>
                    <select id="timing">
                        <option value="stable">Appears stable</option>
                        <option value="growing">Getting wider/longer</option>
                        <option value="unknown">Not sure</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary w-full">Evaluate Crack</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Foundation Crack Guide</h2>
            <div class="danger-box mb-6">
                <h4 class="font-bold">⚠️ When to Worry</h4>
                <p>Horizontal cracks, bowing walls, and cracks wider than ¼" are structural concerns and require professional evaluation. Vertical hairline cracks in poured concrete are usually normal settling.</p>
            </div>
            <h3 class="text-2xl font-bold mb-3">Understanding Foundation Cracks</h3>
            <p class="mb-4">Nearly every foundation develops some cracks over time. The key is distinguishing cosmetic cracks from structural problems.</p>
            <h3 class="text-2xl font-bold mb-3">Severity Scale</h3>
            <ul class="list-disc pl-6 space-y-2 mb-6">
                <li><strong>Low concern:</strong> Hairline cracks, vertical cracks under ¼", no water</li>
                <li><strong>Moderate concern:</strong> Diagonal cracks, cracks with water seepage, growing cracks</li>
                <li><strong>High concern:</strong> Horizontal cracks, bowing walls, cracks over ¼", displacement</li>
            </ul>
            <h3 class="text-2xl font-bold mb-3">Monitoring Cracks</h3>
            <p>Place a pencil mark at each end of the crack and date it. Check monthly. If marks separate, the crack is growing — time for a professional assessment.</p>
        `
    };

    const solutions = {
        'hairline': {
            title: 'Hairline Cracks — Low Concern',
            checks: [
                'Hairline cracks (under 1/16") in poured concrete are extremely common and usually caused by normal curing shrinkage',
                'These are cosmetic, not structural — they don\'t compromise your foundation\'s integrity',
                'If the crack is dry, seal it with concrete crack filler or flexible masonry caulk to prevent water entry',
                'For basement walls, use hydraulic cement or an epoxy injection kit for a waterproof seal ($20–40 DIY)',
                'Monitor by marking the crack ends with a pencil and date — check quarterly',
                'If a hairline crack starts to widen beyond 1/8", reassess and consider professional evaluation'
            ]
        },
        'vertical': {
            title: 'Vertical Cracks — Usually Low Concern',
            checks: [
                'Vertical cracks in poured concrete walls are typically caused by shrinkage during curing — very common',
                'If the crack is under ¼" wide and not leaking, it\'s likely cosmetic and can be filled with epoxy injection',
                'Vertical cracks in block walls follow the mortar joints — fill with masonry caulk',
                'If the crack is wider at the top than the bottom, settling may be occurring — monitor closely',
                'Seal from inside with epoxy or polyurethane injection to prevent water intrusion ($30–50 DIY, $300–600 professional)',
                'If the vertical crack is wider than ¼" or growing, have a structural engineer evaluate ($300–500 for assessment)'
            ]
        },
        'horizontal': {
            title: 'Horizontal Cracks — HIGH Concern ⚠️',
            checks: [
                'Horizontal cracks indicate lateral pressure from soil pushing against the wall — this IS a structural issue',
                'Do NOT ignore this — horizontal cracks can lead to wall failure if not addressed',
                'Measure and photograph the crack. Note if the wall above the crack is shifting inward',
                'Common causes: hydrostatic pressure (wet soil), frost heave, expansive clay soil, or heavy equipment near the foundation',
                'Temporary: monitor with crack gauges and reduce soil moisture by improving drainage away from the foundation',
                'Call a structural engineer for evaluation — repair options include carbon fiber straps ($500–1,000/strap), wall anchors, or steel I-beams',
                'This is NOT a DIY repair — professional intervention is required'
            ]
        },
        'diagonal': {
            title: 'Diagonal / Stair-Step Cracks — Moderate Concern',
            checks: [
                'Diagonal cracks often indicate differential settling — one part of the foundation is settling faster than another',
                'Stair-step cracks in block/brick walls follow the mortar joints diagonally — a common settling pattern',
                'If the crack is under ¼" and not growing, fill with masonry caulk and monitor',
                'Check outside for contributing factors: poor drainage, downspouts dumping water near the foundation, tree roots',
                'Improve drainage: grade soil away from the foundation (6" drop over 10 feet), extend downspouts 4+ feet from the house',
                'If cracks are widening, a structural engineer should assess — potential solutions include helical piers or push piers ($1,000–3,000 per pier)'
            ]
        },
        'wide': {
            title: 'Wide Cracks (Over ¼") — HIGH Concern ⚠️',
            checks: [
                'Cracks wider than ¼" are beyond normal settling and warrant professional evaluation',
                'Check if the two sides of the crack are offset (one side higher/lower than the other) — this indicates structural movement',
                'Document with photos and measurements. Mark the crack ends with dates for monitoring',
                'Wide cracks allow significant water intrusion and pest entry — seal temporarily with hydraulic cement',
                'A structural engineer ($300–500) can determine the cause and recommend repair',
                'Repair may involve underpinning with piers, wall reinforcement, or in severe cases, partial wall replacement',
                'Do not attempt to structurally repair wide cracks yourself'
            ]
        },
        'leaking': {
            title: 'Crack with Water Seepage',
            checks: [
                'Address exterior drainage first: clean gutters, extend downspouts 4+ feet away, grade soil away from foundation',
                'For small leaking cracks, inject with polyurethane foam — it expands to seal the crack and stays flexible ($40–80 DIY kit)',
                'Hydraulic cement can stop active water flow temporarily for emergency situations',
                'Epoxy injection creates a stronger seal but is rigid — better for stable, non-moving cracks',
                'Consider interior French drain and sump pump if multiple cracks leak — typical cost $3,000–8,000',
                'Exterior waterproofing (excavating and applying membrane) is the gold standard but expensive ($5,000–15,000+)',
                'Persistent water seepage can lead to mold — address promptly and check humidity levels with a hygrometer'
            ]
        },
        'bowing': {
            title: 'Bowing or Bulging Wall — URGENT ⚠️',
            checks: [
                'A bowing wall is a serious structural emergency — the wall is being pushed inward by soil pressure',
                'Measure the bow: place a straight board or string line against the wall to determine how far it has deflected',
                'Do NOT store heavy items against a bowing wall or make any openings in it',
                'Call a structural engineer immediately — bowing over 2 inches may require urgent intervention',
                'Common repairs: carbon fiber straps (for minor bowing, under 2"), wall anchors (moderate), or steel I-beams (severe)',
                'Contributing factors to address: improve exterior drainage, remove heavy landscaping near the wall',
                'Costs range from $5,000 to $15,000+ depending on severity and repair method'
            ]
        }
    };

    function diagnose(e) {
        e.preventDefault();
        const symptom = document.getElementById('symptom').value;
        if (!symptom) return;
        
        const solution = solutions[symptom];
        document.getElementById('result').className = 'tool-card mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-2xl font-bold mb-4">🏗️ ${solution.title}</h3>
            <h4 class="font-bold mb-3">Assessment & Recommended Actions:</h4>
            <div class="space-y-2">
                ${solution.checks.map((check, i) => `
                    <label class="flex gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input type="checkbox">
                        <span>${i + 1}. ${check}</span>
                    </label>
                `).join('')}
            </div>
        `;
    }

    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('diagForm').addEventListener('submit', diagnose);
    loadRelatedTools('diagnostic');
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
