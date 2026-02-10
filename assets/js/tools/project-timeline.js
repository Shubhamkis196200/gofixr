// Project Timeline Planner
(function() {
    const projects = {
        'bathroom-remodel': {
            name: 'Bathroom Remodel',
            phases: [
                { name: 'Planning & Permits', days: [7, 14], desc: 'Design, material selection, pull permits' },
                { name: 'Demo', days: [2, 4], desc: 'Remove fixtures, tile, drywall' },
                { name: 'Rough Plumbing', days: [2, 3], desc: 'Move/add supply & drain lines' },
                { name: 'Electrical Rough-In', days: [1, 2], desc: 'Add circuits, GFCI outlets, fan, lighting' },
                { name: 'Inspection', days: [1, 3], desc: 'City rough-in inspection (wait time varies)' },
                { name: 'Drywall / Cement Board', days: [3, 5], desc: 'Hang, tape, mud, sand' },
                { name: 'Tile Work', days: [3, 5], desc: 'Floor and shower tile, grout, seal' },
                { name: 'Vanity & Fixtures', days: [1, 2], desc: 'Install vanity, toilet, shower fixtures' },
                { name: 'Paint & Trim', days: [1, 2], desc: 'Prime, paint, install trim and accessories' },
                { name: 'Final Inspection & Punch List', days: [1, 2], desc: 'Final permit inspection, touch-ups' }
            ]
        },
        'kitchen-remodel': {
            name: 'Kitchen Remodel',
            phases: [
                { name: 'Planning & Design', days: [14, 30], desc: 'Layout, cabinets ordered (6-8 week lead time common)' },
                { name: 'Demo', days: [3, 5], desc: 'Remove cabinets, countertops, flooring, appliances' },
                { name: 'Rough Plumbing & Gas', days: [2, 3], desc: 'Relocate supply/drain/gas lines' },
                { name: 'Electrical', days: [2, 3], desc: 'Add circuits for appliances, under-cabinet lighting' },
                { name: 'Inspection', days: [1, 5], desc: 'Rough-in inspection' },
                { name: 'Drywall & Paint', days: [3, 5], desc: 'Repair walls, prime, paint' },
                { name: 'Flooring', days: [2, 4], desc: 'Install new flooring' },
                { name: 'Cabinets', days: [3, 5], desc: 'Install base and wall cabinets, fillers, trim' },
                { name: 'Countertop Template & Install', days: [7, 14], desc: 'Template → fabrication → install (stone/quartz lead time)' },
                { name: 'Backsplash', days: [2, 3], desc: 'Tile backsplash and grout' },
                { name: 'Fixtures & Appliances', days: [1, 2], desc: 'Sink, faucet, dishwasher, range, hood' },
                { name: 'Punch List', days: [1, 3], desc: 'Touch-ups, hardware, final adjustments' }
            ]
        },
        'deck-build': {
            name: 'Deck Build (200-400 sq ft)',
            phases: [
                { name: 'Design & Permits', days: [7, 21], desc: 'Plans, engineering, permit application' },
                { name: 'Layout & Footings', days: [1, 2], desc: 'String lines, dig holes, pour footings' },
                { name: 'Footing Cure Time', days: [3, 7], desc: 'Concrete cure (min 3 days)' },
                { name: 'Framing', days: [2, 4], desc: 'Posts, beams, joists, ledger board' },
                { name: 'Inspection', days: [1, 3], desc: 'Framing inspection' },
                { name: 'Decking', days: [2, 3], desc: 'Lay deck boards, fascia' },
                { name: 'Railing & Stairs', days: [1, 3], desc: 'Posts, rails, balusters, stairs' },
                { name: 'Finish', days: [1, 2], desc: 'Stain/seal, trim, final inspection' }
            ]
        },
        'roof-replace': {
            name: 'Roof Replacement',
            phases: [
                { name: 'Inspections & Quotes', days: [3, 7], desc: 'Get 3 quotes, choose contractor, schedule' },
                { name: 'Material Delivery', days: [1, 3], desc: 'Shingles, underlayment, flashing delivered' },
                { name: 'Tear-Off', days: [1, 2], desc: 'Remove old shingles, inspect decking' },
                { name: 'Deck Repair', days: [0, 1], desc: 'Replace any rotten sheathing' },
                { name: 'Install Underlayment & Flashing', days: [0.5, 1], desc: 'Ice & water shield, drip edge, valleys' },
                { name: 'Shingle Install', days: [1, 3], desc: 'Starter, field, ridge, hip shingles' },
                { name: 'Vents & Boots', days: [0.5, 1], desc: 'Pipe boots, ridge vent, exhaust vents' },
                { name: 'Cleanup & Inspection', days: [0.5, 1], desc: 'Magnetic sweep, debris removal, final walk' }
            ]
        },
        'interior-paint': {
            name: 'Interior Painting (whole house)',
            phases: [
                { name: 'Color Selection & Purchase', days: [1, 3], desc: 'Sample colors, buy paint & supplies' },
                { name: 'Prep', days: [2, 4], desc: 'Move furniture, tape, drop cloths, fill holes, sand' },
                { name: 'Prime (if needed)', days: [1, 2], desc: 'Bare drywall, dark-to-light color changes, stains' },
                { name: 'Paint Ceilings', days: [1, 2], desc: 'Ceilings first, one coat usually sufficient' },
                { name: 'Paint Walls (2 coats)', days: [3, 6], desc: 'Cut in edges, roll walls, 2 coats with dry time' },
                { name: 'Trim & Doors', days: [2, 4], desc: 'Brush or spray trim, doors, window casings' },
                { name: 'Touch-ups & Cleanup', days: [1, 1], desc: 'Touch up misses, remove tape, clean up' }
            ]
        },
        'fence': {
            name: 'Fence Installation (100-200 lin ft)',
            phases: [
                { name: 'Survey & Permits', days: [3, 10], desc: 'Property survey, check setback rules, get permit' },
                { name: 'Call 811 Utility Locate', days: [2, 5], desc: 'Required before digging — free service' },
                { name: 'Post Holes', days: [1, 2], desc: 'Dig holes (auger rental recommended) every 8 ft' },
                { name: 'Set Posts', days: [1, 2], desc: 'Set posts in concrete, brace plumb, let cure' },
                { name: 'Concrete Cure', days: [2, 3], desc: 'Wait for concrete to set before adding weight' },
                { name: 'Rails & Pickets', days: [2, 4], desc: 'Attach stringers, hang pickets or panels' },
                { name: 'Gate & Hardware', days: [0.5, 1], desc: 'Hang gate, install latch and hinges' },
                { name: 'Stain/Seal', days: [1, 2], desc: 'Apply stain or sealer (optional but recommended)' }
            ]
        }
    };

    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Project Timeline Planner</h2>
            <p class="text-gray-600 mb-4">See a realistic timeline with phases for common home improvement projects.</p>
            <form id="planningForm" class="space-y-4">
                <div class="input-group">
                    <label>Project Type</label>
                    <select id="projectType">
                        ${Object.entries(projects).map(([k,v]) => `<option value="${k}">${v.name}</option>`).join('')}
                    </select>
                </div>
                <div class="input-group">
                    <label>Pace</label>
                    <select id="pace">
                        <option value="fast">Aggressive (contractor crew, full-time)</option>
                        <option value="normal" selected>Normal</option>
                        <option value="diy">DIY / Weekends Only</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Start Date</label>
                    <input type="date" id="startDate" required>
                </div>
                <button type="submit" class="btn-primary w-full">Generate Timeline</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Project Planning Tips</h2>
            <div class="pro-tip mb-6">
                <h4 class="font-bold mb-2">💡 Pro Tip</h4>
                <p>Add 20-30% buffer to any timeline. Permits, weather, material delays, and unexpected discoveries (rot, wiring issues) always happen.</p>
            </div>
            <h3 class="text-2xl font-bold mt-6 mb-3">Common Delays</h3>
            <ul class="list-disc pl-6 space-y-2">
                <li><strong>Permits:</strong> 1-4 weeks depending on jurisdiction</li>
                <li><strong>Material lead times:</strong> Custom cabinets 6-10 weeks, stone countertops 2-3 weeks</li>
                <li><strong>Inspections:</strong> May need to wait 1-5 business days for inspector availability</li>
                <li><strong>Weather:</strong> Rain delays exterior work; extreme cold affects concrete curing</li>
            </ul>
        `
    };

    // Set default date to today
    setTimeout(() => {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('startDate').value = today;
    }, 0);

    function calculate(e) {
        e.preventDefault();
        const projKey = document.getElementById('projectType').value;
        const pace = document.getElementById('pace').value;
        const startDate = new Date(document.getElementById('startDate').value + 'T00:00:00');
        const proj = projects[projKey];

        const paceMult = pace === 'fast' ? 0 : pace === 'diy' ? 1 : 0.5; // 0=min days, 1=max days
        let currentDate = new Date(startDate);
        const timeline = [];

        proj.phases.forEach(phase => {
            const days = Math.ceil(phase.days[0] + (phase.days[1] - phase.days[0]) * paceMult);
            const phaseStart = new Date(currentDate);
            currentDate.setDate(currentDate.getDate() + days);
            const phaseEnd = new Date(currentDate);
            timeline.push({ ...phase, dayCount: days, start: phaseStart, end: phaseEnd });
        });

        const totalDays = Math.round((currentDate - startDate) / (1000 * 60 * 60 * 24));
        const totalWeeks = (totalDays / 7).toFixed(1);
        const endStr = currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const maxDays = Math.max(...timeline.map(t => t.dayCount));

        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-3xl font-bold mb-2">${proj.name} Timeline</h3>
            <p class="mb-4 opacity-80">${totalDays} days (~${totalWeeks} weeks) — Finish by ${endStr}</p>
            <div class="space-y-2">
                ${timeline.map(t => {
                    const barWidth = Math.max(10, (t.dayCount / maxDays) * 100);
                    const startStr = t.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    return `
                    <div class="bg-white bg-opacity-10 rounded p-3">
                        <div class="flex justify-between text-sm mb-1">
                            <span class="font-bold">${t.name}</span>
                            <span>${t.dayCount} day${t.dayCount !== 1 ? 's' : ''} — ${startStr}</span>
                        </div>
                        <div class="w-full bg-white bg-opacity-10 rounded-full h-3 mb-1">
                            <div class="bg-green-400 h-3 rounded-full" style="width:${barWidth}%"></div>
                        </div>
                        <p class="text-xs opacity-70">${t.desc}</p>
                    </div>`;
                }).join('')}
            </div>
        `;
    }

    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('planningForm').addEventListener('submit', calculate);
    loadRelatedTools('planning');
})();
