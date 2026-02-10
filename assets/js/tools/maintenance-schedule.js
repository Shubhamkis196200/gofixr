// Maintenance Schedule - Generates 12-month calendar based on home details
(function() {
    const tasks = {
        monthly: [
            { task: 'Test smoke & CO detectors', area: 'Safety' },
            { task: 'Check HVAC filter — replace if dirty', area: 'HVAC' },
            { task: 'Run water in unused sinks/tubs to prevent P-trap dry-out', area: 'Plumbing' },
            { task: 'Inspect for water stains on ceilings/walls', area: 'Interior' }
        ],
        spring: [
            { task: 'Service AC — clean coils, check refrigerant, replace filter', area: 'HVAC', month: 3 },
            { task: 'Clean gutters and downspouts', area: 'Exterior', month: 3 },
            { task: 'Inspect roof for winter damage (missing shingles, flashing)', area: 'Roof', month: 4 },
            { task: 'Check grading — soil should slope away from foundation', area: 'Foundation', month: 4 },
            { task: 'Power wash deck, siding, and walkways', area: 'Exterior', month: 4 },
            { task: 'Test sump pump by pouring water into pit', area: 'Basement', month: 3 },
            { task: 'Inspect/stain deck if needed', area: 'Exterior', month: 5 },
            { task: 'Check window and door caulking', area: 'Exterior', month: 5 },
            { task: 'Service lawn mower — oil, blade, air filter, spark plug', area: 'Equipment', month: 3 }
        ],
        summer: [
            { task: 'Deep clean dryer vent (fire hazard)', area: 'Appliance', month: 6 },
            { task: 'Check attic ventilation and insulation', area: 'Attic', month: 6 },
            { task: 'Inspect/treat for termites and pests', area: 'Pest Control', month: 7 },
            { task: 'Touch up exterior paint where peeling', area: 'Exterior', month: 7 },
            { task: 'Flush water heater to remove sediment', area: 'Plumbing', month: 8 },
            { task: 'Test garage door auto-reverse safety', area: 'Garage', month: 8 }
        ],
        fall: [
            { task: 'Service furnace/heating — schedule professional tune-up', area: 'HVAC', month: 9 },
            { task: 'Clean gutters again (after leaves fall)', area: 'Exterior', month: 10 },
            { task: 'Disconnect and drain outdoor hoses', area: 'Plumbing', month: 10 },
            { task: 'Shut off exterior hose bibs / insulate', area: 'Plumbing', month: 10 },
            { task: 'Seal driveway cracks before freeze', area: 'Exterior', month: 9 },
            { task: 'Check weatherstripping on doors and windows', area: 'Energy', month: 10 },
            { task: 'Test heating system before cold arrives', area: 'HVAC', month: 9 },
            { task: 'Rake leaves away from foundation', area: 'Landscape', month: 11 },
            { task: 'Check fireplace / chimney — schedule sweep if used', area: 'Safety', month: 10 }
        ],
        winter: [
            { task: 'Check for ice dams on roof edges', area: 'Roof', month: 12 },
            { task: 'Monitor for frozen pipe risk — keep faucets dripping in extreme cold', area: 'Plumbing', month: 1 },
            { task: 'Replace smoke detector batteries (if not 10-year sealed)', area: 'Safety', month: 1 },
            { task: 'Clean range hood filter', area: 'Kitchen', month: 1 },
            { task: 'Test GFCI outlets (press test, then reset)', area: 'Electrical', month: 2 },
            { task: 'Plan spring projects and get early contractor quotes', area: 'Planning', month: 2 }
        ]
    };

    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Home Maintenance Schedule</h2>
            <p class="text-gray-600 mb-4">Get a personalized 12-month maintenance calendar for your home.</p>
            <form id="planningForm" class="space-y-4">
                <div class="input-group">
                    <label>Home Age</label>
                    <select id="homeAge">
                        <option value="new">Under 5 years</option>
                        <option value="mid" selected>5-20 years</option>
                        <option value="old">20-50 years</option>
                        <option value="vintage">50+ years</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Home Type</label>
                    <select id="homeType">
                        <option value="house" selected>Single-Family House</option>
                        <option value="townhouse">Townhouse</option>
                        <option value="condo">Condo (you maintain interior only)</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Features (check all that apply)</label>
                    <div class="grid grid-cols-2 gap-1 text-sm mt-1">
                        <label><input type="checkbox" id="hasDeck" checked> Deck/Patio</label>
                        <label><input type="checkbox" id="hasPool"> Pool</label>
                        <label><input type="checkbox" id="hasFireplace"> Fireplace</label>
                        <label><input type="checkbox" id="hasSump"> Sump Pump</label>
                        <label><input type="checkbox" id="hasSeptic"> Septic System</label>
                        <label><input type="checkbox" id="hasWell"> Well Water</label>
                    </div>
                </div>
                <button type="submit" class="btn-primary w-full">Generate My Schedule</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Why Scheduled Maintenance Matters</h2>
            <div class="pro-tip mb-6">
                <h4 class="font-bold mb-2">💡 Pro Tip</h4>
                <p>Spending $1 on preventive maintenance saves $5-$10 on emergency repairs. A $150 HVAC tune-up prevents a $5,000 compressor failure.</p>
            </div>
            <h3 class="text-2xl font-bold mt-6 mb-3">Most Neglected Tasks</h3>
            <ul class="list-disc pl-6 space-y-2">
                <li><strong>Dryer vent cleaning</strong> — #1 cause of home fires, do yearly</li>
                <li><strong>Water heater flush</strong> — sediment cuts efficiency and lifespan</li>
                <li><strong>Gutter cleaning</strong> — clogged gutters cause foundation damage</li>
                <li><strong>HVAC filter</strong> — dirty filters cost 15% more on energy bills</li>
            </ul>
        `
    };

    function calculate(e) {
        e.preventDefault();
        const age = document.getElementById('homeAge').value;
        const type = document.getElementById('homeType').value;
        const hasDeck = document.getElementById('hasDeck').checked;
        const hasPool = document.getElementById('hasPool').checked;
        const hasFireplace = document.getElementById('hasFireplace').checked;
        const hasSump = document.getElementById('hasSump').checked;
        const hasSeptic = document.getElementById('hasSeptic').checked;

        // Build month-by-month schedule
        const schedule = Array.from({length: 12}, () => []);

        // Monthly tasks go in every month
        tasks.monthly.forEach(t => {
            for (let m = 0; m < 12; m++) schedule[m].push({...t, freq: 'Monthly'});
        });

        // Seasonal tasks
        [...tasks.spring, ...tasks.summer, ...tasks.fall, ...tasks.winter].forEach(t => {
            // Filter by home type
            if (type === 'condo' && ['Exterior','Roof','Foundation','Landscape','Garage'].includes(t.area)) return;
            if (!hasDeck && t.task.toLowerCase().includes('deck')) return;
            if (!hasFireplace && t.task.toLowerCase().includes('fireplace')) return;
            if (!hasSump && t.task.toLowerCase().includes('sump')) return;
            schedule[t.month - 1].push({...t, freq: 'Seasonal'});
        });

        // Age-specific
        if (age === 'old' || age === 'vintage') {
            schedule[3].push({ task: 'Inspect plumbing for corrosion (older galvanized pipes)', area: 'Plumbing', freq: 'Annual' });
            schedule[8].push({ task: 'Check electrical panel for outdated breakers (Federal Pacific, Zinsco)', area: 'Electrical', freq: 'Annual' });
        }
        if (hasPool) {
            schedule[4].push({ task: 'Open pool — balance chemicals, inspect equipment', area: 'Pool', freq: 'Seasonal' });
            schedule[9].push({ task: 'Winterize pool', area: 'Pool', freq: 'Seasonal' });
        }
        if (hasSeptic) {
            schedule[5].push({ task: 'Schedule septic tank inspection/pumping (every 3-5 years)', area: 'Septic', freq: 'Annual' });
        }

        const totalTasks = schedule.reduce((sum, m) => sum + m.length, 0);

        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-3xl font-bold mb-4">📅 Your 12-Month Schedule</h3>
            <p class="mb-4 opacity-80">${totalTasks} tasks across the year</p>
            <div class="space-y-3">
                ${schedule.map((m, i) => m.length ? `
                <div class="bg-white bg-opacity-10 rounded-lg p-3">
                    <h4 class="font-bold mb-2">${months[i]}</h4>
                    <ul class="space-y-1 text-sm">
                        ${m.map(t => `<li class="flex gap-2"><span class="opacity-60 w-16 flex-shrink-0">${t.area}</span><span>${t.task}</span></li>`).join('')}
                    </ul>
                </div>` : '').join('')}
            </div>
        `;
    }

    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('planningForm').addEventListener('submit', calculate);
    loadRelatedTools('planning');
})();
