// Plumbing Noise Identifier
(function() {
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Plumbing Noise Identifier</h2>
            <form id="diagForm" class="space-y-4">
                <div class="input-group">
                    <label>What does the noise sound like?</label>
                    <select id="symptom" required>
                        <option value="">Select the noise type...</option>
                        <option value="banging">Banging / hammering when tap shuts off</option>
                        <option value="whistling">Whistling or squealing</option>
                        <option value="gurgling">Gurgling from drains</option>
                        <option value="rattling">Rattling or vibrating pipes</option>
                        <option value="dripping">Dripping sound in walls</option>
                        <option value="hissing">Hissing near fixtures</option>
                        <option value="ticking">Ticking or clicking (hot water pipes)</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>When does it happen?</label>
                    <select id="timing">
                        <option value="sudden">When turning water on/off</option>
                        <option value="continuous">Continuously</option>
                        <option value="random">Randomly</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary w-full">Identify Noise</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Understanding Plumbing Noises</h2>
            <div class="danger-box mb-6">
                <h4 class="font-bold">⚠️ Important</h4>
                <p>Most plumbing noises are annoying but not emergencies. However, gurgling drains and dripping in walls should be investigated promptly to prevent water damage.</p>
            </div>
            <h3 class="text-2xl font-bold mb-3">Common Causes</h3>
            <ul class="list-disc pl-6 space-y-2 mb-6">
                <li><strong>Water hammer:</strong> Sudden pressure surge when a valve closes quickly</li>
                <li><strong>Loose pipe straps:</strong> Pipes vibrate against framing when water flows</li>
                <li><strong>Thermal expansion:</strong> Hot water pipes expand and contract, causing ticking</li>
                <li><strong>Venting issues:</strong> Blocked vent pipes cause gurgling and slow drains</li>
                <li><strong>High water pressure:</strong> Over 80 PSI causes noise and premature fixture wear</li>
            </ul>
            <h3 class="text-2xl font-bold mb-3">When to Worry</h3>
            <ul class="list-disc pl-6 space-y-2">
                <li>Dripping sounds when no faucets are on — possible hidden leak</li>
                <li>Multiple drains gurgling simultaneously — main line or vent issue</li>
                <li>Constant hissing — possible pressurized leak</li>
            </ul>
        `
    };

    const solutions = {
        'banging': {
            title: 'Water Hammer (Banging)',
            checks: [
                'Water hammer occurs when fast-closing valves (washing machines, dishwashers) stop water flow suddenly',
                'Try draining the air chambers: turn off main water, open all faucets until drained, close faucets, turn water back on',
                'Install water hammer arrestors near the problem fixture ($10–15 each, screw onto washing machine hoses)',
                'If your home has no arrestors, a plumber can install them at key points for about $150–300',
                'Reduce water pressure if it\'s above 80 PSI — install a pressure reducing valve at the main line',
                'Secure any loose pipes with pipe straps or foam insulation where they pass through framing'
            ]
        },
        'whistling': {
            title: 'Whistling or Squealing Pipes',
            checks: [
                'A whistling toilet fill valve is the most common cause — replace the fill valve ($8–15)',
                'Whistling at a specific faucet: the valve seat or washer inside is worn — replace the faucet cartridge or washers',
                'If the whole house whistles, the main shut-off valve may be partially closed — open it fully',
                'A pressure reducing valve set too low can cause whistling — have it adjusted (45–60 PSI is ideal)',
                'Old gate valves often cause whistling as they corrode — replace with ball valves',
                'If the noise only occurs at high flow (multiple fixtures running), water pressure may be too high'
            ]
        },
        'gurgling': {
            title: 'Gurgling Drains',
            checks: [
                'Gurgling means air is being pulled through the water in the trap — usually a venting problem',
                'Check the plumbing vent on your roof — it may be blocked by leaves, bird nests, or ice',
                'If one drain gurgles when another fixture is used, they may share an inadequately sized vent',
                'A gurgling toilet when the washing machine drains often means the main vent stack is partially blocked',
                'Try snaking the affected drain — a partial clog can also cause gurgling',
                'If multiple fixtures gurgle, the main sewer line may be partially blocked — call a plumber for a camera inspection'
            ]
        },
        'rattling': {
            title: 'Rattling or Vibrating Pipes',
            checks: [
                'Pipes expand and vibrate when water flows — if they\'re loose against joists or walls, they rattle',
                'Access the rattling area and secure pipes with pipe straps, padded clamps, or foam insulation',
                'Don\'t use galvanized straps on copper pipes (or vice versa) — use the correct strap material to avoid corrosion',
                'If rattling occurs only at certain flow rates, a pressure regulator can smooth out water flow',
                'Check the washing machine hoses — they can vibrate against the wall during fill and drain cycles',
                'Pad any spots where pipes contact framing with foam pipe insulation to dampen vibration'
            ]
        },
        'dripping': {
            title: 'Dripping Sound in Walls',
            checks: [
                'This could indicate a hidden leak — take it seriously and investigate promptly',
                'Check the water meter: turn off all water-using fixtures, then watch the meter. If it\'s still moving, you have a leak',
                'Feel walls for damp spots, look for water stains on ceilings, and check for musty smells',
                'Common leak sources: supply line connections, pin holes in copper pipes, corroded joints',
                'If you can\'t locate the leak, a plumber can use acoustic leak detection equipment ($150–300)',
                'In the meantime, know where your main water shut-off valve is in case you need to stop a worsening leak'
            ]
        },
        'hissing': {
            title: 'Hissing Near Fixtures',
            checks: [
                'Hissing at a toilet: the fill valve is leaking past the seal — jiggle the float or replace the fill valve',
                'Hissing at a faucet: water is being forced past a worn washer or cartridge — replace the internals',
                'Hissing from a pressure relief valve (water heater): pressure is too high — call a plumber',
                'A hissing sound from pipes with no fixture in use could be a pressurized leak — check water meter for movement',
                'If the hiss is near the water heater T&P valve, the valve may be venting excess pressure — a serious condition requiring attention'
            ]
        },
        'ticking': {
            title: 'Ticking / Clicking Sounds',
            checks: [
                'This is almost always thermal expansion — hot water pipes heat up and expand, rubbing against wood or straps',
                'It\'s normal and not harmful, but can be reduced by padding pipe contact points with foam',
                'CPVC (plastic) pipes are more prone to expansion noise than copper',
                'If ticking happens only when the water heater is running, it\'s the heat exchanger expanding — normal',
                'Wrapping hot water pipes with foam insulation reduces noise and also improves energy efficiency',
                'If the sound is more of a fast clicking, check the water meter or pressure regulator for malfunction'
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
            <h3 class="text-2xl font-bold mb-4">🔊 ${solution.title}</h3>
            <h4 class="font-bold mb-3">What It Means & How to Fix:</h4>
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
