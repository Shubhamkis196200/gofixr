// Appliance Error Code Lookup
(function() {
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Appliance Error Code Lookup</h2>
            <form id="diagForm" class="space-y-4">
                <div class="input-group">
                    <label>Appliance Type</label>
                    <select id="symptom" required>
                        <option value="">Select appliance...</option>
                        <option value="washer">Washing Machine</option>
                        <option value="dryer">Dryer</option>
                        <option value="dishwasher">Dishwasher</option>
                        <option value="refrigerator">Refrigerator</option>
                        <option value="oven">Oven/Range</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Error Code (e.g., F21, E1, dE)</label>
                    <input type="text" id="errorCode" placeholder="Enter error code" style="text-transform: uppercase;">
                </div>
                <button type="submit" class="btn-primary w-full">Look Up Error Code</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Understanding Error Codes</h2>
            <div class="pro-tip mb-6">
                <h4 class="font-bold mb-2">💡 Finding Your Error Code</h4>
                <p>Error codes usually appear on the appliance display panel. Check your owner's manual for location. Some codes flash in a pattern (count the blinks). Write down the exact code before looking it up.</p>
            </div>
            <h3 class="text-2xl font-bold mb-3">Common Themes by Code Type</h3>
            <ul class="list-disc pl-6 space-y-2 mb-6">
                <li><strong>E or F codes:</strong> Usually electronics or sensor faults</li>
                <li><strong>dE, LE, OE codes:</strong> Often drain or door lock issues</li>
                <li><strong>tE, HC codes:</strong> Temperature or heating problems</li>
                <li><strong>Number-only codes:</strong> Vary widely by manufacturer</li>
            </ul>
            <h3 class="text-2xl font-bold mb-3">General Troubleshooting Steps</h3>
            <ul class="list-disc pl-6 space-y-2">
                <li>Write down the exact code and when it appeared</li>
                <li>Try unplugging for 60 seconds to reset the control board</li>
                <li>Check for obvious issues: blocked drain, door not fully closed, water supply off</li>
                <li>Search online for your specific model + error code for brand-specific info</li>
            </ul>
        `
    };

    const errorCodes = {
        'washer': {
            'F21': 'Drain error — check for clogged drain pump filter, kinked drain hose, or blocked drain pipe',
            'OE': 'Water not draining — clean the filter, check drain hose for kinks, verify drain pipe isn\'t clogged',
            'LE': 'Locked rotor error — the motor can\'t spin. Check for overload, stuck drum, or worn motor bearings',
            'UE': 'Unbalanced load — redistribute clothes evenly or remove heavy items. Washer may also be unlevel',
            'DE': 'Door lock error — door won\'t lock. Check for obstructions, test door switch, may need lock replacement',
            'IE': 'Water inlet error — water not entering. Check that water supply is on, hoses aren\'t kinked, inlet screens not clogged',
            'TE': 'Temperature sensor error — thermistor failure. Usually requires part replacement (~$40)',
            'E1': 'Water level sensor error — pressure switch or hose issue. Check for clogs in pressure hose',
        },
        'dryer': {
            'F01': 'Main control board failure — often requires board replacement ($200–400)',
            'E1': 'Thermistor (temperature sensor) fault — test with multimeter or replace (~$20–40)',
            'E2': 'Stuck button on control panel — try pressing all buttons, may need panel replacement',
            'E4': 'Ducting issue or restricted airflow — clean lint trap, exhaust vent, and ductwork thoroughly',
            'AF': 'Restricted airflow — clean lint filter, check exhaust vent for blockages or crushed duct',
            'HC': 'High-current draw detected — heating element may be shorted. Unplug and call a technician',
            'PS': 'Power supply issue — check breaker, verify 240V dryers have both legs powered',
        },
        'dishwasher': {
            'E1': 'Water fill error — check water supply, inlet valve screen for debris, inlet valve may be faulty (~$80)',
            'E2': 'Drain error — clean filter basket, check drain pump for blockages, verify drain hose isn\'t kinked',
            'E3': 'Heating error — water not heating properly. Heating element or thermostat failure',
            'E4': 'Water overflow — float switch activated. Check for suds (wrong detergent), faulty inlet valve, or stuck float',
            'E5': 'Temperature sensor error — thermistor needs replacement',
            'F6': 'Door latch problem — door not closing/latching. Clean latch area, test latch switch',
            'I20': 'Drain pump blocked — remove filter, check pump impeller for debris (glass, food, etc.)',
        },
        'refrigerator': {
            'E1': 'Freezer sensor error — thermistor failure, usually on the evaporator coil',
            'E2': 'Fridge sensor error — replace fridge compartment thermistor',
            'E5': 'Defrost sensor error — the defrost thermistor or heater has failed',
            'E6': 'Communication error between main board and display — loose connection or board failure',
            'SY': 'Ice maker fill error — check water line, inlet valve, and ice maker switch',
            'OF': 'Cooling is OFF — not an error, just means cooling was manually disabled. Press buttons to reset',
            'H': 'High temperature alarm — door left open, compressor failure, or refrigerant leak',
        },
        'oven': {
            'F1': 'Control board error — may require board replacement or could be a stuck relay',
            'F2': 'Oven too hot — temperature sensor or control board issue. Sensor is ~$25 to replace',
            'F3': 'Oven sensor open circuit — sensor wire disconnected or sensor failed (~$25 part)',
            'F7': 'Stuck button on control panel — press all buttons to unstick, or replace panel',
            'F9': 'Door lock error (self-cleaning ovens) — door won\'t lock/unlock. Check lock motor and switch',
            'F10': 'Runaway temperature — safety feature triggered. Often a shorted sensor wire',
        }
    };

    function diagnose(e) {
        e.preventDefault();
        const appliance = document.getElementById('symptom').value;
        const code = document.getElementById('errorCode').value.trim().toUpperCase();
        
        if (!appliance) {
            alert('Please select an appliance type');
            return;
        }
        if (!code) {
            alert('Please enter an error code');
            return;
        }
        
        const codes = errorCodes[appliance];
        const description = codes[code];
        
        if (description) {
            document.getElementById('result').className = 'tool-card mt-6';
            document.getElementById('result').innerHTML = `
                <h3 class="text-2xl font-bold mb-4">🔧 Error Code: ${code}</h3>
                <div class="bg-orange-50 p-4 rounded-lg mb-4">
                    <h4 class="font-bold mb-2">What It Means:</h4>
                    <p>${description}</p>
                </div>
                <div class="space-y-2">
                    <h4 class="font-bold mb-2">Troubleshooting Steps:</h4>
                    <ol class="list-decimal pl-6 space-y-2">
                        <li>Unplug the appliance for 60 seconds to reset the control board</li>
                        <li>Follow the specific guidance above for this error code</li>
                        <li>If the error persists, the part mentioned likely needs replacement</li>
                        <li>Search online for "[your brand] [model] ${code}" for brand-specific instructions</li>
                        <li>Consider calling a technician if the repair involves electrical components or disassembly</li>
                    </ol>
                </div>
                <div class="mt-4 p-3 bg-gray-100 rounded text-sm">
                    <strong>Note:</strong> Error codes vary by manufacturer. This is general guidance — always check your owner's manual for model-specific information.
                </div>
            `;
        } else {
            document.getElementById('result').className = 'tool-card mt-6 bg-yellow-50';
            document.getElementById('result').innerHTML = `
                <h3 class="text-xl font-bold mb-3">Error Code Not Found</h3>
                <p class="mb-3">We don't have <strong>${code}</strong> in our database for ${appliance}s yet.</p>
                <h4 class="font-bold mb-2">General Steps:</h4>
                <ul class="list-disc pl-6 space-y-1">
                    <li>Check your owner's manual for this specific code</li>
                    <li>Search online: "[your brand] [model number] error code ${code}"</li>
                    <li>Try unplugging for 60 seconds to reset</li>
                    <li>Contact the manufacturer's customer support</li>
                </ul>
            `;
        }
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
