// Electrical Diagnoser
(function() {
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Electrical Problem Diagnoser</h2>
            <form id="diagForm" class="space-y-4">
                <div class="input-group">
                    <label>What's the issue?</label>
                    <select id="symptom" required>
                        <option value="">Select a symptom...</option>
                        <option value="outlet-dead">Outlet not working</option>
                        <option value="breaker-trips">Circuit breaker keeps tripping</option>
                        <option value="flickering">Lights flickering</option>
                        <option value="buzzing">Buzzing from outlet or switch</option>
                        <option value="warm-outlet">Outlet or switch plate feels warm</option>
                        <option value="partial-outage">Part of house lost power</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>When did it start?</label>
                    <select id="timing">
                        <option value="sudden">Suddenly</option>
                        <option value="gradual">Gradually getting worse</option>
                        <option value="intermittent">Comes and goes</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary w-full">Diagnose Problem</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Electrical Safety Guide</h2>
            <div class="danger-box mb-6">
                <h4 class="font-bold">⚡ Electrical Safety Warning</h4>
                <p>Electricity can kill. Always turn off the breaker before any electrical work. If you're uncomfortable or unsure, hire a licensed electrician. Never work on the main panel yourself.</p>
            </div>
            <h3 class="text-2xl font-bold mb-3">When to Call an Electrician Immediately</h3>
            <ul class="list-disc pl-6 space-y-2 mb-6">
                <li>Burning smell from outlets or panel</li>
                <li>Sparking or arcing sounds</li>
                <li>Scorch marks on outlets or switches</li>
                <li>Frequent breaker trips with no identifiable cause</li>
                <li>Tingling when touching appliances</li>
                <li>Any work inside the electrical panel</li>
            </ul>
            <h3 class="text-2xl font-bold mb-3">DIY-Safe Tasks</h3>
            <ul class="list-disc pl-6 space-y-2">
                <li>Replacing outlets and switches (breaker OFF first)</li>
                <li>Resetting GFCI outlets and tripped breakers</li>
                <li>Testing outlets with a plug-in tester ($10–15)</li>
                <li>Replacing light fixtures (breaker OFF first)</li>
            </ul>
        `
    };

    const solutions = {
        'outlet-dead': {
            title: 'Outlet Not Working',
            checks: [
                'Test other outlets on the same wall or room — if multiple are dead, a GFCI outlet upstream has likely tripped',
                'Find all GFCI outlets (kitchen, bathroom, garage, exterior) and press the RESET button on each one',
                'Check the circuit breaker panel — a tripped breaker sits between ON and OFF, push fully to OFF then back to ON',
                'Test the outlet with a plug-in outlet tester ($10) — it tells you if wiring is correct, open ground, etc.',
                'If only one outlet is dead and breaker is fine, the outlet itself may have failed — replace it (breaker OFF first)',
                'If the outlet is controlled by a wall switch, make sure the switch is on'
            ]
        },
        'breaker-trips': {
            title: 'Circuit Breaker Keeps Tripping',
            checks: [
                'Identify what\'s on that circuit — too many appliances on one circuit is the most common cause',
                'Unplug everything on the circuit, reset the breaker. Plug devices back in one at a time to find the culprit',
                'Space heaters, hair dryers, and microwaves are top breaker-trippers — don\'t combine them on one circuit',
                'If the breaker trips with nothing plugged in, there may be a short in the wiring — call an electrician',
                'A breaker that trips instantly when reset may indicate a ground fault or short circuit — professional repair needed',
                'If the breaker itself is hot or won\'t stay reset, the breaker may be faulty and needs replacement (electrician job)'
            ]
        },
        'flickering': {
            title: 'Lights Flickering',
            checks: [
                'If just one light flickers: tighten or replace the bulb. LED bulbs on dimmer switches need compatible dimmers',
                'If one circuit flickers: a loose wire connection in a switch, outlet, or junction box on that circuit',
                'If the whole house flickers: check the main electrical connections — this could be a loose utility connection',
                'Flickering when a large appliance (AC, dryer) kicks on is normal if brief — indicates the circuit is loaded',
                'Persistent whole-house flickering warrants calling the utility company first, then an electrician',
                'Replace any dimmer switches that are not rated for your bulb type (LED vs. incandescent)'
            ]
        },
        'buzzing': {
            title: 'Buzzing from Outlet or Switch',
            checks: [
                'A buzzing outlet with a dimmer switch: the dimmer may not be compatible with the bulbs — try a different dimmer',
                'Buzzing from a standard outlet or switch: loose wiring connection — turn off breaker and tighten wire connections',
                'If buzzing comes from the breaker panel: a breaker may be failing or a wire is loose — call an electrician',
                'Fluorescent lights naturally buzz — replace the ballast or switch to LED tubes',
                'A buzzing GFCI outlet may be about to fail — replace it ($12–15 at hardware stores)',
                'Any buzzing accompanied by heat or burning smell = turn off breaker immediately and call an electrician'
            ]
        },
        'warm-outlet': {
            title: 'Warm Outlet or Switch Plate',
            checks: [
                'A slightly warm dimmer switch is normal — dimmers dissipate heat as part of their operation',
                'A warm standard outlet is NOT normal — unplug everything and stop using it until inspected',
                'Possible causes: loose wire connections, outlet is overloaded, or wiring is undersized for the load',
                'Turn off the breaker for that circuit and call an electrician — warm outlets can cause fires',
                'Check if the outlet is an older aluminum-wired outlet (pre-1972 homes) — these are a known fire hazard',
                'Never ignore a warm or discolored outlet plate — this is a serious fire risk'
            ]
        },
        'partial-outage': {
            title: 'Partial Power Outage',
            checks: [
                'Check the breaker panel — one or more breakers may have tripped',
                'If multiple rooms lost power, check for a tripped double-pole breaker (240V circuit)',
                'If exactly half the house is out, one leg of your electrical service may be down — call the utility company',
                'Check GFCI outlets — a tripped GFCI can kill power to multiple outlets downstream',
                'After a storm, the utility company\'s connection to your home may be damaged — check the weather head and meter',
                'If breakers look fine but outlets are dead, there may be a loose connection in the panel — electrician needed'
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
            <h3 class="text-2xl font-bold mb-4">⚡ ${solution.title}</h3>
            <h4 class="font-bold mb-3">Diagnostic Steps:</h4>
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
