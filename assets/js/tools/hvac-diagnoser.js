// HVAC Diagnoser
(function() {
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">HVAC Problem Diagnoser</h2>
            <form id="diagForm" class="space-y-4">
                <div class="input-group">
                    <label>What's the issue?</label>
                    <select id="symptom" required>
                        <option value="">Select a symptom...</option>
                        <option value="no-cool">AC not cooling</option>
                        <option value="no-heat">Furnace not heating</option>
                        <option value="short-cycle">System turns on and off rapidly</option>
                        <option value="weak-airflow">Weak airflow from vents</option>
                        <option value="strange-noise">Strange noises</option>
                        <option value="high-bills">Unusually high energy bills</option>
                        <option value="uneven-temp">Uneven temperatures between rooms</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>System type</label>
                    <select id="timing">
                        <option value="central">Central AC/Furnace</option>
                        <option value="heat-pump">Heat Pump</option>
                        <option value="mini-split">Mini-Split</option>
                        <option value="window">Window Unit</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary w-full">Diagnose Problem</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">HVAC Maintenance Guide</h2>
            <div class="danger-box mb-6">
                <h4 class="font-bold">⚠️ Safety Notice</h4>
                <p>Turn off the system before any inspection. Gas furnaces: if you smell gas, leave the house and call your gas company. Never attempt refrigerant work — it requires EPA certification.</p>
            </div>
            <h3 class="text-2xl font-bold mb-3">Seasonal Maintenance Checklist</h3>
            <ul class="list-disc pl-6 space-y-2 mb-6">
                <li><strong>Change air filters</strong> every 1–3 months (the #1 cause of HVAC problems)</li>
                <li><strong>Clean outdoor condenser coils</strong> annually — hose off dirt and debris</li>
                <li><strong>Clear debris</strong> 2 feet around the outdoor unit</li>
                <li><strong>Check thermostat batteries</strong> and settings each season</li>
                <li><strong>Schedule professional tune-up</strong> twice yearly (spring for AC, fall for heating)</li>
            </ul>
            <h3 class="text-2xl font-bold mb-3">Average System Lifespan</h3>
            <ul class="list-disc pl-6 space-y-2">
                <li>Central AC: 15–20 years</li>
                <li>Gas Furnace: 15–20 years</li>
                <li>Heat Pump: 10–15 years</li>
            </ul>
        `
    };

    const solutions = {
        'no-cool': {
            title: 'AC Not Cooling',
            checks: [
                'Check the thermostat: make sure it\'s set to COOL and the temperature is set below room temperature',
                'Check and replace the air filter — a clogged filter is the #1 cause of AC problems',
                'Go outside and check if the condenser (outdoor unit) is running. If not, check the breaker for the outdoor unit',
                'If the outdoor fan runs but the compressor doesn\'t, the capacitor or compressor may have failed — call a technician',
                'Check if the condenser coils are dirty or blocked by debris — hose them off gently',
                'If air blows but isn\'t cold, the system may be low on refrigerant (from a leak) — requires a licensed HVAC technician',
                'Check that all supply vents are open and unblocked by furniture or curtains'
            ]
        },
        'no-heat': {
            title: 'Furnace Not Heating',
            checks: [
                'Check the thermostat: set to HEAT, temperature above room temp, fan set to AUTO',
                'Check the furnace filter — a clogged filter can cause the furnace to overheat and shut down',
                'Gas furnace: is the pilot light lit? Modern furnaces have electronic ignition — check for error codes on the control board',
                'Check the furnace power switch (looks like a light switch near the unit) — make sure it\'s ON',
                'Check the gas valve is open (handle parallel to the gas line = open)',
                'If the blower runs but no heat comes out, the ignitor or flame sensor may need cleaning or replacement',
                'Check the flue/exhaust vent for blockages — birds nests and ice can obstruct it'
            ]
        },
        'short-cycle': {
            title: 'System Short-Cycling',
            checks: [
                'Replace the air filter — this is the most common cause of short-cycling',
                'Check if the thermostat is in a bad location (direct sunlight, near a vent, or near a heat source)',
                'The system may be oversized for your home — it cools/heats too quickly and shuts off before dehumidifying properly',
                'Low refrigerant can cause the compressor to overheat and shut off — call an HVAC technician',
                'A failing compressor or blower motor can cause rapid cycling — listen for unusual sounds',
                'Check for ice on the evaporator coil (indoor unit) — turn off the system and let it thaw if iced over'
            ]
        },
        'weak-airflow': {
            title: 'Weak Airflow from Vents',
            checks: [
                'Replace the air filter — a dirty filter is the most likely cause',
                'Check that all vents and registers are fully open and not blocked by furniture',
                'Inspect accessible ductwork for disconnected joints, holes, or crushed sections',
                'The blower motor may be failing — listen for unusual sounds or check if the fan speed seems slow',
                'Leaky ductwork can lose 20–40% of conditioned air — consider having ducts sealed by a professional',
                'If only some rooms have weak airflow, the duct dampers may need adjustment'
            ]
        },
        'strange-noise': {
            title: 'Strange HVAC Noises',
            checks: [
                'Banging or clanking: a loose or broken part in the blower assembly — turn off and inspect',
                'Squealing or screeching: worn blower belt (older systems) or failing blower motor bearings',
                'Clicking at startup is normal; persistent clicking may indicate a failing relay or control board',
                'Rattling from the outdoor unit: loose screws/panels, or debris inside the condenser',
                'Hissing: possible refrigerant leak — turn off system and call HVAC technician',
                'Booming on startup (gas furnace): delayed ignition from dirty burners — needs professional cleaning'
            ]
        },
        'high-bills': {
            title: 'High Energy Bills',
            checks: [
                'Replace the air filter — a dirty filter makes the system work 15% harder',
                'Check thermostat settings: is someone setting it very low (AC) or very high (heat)?',
                'Schedule a professional tune-up — dirty coils and low refrigerant reduce efficiency significantly',
                'Inspect and seal ductwork — leaky ducts waste 20–40% of energy',
                'Check insulation levels in the attic — adding insulation is often the best ROI for energy savings',
                'Make sure windows and doors seal tightly — weatherstripping is cheap and effective',
                'If the system is 15+ years old, a new high-efficiency unit can cut energy costs by 20–40%'
            ]
        },
        'uneven-temp': {
            title: 'Uneven Temperatures',
            checks: [
                'Check that all vents are open in problem rooms — partially closing vents in comfortable rooms can help redirect air',
                'Inspect ductwork to problem rooms for disconnections, kinks, or inadequate insulation',
                'Rooms far from the HVAC unit or on upper floors naturally receive less conditioned air',
                'Consider adding a zoning system with dampers and multiple thermostats',
                'Check window insulation in problem rooms — single-pane or poorly sealed windows lose lots of heat/cool air',
                'A ceiling fan can help distribute air more evenly (counterclockwise in summer, clockwise in winter)'
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
