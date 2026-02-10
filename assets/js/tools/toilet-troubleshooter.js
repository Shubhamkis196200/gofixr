// Toilet Troubleshooter
(function() {
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Toilet Troubleshooter</h2>
            <form id="diagForm" class="space-y-4">
                <div class="input-group">
                    <label>What's the problem?</label>
                    <select id="symptom" required>
                        <option value="">Select a symptom...</option>
                        <option value="running">Toilet keeps running</option>
                        <option value="clogged">Toilet is clogged</option>
                        <option value="leaking-base">Leaking at the base</option>
                        <option value="weak-flush">Weak or incomplete flush</option>
                        <option value="phantom-flush">Phantom flushing (flushes on its own)</option>
                        <option value="noisy">Noisy when filling</option>
                        <option value="rocks">Rocks back and forth</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>When did it start?</label>
                    <select id="timing">
                        <option value="sudden">Suddenly</option>
                        <option value="gradual">Gradually getting worse</option>
                        <option value="always">Has always done this</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary w-full">Diagnose Problem</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Toilet Troubleshooting Guide</h2>
            <div class="danger-box mb-6">
                <h4 class="font-bold">⚠️ Before You Start</h4>
                <p>Locate the shut-off valve behind the toilet (turn clockwise to close). Keep towels handy for any water spills. Wear rubber gloves for hygiene.</p>
            </div>
            <h3 class="text-2xl font-bold mb-3">How a Toilet Works</h3>
            <p class="mb-4">Understanding the basic parts helps you diagnose issues faster:</p>
            <ul class="list-disc pl-6 space-y-2 mb-6">
                <li><strong>Flapper valve:</strong> Rubber seal at the bottom of the tank — lifts when you flush to release water</li>
                <li><strong>Fill valve:</strong> Controls water flow into the tank after a flush</li>
                <li><strong>Float:</strong> Rises with water level and signals the fill valve to stop</li>
                <li><strong>Wax ring:</strong> Seals the toilet base to the floor drain</li>
                <li><strong>Flange:</strong> Metal or plastic ring that connects the toilet to the drain pipe</li>
            </ul>
            <h3 class="text-2xl font-bold mb-3">When to Call a Plumber</h3>
            <ul class="list-disc pl-6 space-y-2">
                <li>Sewage backing up into other fixtures</li>
                <li>Cracks in the porcelain tank or bowl</li>
                <li>Persistent leaks after replacing wax ring</li>
                <li>Gurgling sounds from multiple drains (indicates main line issue)</li>
            </ul>
        `
    };

    const solutions = {
        'running': {
            title: 'Toilet Keeps Running',
            checks: [
                'Lift the tank lid and check if the flapper valve is sealing properly — press down on it to see if water stops',
                'Inspect the flapper for cracks, warping, or mineral buildup — replace if worn (universal flappers cost $5–10)',
                'Check the float height — if water is flowing into the overflow tube, the float is set too high',
                'Adjust the float by turning the screw on top of the fill valve, or bend the float arm down slightly',
                'If the fill valve is old or hissing, replace it entirely (about $8–15 at any hardware store)',
                'Check the chain length — too short keeps flapper open, too long can get caught under the flapper'
            ]
        },
        'clogged': {
            title: 'Clogged Toilet',
            checks: [
                'Use a flange plunger (the kind with an extended rubber lip) — regular cup plungers are less effective on toilets',
                'Plunge with slow, steady strokes: push gently to seat the plunger, then pull sharply to create suction',
                'If plunging fails, try a toilet auger (closet auger) — feed the cable in while turning the handle clockwise',
                'For stubborn clogs, pour hot (not boiling) water with dish soap into the bowl and wait 15 minutes before plunging',
                'Never use chemical drain cleaners in toilets — they can damage the wax ring and porcelain',
                'If the toilet clogs repeatedly, the problem may be further down the drain line — call a plumber'
            ]
        },
        'leaking-base': {
            title: 'Leaking at the Base',
            checks: [
                'Confirm it\'s a base leak and not condensation — dry the area and lay paper towels to find the exact source',
                'Tighten the two closet bolts on either side of the toilet base (don\'t over-tighten or the porcelain may crack)',
                'If tightening doesn\'t help, the wax ring has likely failed and needs replacement',
                'To replace the wax ring: shut off water, flush and sponge out remaining water, unbolt and lift toilet straight up',
                'Scrape off the old wax ring from the flange and toilet base, then press a new wax ring onto the flange',
                'Reseat the toilet, press firmly, and re-tighten bolts evenly. Caulk around the base (leave back unsealed for leak detection)'
            ]
        },
        'weak-flush': {
            title: 'Weak or Incomplete Flush',
            checks: [
                'Check the water level in the tank — it should be about 1 inch below the top of the overflow tube',
                'Adjust the float or fill valve to increase the tank water level if it\'s too low',
                'Clean the rim jets (holes under the toilet rim) with a wire hanger or small brush — mineral deposits block water flow',
                'Soak the rim jets by plugging them with plumber\'s putty and pouring vinegar into the overflow tube overnight',
                'Check if the flapper is closing too quickly — adjust the chain or replace with an adjustable flapper',
                'Older low-flow toilets (pre-1994) may just be inefficient — consider upgrading to a modern WaterSense model'
            ]
        },
        'phantom-flush': {
            title: 'Phantom Flushing',
            checks: [
                'This is almost always caused by a slow leak from the tank into the bowl through a worn flapper',
                'Add a few drops of food coloring to the tank — if color appears in the bowl within 15 minutes, the flapper leaks',
                'Replace the flapper with one rated for your toilet model (check the brand and flush valve size)',
                'Also inspect the flush valve seat (the ring the flapper sits on) for pitting or mineral buildup — sand lightly if rough',
                'If the flush valve seat is damaged, install a flush valve seat repair kit rather than replacing the whole valve'
            ]
        },
        'noisy': {
            title: 'Noisy When Filling',
            checks: [
                'A loud foghorn or vibrating sound usually means the fill valve diaphragm is worn — replace the fill valve',
                'Hissing sounds indicate water flowing past the fill valve continuously — check float adjustment',
                'Banging or hammering sounds (water hammer) when the valve shuts off — install a water hammer arrestor on the supply line',
                'Gurgling from the bowl may indicate a partially blocked vent pipe — check the roof vent for debris',
                'Try cleaning the fill valve: turn off water, remove cap, hold cup over the opening, turn water on briefly to flush debris'
            ]
        },
        'rocks': {
            title: 'Toilet Rocks Back and Forth',
            checks: [
                'Check if the closet bolts are loose — tighten them evenly on both sides (alternate sides, quarter-turn at a time)',
                'If the floor is uneven, use plastic toilet shims (available at hardware stores) to stabilize the base',
                'A cracked or broken flange can prevent the toilet from sitting securely — inspect and repair/replace the flange',
                'After shimming, caulk around the base to seal out water and prevent movement (leave back gap for leak detection)',
                'If the flange sits below the floor level, use a flange extender ring to bring it flush with the finished floor'
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
            <h3 class="text-2xl font-bold mb-4">🔧 ${solution.title}</h3>
            <h4 class="font-bold mb-3">Step-by-Step Fix:</h4>
            <div class="space-y-2">
                ${solution.checks.map((check, i) => `
                    <label class="flex gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input type="checkbox">
                        <span>${i + 1}. ${check}</span>
                    </label>
                `).join('')}
            </div>
            <div class="mt-4 p-3 bg-orange-50 rounded-lg text-sm">
                <strong>💰 Estimated DIY Cost:</strong> $5–$25 for most toilet repairs (flapper, fill valve, wax ring)
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
