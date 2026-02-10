// Water Heater Troubleshooter
(function() {
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Water Heater Troubleshooter</h2>
            <form id="diagForm" class="space-y-4">
                <div class="input-group">
                    <label>What's the problem?</label>
                    <select id="symptom" required>
                        <option value="">Select a symptom...</option>
                        <option value="no-hot-water">No hot water at all</option>
                        <option value="not-enough">Not enough hot water</option>
                        <option value="too-hot">Water is too hot</option>
                        <option value="leaking">Tank is leaking</option>
                        <option value="noisy">Making rumbling/popping noises</option>
                        <option value="smelly">Hot water smells like rotten eggs</option>
                        <option value="discolored">Rusty or discolored hot water</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Water heater type</label>
                    <select id="timing">
                        <option value="gas">Gas</option>
                        <option value="electric">Electric</option>
                        <option value="tankless">Tankless</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary w-full">Diagnose Problem</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Water Heater Troubleshooting Guide</h2>
            <div class="danger-box mb-6">
                <h4 class="font-bold">⚠️ Safety Warning</h4>
                <p>Gas water heaters: if you smell gas, leave immediately and call your gas company. Electric: always turn off the breaker before inspecting elements. Water temperature above 120°F can cause scalding.</p>
            </div>
            <h3 class="text-2xl font-bold mb-3">Maintenance Tips</h3>
            <ul class="list-disc pl-6 space-y-2 mb-6">
                <li><strong>Flush the tank annually</strong> to remove sediment buildup that reduces efficiency</li>
                <li><strong>Test the T&P (temperature & pressure) relief valve</strong> yearly — lift the lever and verify water flows, then snaps shut</li>
                <li><strong>Check the anode rod</strong> every 2–3 years — replace when less than ½ inch thick or coated in calcium</li>
                <li><strong>Insulate older tanks</strong> with a water heater blanket to save 7–16% on heating costs</li>
            </ul>
            <h3 class="text-2xl font-bold mb-3">Average Lifespan</h3>
            <ul class="list-disc pl-6 space-y-2">
                <li>Tank water heaters: 8–12 years</li>
                <li>Tankless water heaters: 15–20 years</li>
                <li>If your unit is near end-of-life and having issues, replacement may be more cost-effective than repair</li>
            </ul>
        `
    };

    const solutions = {
        'no-hot-water': {
            title: 'No Hot Water',
            checks: [
                'Gas: Check if the pilot light is lit — follow the relighting instructions on the tank label',
                'Gas: Make sure the gas valve is in the ON position (not "pilot" or "off")',
                'Electric: Check the circuit breaker — reset if tripped. If it trips again, call an electrician',
                'Electric: The upper or lower heating element may have burned out — test with a multimeter (should show 10–16 ohms)',
                'Check the thermostat setting — it should be at 120°F (gas: turn the dial; electric: adjust behind access panels)',
                'If the unit is old (10+ years) and none of these help, the tank may need replacement'
            ]
        },
        'not-enough': {
            title: 'Not Enough Hot Water',
            checks: [
                'Check the thermostat — raise it to 120°F if set lower (don\'t exceed 140°F)',
                'Sediment buildup reduces capacity: drain 1–2 gallons from the tank\'s drain valve and check for gritty particles',
                'If sediment is heavy, do a full tank flush: shut off heat, connect a hose to drain valve, flush until water runs clear',
                'A broken dip tube (common in units from the mid-1990s) sends cold water to the hot outlet — replace for ~$10',
                'Check if your household demand has increased — you may need a larger tank or a tankless unit',
                'In winter, incoming water is colder, which can reduce effective hot water output by 15–25%'
            ]
        },
        'too-hot': {
            title: 'Water Too Hot',
            checks: [
                'Lower the thermostat to 120°F — this is the recommended safe setting',
                'Gas: Turn the temperature dial on the front of the unit to a lower setting',
                'Electric: Turn off the breaker, remove access panel(s), and adjust thermostat with a flat screwdriver',
                'If the thermostat is set correctly but water is still scalding, the thermostat may be faulty — replace it',
                'Install anti-scald valves (thermostatic mixing valves) at faucets for added safety, especially with children in the home'
            ]
        },
        'leaking': {
            title: 'Tank Is Leaking',
            checks: [
                'Identify the leak source — from the top connections, T&P valve, drain valve, or the tank itself',
                'Top leaks: Tighten the cold water inlet and hot water outlet fittings. Check for pipe corrosion',
                'T&P valve dripping: This may indicate excess pressure or temperature. Replace the valve ($15–$20) if it drips constantly',
                'Drain valve leak: Tighten or replace the drain valve. A brass valve is more durable than plastic',
                'Leak from the tank body: This means internal corrosion — the tank cannot be repaired and must be replaced',
                'Place a drain pan under the unit and run a line to a drain to prevent water damage while you plan the fix'
            ]
        },
        'noisy': {
            title: 'Rumbling or Popping Noises',
            checks: [
                'These sounds are caused by sediment buildup on the tank bottom — minerals harden and trap water that boils and pops',
                'Flush the tank: turn off the heat source, connect a garden hose to the drain valve, and drain until water runs clear',
                'If flushing doesn\'t help, sediment may be too hardite — you may need to use a deliming solution',
                'For a long-term fix, install a water softener if you have hard water (above 7 grains per gallon)',
                'After flushing, listen again — some noise is normal but loud rumbling means sediment remains',
                'Consider a tankless unit if your tank needs frequent flushing due to hard water'
            ]
        },
        'smelly': {
            title: 'Rotten Egg Smell',
            checks: [
                'This is caused by hydrogen sulfide gas, produced when bacteria react with the anode rod',
                'Temporary fix: flush the tank and add 1–2 pints of 3% hydrogen peroxide, let sit for 2 hours, then flush again',
                'Replace the magnesium anode rod with an aluminum/zinc anode rod — this usually eliminates the smell',
                'If you have a well water system, a whole-house water treatment system may be needed',
                'Do NOT remove the anode rod entirely — it protects the tank from corrosion and without it, the tank will fail faster',
                'Increase the thermostat to 140°F for 1 hour to kill bacteria, then lower back to 120°F (warn household members of scald risk)'
            ]
        },
        'discolored': {
            title: 'Rusty or Discolored Water',
            checks: [
                'Run cold water only — if it\'s also rusty, the issue is in your pipes, not the water heater',
                'If only hot water is discolored, the anode rod is likely depleted and the tank is corroding inside',
                'Check and replace the anode rod — unscrew it from the top of the tank with a 1-1/16" socket',
                'If the anode rod is severely corroded (less than ¼" thick or just a wire), the tank may be too far gone',
                'Flush the tank to remove rust particles and sediment',
                'Persistent rust in hot water from a tank over 10 years old usually means it\'s time for a new water heater'
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
