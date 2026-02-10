// Roof Leak Locator
(function() {
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Roof Leak Locator</h2>
            <form id="diagForm" class="space-y-4">
                <div class="input-group">
                    <label>Where do you see water/damage?</label>
                    <select id="symptom" required>
                        <option value="">Select location...</option>
                        <option value="ceiling-center">Water stain on ceiling (center of room)</option>
                        <option value="ceiling-edge">Water stain near exterior wall</option>
                        <option value="chimney">Leak near chimney</option>
                        <option value="vent">Leak around vent pipe or skylight</option>
                        <option value="valley">Leak in roof valley area</option>
                        <option value="ice-dam">Leaking during/after ice or snow</option>
                        <option value="gutter-area">Leak behind gutters/fascia</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>When does it leak?</label>
                    <select id="timing">
                        <option value="rain">Only during rain</option>
                        <option value="after-rain">Hours after rain</option>
                        <option value="snow-melt">During snow/ice melt</option>
                        <option value="always">Drips even without rain</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary w-full">Locate Leak Source</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Roof Leak Detection Guide</h2>
            <div class="danger-box mb-6">
                <h4 class="font-bold">⚠️ Roof Safety</h4>
                <p>Never walk on a wet, icy, or steep roof. Use binoculars from the ground when possible. If you must go on the roof, use a properly secured ladder and wear non-slip shoes. Consider hiring a roofer for inspection.</p>
            </div>
            <h3 class="text-2xl font-bold mb-3">Key Principle: Water Travels</h3>
            <p class="mb-4">The stain on your ceiling is rarely directly below the actual roof leak. Water enters the roof and travels along rafters, sheathing, or pipes before dripping down. The actual entry point may be several feet uphill from the stain.</p>
            <h3 class="text-2xl font-bold mb-3">Most Common Leak Points</h3>
            <ul class="list-disc pl-6 space-y-2 mb-6">
                <li><strong>Flashing</strong> — around chimneys, vents, skylights, and wall intersections (90% of leaks)</li>
                <li><strong>Roof valleys</strong> — where two roof planes meet</li>
                <li><strong>Missing/damaged shingles</strong> — from wind, age, or storm damage</li>
                <li><strong>Pipe boot seals</strong> — the rubber seals around plumbing vents crack after 10–15 years</li>
            </ul>
        `
    };

    const solutions = {
        'ceiling-center': {
            title: 'Ceiling Stain — Center of Room',
            checks: [
                'Go into the attic with a flashlight and look for water trails on the underside of the roof sheathing',
                'Follow any water stains or trails uphill (toward the ridge) to find the actual entry point',
                'Check for any plumbing vents that pass through the roof above this area — the rubber boot seal often cracks',
                'Look for daylight showing through the roof sheathing — any light means water can get in',
                'Mark the spot from the attic, then measure the distance to a reference point (like a vent) to find it from outside',
                'From outside/ground, inspect the roof area above for cracked, curled, or missing shingles'
            ]
        },
        'ceiling-edge': {
            title: 'Ceiling Stain — Near Exterior Wall',
            checks: [
                'This often indicates an ice dam issue or failed step flashing where the roof meets a wall',
                'Check the flashing where the roof meets any walls — the metal should extend behind siding and over shingles',
                'Inspect the soffit and fascia for water damage — gutters overflowing can force water under the roof edge',
                'Look for clogged gutters directly above the stain — clean them and check for proper drainage',
                'From the attic, check where the roof meets the exterior wall — insulation may be blocking ventilation and causing condensation',
                'Make sure bathroom/kitchen exhaust fans vent outside, not into the attic (condensation source)'
            ]
        },
        'chimney': {
            title: 'Leak Near Chimney',
            checks: [
                'Chimney flashing is the #1 leak source. Check where the metal flashing meets the chimney and roof',
                'Look for cracks in the chimney crown (the cement cap on top) — water enters here and runs down inside',
                'Check if the caulk/sealant where flashing meets chimney brick has cracked or pulled away',
                'Step flashing (individual L-shaped pieces) along the chimney sides should overlap like shingles — look for gaps',
                'The chimney cricket (a small peaked structure behind the chimney) may be damaged or missing on chimneys wider than 30"',
                'Apply roofing cement as a temporary fix; for a lasting repair, have a roofer re-flash the chimney ($300–700)'
            ]
        },
        'vent': {
            title: 'Leak Around Vent Pipe or Skylight',
            checks: [
                'Plumbing vent boots (the rubber seal around the pipe) crack after 10–15 years — inspect and replace ($10–20 DIY)',
                'Skylight leaks: check the flashing around all four sides. Condensation inside the skylight is a different issue (ventilation)',
                'From the attic, look for water stains around the vent or skylight penetration',
                'Ensure the shingles overlap the upper portion of the vent boot flashing correctly',
                'For skylight leaks, re-seal with roofing sealant as a temporary fix; reflashing is the permanent solution',
                'Check that the vent pipe isn\'t cracked above the roof line — PVC pipes can crack in extreme cold'
            ]
        },
        'valley': {
            title: 'Roof Valley Leak',
            checks: [
                'Valleys handle a large volume of water — any debris accumulation creates a dam that forces water under shingles',
                'Clear leaves and debris from roof valleys — this is critical maintenance',
                'Check for cracked, rusted, or lifted valley flashing metal',
                'Look for shingle edges that have curled or lifted in the valley — wind-driven rain gets underneath',
                'If the valley uses a woven or closed-cut shingle method (no metal), seams may have opened — re-seal or re-shingle',
                'Valley leaks often require a roofer to properly repair — $200–600 depending on extent'
            ]
        },
        'ice-dam': {
            title: 'Ice Dam Leak',
            checks: [
                'Ice dams form when heat escaping through the roof melts snow, which refreezes at the cold eaves',
                'Immediate relief: use calcium chloride ice melt in a stocking laid across the dam to create a channel (NOT rock salt)',
                'Do NOT chop ice off the roof — you\'ll damage the shingles',
                'Long-term fix #1: Add attic insulation to prevent heat loss through the roof (R-38 to R-60 recommended)',
                'Long-term fix #2: Improve attic ventilation — soffit vents + ridge vent keeps the roof deck cold and uniform',
                'Seal attic air leaks around light fixtures, plumbing penetrations, and the attic hatch — these are major heat escape routes',
                'When re-roofing, install ice-and-water shield membrane on the first 3–6 feet from the eaves'
            ]
        },
        'gutter-area': {
            title: 'Leak Behind Gutters/Fascia',
            checks: [
                'Clogged gutters overflow behind the gutter, soaking the fascia board and potentially entering the roof edge',
                'Clean gutters thoroughly and make sure downspouts drain freely',
                'Check that the gutter is sloped correctly toward downspouts (about ¼" per 10 feet)',
                'Inspect the fascia board for rot — soft or discolored fascia means water has been getting behind it',
                'A drip edge (metal strip under shingles, over fascia) directs water into the gutter — if missing, water runs down the fascia',
                'Replace rotted fascia and ensure drip edge is properly installed during any roof repair'
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
            <h3 class="text-2xl font-bold mb-4">🏠 ${solution.title}</h3>
            <h4 class="font-bold mb-3">Investigation Steps:</h4>
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
