// Garbage Disposal Fix Guide
(function() {
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Garbage Disposal Troubleshooter</h2>
            <form id="diagForm" class="space-y-4">
                <div class="input-group">
                    <label>What's happening?</label>
                    <select id="symptom" required>
                        <option value="">Select a symptom...</option>
                        <option value="wont-turn-on">Won't turn on at all</option>
                        <option value="humming">Hums but won't spin</option>
                        <option value="jammed">Jammed / stuck</option>
                        <option value="leaking">Leaking water</option>
                        <option value="smelly">Bad smell</option>
                        <option value="slow-drain">Drains slowly</option>
                        <option value="noise">Grinding or rattling noise</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>How old is the disposal?</label>
                    <select id="timing">
                        <option value="new">Less than 2 years</option>
                        <option value="mid">2–8 years</option>
                        <option value="old">8+ years</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary w-full">Diagnose Problem</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Garbage Disposal Care Guide</h2>
            <div class="danger-box mb-6">
                <h4 class="font-bold">⚠️ Safety First</h4>
                <p>NEVER put your hand in the disposal. Always turn off the power at the switch AND the breaker before any work. Use tongs or pliers to remove objects.</p>
            </div>
            <h3 class="text-2xl font-bold mb-3">What NOT to Put In</h3>
            <ul class="list-disc pl-6 space-y-2 mb-6">
                <li><strong>Grease or oil</strong> — solidifies and clogs pipes</li>
                <li><strong>Fibrous vegetables</strong> (celery, asparagus, corn husks) — wraps around blades</li>
                <li><strong>Pasta, rice, bread</strong> — expands with water and causes clogs</li>
                <li><strong>Coffee grounds</strong> — builds up in pipes over time</li>
                <li><strong>Bones, fruit pits</strong> — can damage or jam the impellers</li>
                <li><strong>Eggshells</strong> — membrane can wrap around impellers</li>
            </ul>
            <h3 class="text-2xl font-bold mb-3">Maintenance Tips</h3>
            <ul class="list-disc pl-6 space-y-2">
                <li>Run cold water for 15 seconds before and after use</li>
                <li>Clean weekly by grinding ice cubes and citrus peels</li>
                <li>Average lifespan: 8–15 years depending on use</li>
            </ul>
        `
    };

    const solutions = {
        'wont-turn-on': {
            title: 'Won\'t Turn On',
            checks: [
                'Press the red reset button on the bottom of the disposal unit — it trips when overloaded',
                'Check if the wall switch is on, and test the outlet with another appliance',
                'Check the circuit breaker or fuse for the disposal circuit',
                'If hardwired, the wall switch itself may be faulty — test with a voltage tester',
                'If the motor doesn\'t respond at all after reset and power is confirmed, the motor has likely burned out — replacement needed (~$100–300 installed)'
            ]
        },
        'humming': {
            title: 'Hums But Won\'t Spin',
            checks: [
                'TURN OFF THE DISPOSAL immediately — a humming motor that can\'t spin will overheat and burn out',
                'The flywheel is likely jammed. Insert the hex wrench (Allen key) that came with the unit into the hole on the bottom center',
                'No hex wrench? Use a ¼" Allen key. Turn back and forth to free the flywheel',
                'Alternatively, use a wooden broom handle from the top to try to rotate the impellers',
                'Once freed, press the reset button on the bottom before trying the switch again',
                'Run cold water and turn on — if it spins freely, the jam is cleared'
            ]
        },
        'jammed': {
            title: 'Jammed / Stuck',
            checks: [
                'Turn off the disposal and unplug it or switch off the breaker',
                'Use a flashlight to look inside — do you see a foreign object (utensil, bone, etc.)?',
                'Use long tongs or needle-nose pliers to remove any visible objects — NEVER use your hand',
                'Insert the Allen wrench in the bottom center and work the flywheel back and forth',
                'If no wrench, use a broom handle from the top to manually turn the impeller plate',
                'After clearing, press reset, run cold water, and test'
            ]
        },
        'leaking': {
            title: 'Leaking Water',
            checks: [
                'Identify where the leak is coming from: top (sink flange), side (dishwasher connection or drain pipe), or bottom',
                'Top leak: The mounting ring or plumber\'s putty seal has failed. Re-seal or tighten the mounting hardware',
                'Side leak at dishwasher inlet: Tighten the hose clamp on the dishwasher connection',
                'Side leak at drain pipe: Tighten the screws on the drain pipe connection or replace the gasket',
                'Bottom leak: The internal seal is broken — this usually means the unit needs to be replaced',
                'For any leak, place a bowl underneath and run water to pinpoint the exact source'
            ]
        },
        'smelly': {
            title: 'Bad Smell',
            checks: [
                'Grind 2 cups of ice cubes with ½ cup of rock salt to scour the inside walls',
                'Cut a lemon or lime into quarters and grind with cold water running for a fresh scent',
                'Pour ½ cup of baking soda in, let sit 30 minutes, then flush with vinegar and hot water',
                'Clean the rubber splash guard — lift the flaps and scrub with a brush and dish soap (this is the #1 smell source)',
                'For persistent odor, the drain pipe may have buildup — disconnect the P-trap and clean it out',
                'Make sure you always run the disposal long enough to fully clear food — at least 15 seconds after grinding stops'
            ]
        },
        'slow-drain': {
            title: 'Drains Slowly',
            checks: [
                'Run the disposal for 30+ seconds to fully grind remaining food, with cold water flowing',
                'Check under the sink: the drain pipe or P-trap may be clogged — disconnect and clean',
                'Use a sink plunger (block the other side of a double sink first) to clear the drain',
                'Never use chemical drain cleaners — they can damage the disposal seals and pipes',
                'The impellers may be worn and not grinding food finely enough — consider replacing if the unit is 8+ years old',
                'Make sure you\'re running enough cold water — without it, food doesn\'t flush through the drain properly'
            ]
        },
        'noise': {
            title: 'Grinding or Rattling Noise',
            checks: [
                'Turn off immediately — a hard object (metal, glass, bone) may be inside',
                'Use a flashlight to look for foreign objects and remove with tongs',
                'If no foreign objects, the impellers or flywheel may be loose — this often means the unit is wearing out',
                'A steady rattling could mean a mounting bolt has loosened — tighten the mounting assembly',
                'Screeching or metal-on-metal sounds indicate the bearings are failing — replacement is needed',
                'If the noise only happens with certain foods, you may just be overloading it — feed waste in gradually'
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
