// Seasonal Maintenance Checklist
(function() {
    const checklists = {
        spring: {
            name: '🌱 Spring',
            sections: [
                { title: 'HVAC & Energy', items: [
                    { task: 'Schedule AC tune-up before summer rush', priority: 'high' },
                    { task: 'Replace HVAC filter', priority: 'high' },
                    { task: 'Clean supply and return vents/registers', priority: 'medium' },
                    { task: 'Check thermostat — switch to cooling mode', priority: 'low' },
                    { task: 'Clean ceiling fan blades, reverse to counter-clockwise (pushes air down)', priority: 'low' }
                ]},
                { title: 'Exterior', items: [
                    { task: 'Clean gutters and check downspout drainage', priority: 'high' },
                    { task: 'Inspect roof for missing/damaged shingles', priority: 'high' },
                    { task: 'Check siding for damage, gaps, or peeling paint', priority: 'medium' },
                    { task: 'Power wash deck, patio, walkways, and siding', priority: 'medium' },
                    { task: 'Repair/re-caulk around windows and doors', priority: 'medium' },
                    { task: 'Inspect/stain deck if coating is worn', priority: 'medium' },
                    { task: 'Check for ant hills and termite mud tubes along foundation', priority: 'high' }
                ]},
                { title: 'Plumbing', items: [
                    { task: 'Turn on exterior hose bibs — check for leaks from winter freeze', priority: 'high' },
                    { task: 'Test sump pump (pour bucket of water in pit)', priority: 'high' },
                    { task: 'Check exposed pipes for leaks', priority: 'medium' },
                    { task: 'Clean faucet aerators (remove and soak in vinegar)', priority: 'low' }
                ]},
                { title: 'Landscape', items: [
                    { task: 'Dethatch and aerate lawn if compacted', priority: 'medium' },
                    { task: 'Apply pre-emergent weed control', priority: 'medium' },
                    { task: 'Check irrigation system — run each zone, look for broken heads', priority: 'medium' },
                    { task: 'Trim bushes/trees away from siding (12"+ clearance)', priority: 'medium' },
                    { task: 'Add mulch to beds (2-3" depth)', priority: 'low' }
                ]}
            ]
        },
        summer: {
            name: '☀️ Summer',
            sections: [
                { title: 'HVAC & Energy', items: [
                    { task: 'Replace HVAC filter (every 1-3 months in heavy use)', priority: 'high' },
                    { task: 'Clean AC condenser unit — hose off debris, ensure 2 ft clearance', priority: 'high' },
                    { task: 'Check attic — should be well ventilated, not excessively hot', priority: 'medium' }
                ]},
                { title: 'Safety & Appliances', items: [
                    { task: 'Deep clean dryer vent duct (lint buildup = fire risk)', priority: 'high' },
                    { task: 'Test smoke detectors and CO detectors', priority: 'high' },
                    { task: 'Test garage door auto-reverse (place 2×4 in path)', priority: 'medium' },
                    { task: 'Clean garbage disposal (ice cubes + lemon peel)', priority: 'low' },
                    { task: 'Clean dishwasher filter and run cleaning cycle', priority: 'low' }
                ]},
                { title: 'Exterior', items: [
                    { task: 'Inspect/treat for pests (ants, wasps, mosquitoes)', priority: 'high' },
                    { task: 'Touch up exterior paint on trim and siding', priority: 'medium' },
                    { task: 'Seal concrete/asphalt driveway cracks', priority: 'medium' },
                    { task: 'Check fence posts for rot at ground level', priority: 'medium' }
                ]},
                { title: 'Plumbing', items: [
                    { task: 'Flush water heater to remove sediment', priority: 'high' },
                    { task: 'Check water heater anode rod (replace if heavily corroded)', priority: 'medium' },
                    { task: 'Look under sinks for slow leaks or moisture', priority: 'medium' }
                ]}
            ]
        },
        fall: {
            name: '🍂 Fall',
            sections: [
                { title: 'HVAC & Heating', items: [
                    { task: 'Schedule furnace/boiler professional tune-up', priority: 'high' },
                    { task: 'Replace HVAC filter', priority: 'high' },
                    { task: 'Bleed radiators if you have hot water heat', priority: 'medium' },
                    { task: 'Reverse ceiling fans to clockwise (pushes warm air down)', priority: 'low' },
                    { task: 'Have chimney inspected/swept if you use the fireplace', priority: 'high' }
                ]},
                { title: 'Winterization', items: [
                    { task: 'Disconnect, drain, and store garden hoses', priority: 'high' },
                    { task: 'Shut off and drain exterior hose bibs', priority: 'high' },
                    { task: 'Insulate exposed pipes in crawl space/garage', priority: 'high' },
                    { task: 'Check weatherstripping on all exterior doors', priority: 'medium' },
                    { task: 'Caulk gaps around windows', priority: 'medium' },
                    { task: 'Insulate attic hatch if not done', priority: 'medium' }
                ]},
                { title: 'Exterior', items: [
                    { task: 'Clean gutters after leaves fall', priority: 'high' },
                    { task: 'Check roof flashing and vent boots', priority: 'medium' },
                    { task: 'Rake leaves away from foundation (prevents moisture/pests)', priority: 'medium' },
                    { task: 'Seal driveway cracks before freeze/thaw cycle', priority: 'medium' },
                    { task: 'Store outdoor furniture or cover', priority: 'low' },
                    { task: 'Winterize irrigation system (blow out lines)', priority: 'high' }
                ]},
                { title: 'Safety', items: [
                    { task: 'Replace smoke detector batteries', priority: 'high' },
                    { task: 'Check fire extinguisher pressure gauge', priority: 'high' },
                    { task: 'Test GFCI outlets', priority: 'medium' },
                    { task: 'Stock winter emergency supplies (salt, shovel, flashlights)', priority: 'medium' }
                ]}
            ]
        },
        winter: {
            name: '❄️ Winter',
            sections: [
                { title: 'Freeze Prevention', items: [
                    { task: 'Keep house at 55°F+ even when away', priority: 'high' },
                    { task: 'Open cabinet doors under sinks on exterior walls during extreme cold', priority: 'high' },
                    { task: 'Drip faucets on exterior walls if temps drop below 20°F', priority: 'high' },
                    { task: 'Know where your water shutoff is (in case of frozen pipe burst)', priority: 'high' }
                ]},
                { title: 'Roof & Ice', items: [
                    { task: 'Watch for ice dams at roof edges — improve attic insulation/ventilation', priority: 'high' },
                    { task: 'Safely remove heavy snow loads from roof (roof rake from ground)', priority: 'medium' },
                    { task: 'Keep walkways clear and salted', priority: 'medium' }
                ]},
                { title: 'Interior', items: [
                    { task: 'Replace HVAC filter', priority: 'high' },
                    { task: 'Clean range hood filter (soak in hot soapy water)', priority: 'low' },
                    { task: 'Check for drafts around outlets on exterior walls', priority: 'medium' },
                    { task: 'Run bathroom exhaust fans during/after showers to prevent mold', priority: 'medium' },
                    { task: 'Check humidity — 30-50% is ideal (use humidifier if needed)', priority: 'medium' }
                ]},
                { title: 'Planning', items: [
                    { task: 'Plan spring projects and get early contractor quotes (busy season starts March)', priority: 'low' },
                    { task: 'Review home insurance coverage — update if you\'ve made improvements', priority: 'low' },
                    { task: 'Organize garage/workshop for spring', priority: 'low' }
                ]}
            ]
        }
    };

    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Seasonal Maintenance Checklist</h2>
            <p class="text-gray-600 mb-4">Select a season to get a prioritized checklist of maintenance tasks.</p>
            <form id="planningForm" class="space-y-4">
                <div class="input-group">
                    <label>Select Season</label>
                    <select id="season">
                        <option value="spring">🌱 Spring (Mar-May)</option>
                        <option value="summer">☀️ Summer (Jun-Aug)</option>
                        <option value="fall">🍂 Fall (Sep-Nov)</option>
                        <option value="winter">❄️ Winter (Dec-Feb)</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary w-full">Get Checklist</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Seasonal Home Care</h2>
            <div class="pro-tip mb-6">
                <h4 class="font-bold mb-2">💡 Pro Tip</h4>
                <p>Set calendar reminders at the start of each season. Spending one weekend on seasonal maintenance prevents costly surprises year-round.</p>
            </div>
        `
    };

    function calculate(e) {
        e.preventDefault();
        const season = document.getElementById('season').value;
        const cl = checklists[season];
        const totalTasks = cl.sections.reduce((s, sec) => s + sec.items.length, 0);
        const highPriority = cl.sections.reduce((s, sec) => s + sec.items.filter(i => i.priority === 'high').length, 0);

        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-3xl font-bold mb-2">${cl.name} Checklist</h3>
            <p class="mb-4 opacity-80">${totalTasks} tasks — ${highPriority} high priority</p>
            <div class="space-y-4">
                ${cl.sections.map(sec => `
                <div class="bg-white bg-opacity-10 rounded-lg p-4">
                    <h4 class="font-bold mb-2">${sec.title}</h4>
                    <div class="space-y-2">
                        ${sec.items.map(item => `
                        <label class="flex items-start gap-2 cursor-pointer">
                            <input type="checkbox" class="mt-1 flex-shrink-0">
                            <span class="flex-1">${item.task}</span>
                            <span class="text-xs px-2 py-0.5 rounded flex-shrink-0 ${item.priority === 'high' ? 'bg-red-500' : item.priority === 'medium' ? 'bg-yellow-600' : 'bg-gray-500'}">${item.priority}</span>
                        </label>`).join('')}
                    </div>
                </div>`).join('')}
            </div>
        `;
    }

    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('planningForm').addEventListener('submit', calculate);
    loadRelatedTools('planning');
})();
