// Tool Finder Quiz - Multi-step project-based tool recommendations
(function() {
    const toolDB = {
        'painting': {
            name: 'Interior Painting',
            basic: ['Paint roller (9" with 3/8" nap)', 'Roller tray', 'Angled sash brush (2.5")', 'Blue painter\'s tape', 'Drop cloths', 'Paint can opener & stir sticks'],
            intermediate: ['Extension pole (4-8 ft)', 'Mini roller (4") for trim', 'Paint edger tool', '5-in-1 painter\'s tool', 'Plastic sheeting for furniture'],
            pro: ['Paint sprayer (HVLP or airless)', 'Spray shelter tent', 'Masking machine', 'Pole sander for prep']
        },
        'drywall': {
            name: 'Drywall Repair',
            basic: ['Putty knife set (2", 4", 6")', 'Joint compound (pre-mixed)', 'Self-adhesive mesh tape', 'Sanding sponge (fine)', 'Utility knife'],
            intermediate: ['Drywall saw (jab saw)', '6" and 10" taping knives', 'Drywall patch kit', 'Mud pan', 'Corner tool'],
            pro: ['Drywall T-square', 'Drywall screw gun', 'Automatic taper', 'Stilt set', 'Drywall lift (rent)']
        },
        'plumbing': {
            name: 'Basic Plumbing',
            basic: ['Adjustable wrench (10")', 'Tongue-and-groove pliers (10")', 'Plunger (flange type)', 'Teflon tape', 'Bucket & towels'],
            intermediate: ['Basin wrench', 'Pipe wrench (14")', 'Tubing cutter', 'Drain snake (25 ft)', 'PVC primer & cement'],
            pro: ['Propane torch & solder kit', 'PEX crimp tool', 'Cast iron snap cutter (rent)', 'Inspection camera']
        },
        'electrical': {
            name: 'Electrical Work',
            basic: ['Non-contact voltage tester', 'Insulated screwdriver set', 'Wire strippers', 'Needle-nose pliers', 'Electrical tape'],
            intermediate: ['Digital multimeter', 'Fish tape (25 ft)', 'Wire nuts assortment', 'Cable ripper', 'Circuit breaker finder'],
            pro: ['Conduit bender', 'Wire pulling grip set', 'Hole saw kit', 'Label maker for panels']
        },
        'deck': {
            name: 'Deck Building/Repair',
            basic: ['Circular saw', 'Drill/driver + bit set', 'Speed square', 'Tape measure (25 ft)', 'Chalk line', 'Level (4 ft)'],
            intermediate: ['Impact driver', 'Jigsaw', 'Deck board straightening tool', 'Post level', 'Clamps (bar, 4 pack)'],
            pro: ['Miter saw (10" or 12")', 'Hidden fastener system', 'Router + roundover bit', 'Post hole digger or auger (rent)']
        },
        'tile': {
            name: 'Tile Installation',
            basic: ['Notched trowel (1/4" × 3/8")', 'Tile spacers', 'Grout float', 'Sponge & bucket', 'Tile nippers'],
            intermediate: ['Manual tile cutter (24")', 'Level + straight edge', 'Grout removal tool', 'Mixing drill + paddle', 'Knee pads'],
            pro: ['Wet tile saw (rent)', 'Diamond hole saw set', 'Tile leveling system', 'Laser level']
        },
        'landscape': {
            name: 'Landscaping / Yard',
            basic: ['Round-point shovel', 'Garden rake', 'Wheelbarrow', 'Work gloves', 'Tape measure'],
            intermediate: ['Tamper / plate compactor (rent)', 'Edger', 'Post hole digger', 'Landscape fabric & stakes', 'String level'],
            pro: ['Mini excavator (rent)', 'Laser transit level', 'Sod cutter (rent)', 'Retaining wall tools']
        }
    };

    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Tool Finder Quiz</h2>
            <p class="text-gray-600 mb-4">Answer a few questions to get a customized tool list for your project.</p>
            <form id="planningForm" class="space-y-4">
                <div class="input-group">
                    <label>What type of project?</label>
                    <select id="projectType">
                        ${Object.entries(toolDB).map(([k,v]) => `<option value="${k}">${v.name}</option>`).join('')}
                    </select>
                </div>
                <div class="input-group">
                    <label>Your experience level?</label>
                    <select id="level">
                        <option value="basic">Beginner — first time doing this</option>
                        <option value="intermediate" selected>Intermediate — done a few projects</option>
                        <option value="pro">Advanced — experienced DIYer</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Budget priority?</label>
                    <select id="budget">
                        <option value="minimal">Minimal — bare essentials only</option>
                        <option value="balanced" selected>Balanced — good tools without overspending</option>
                        <option value="invest">Invest — buy quality tools for future projects</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary w-full">Get My Tool List</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Building Your Tool Collection</h2>
            <div class="pro-tip mb-6">
                <h4 class="font-bold mb-2">💡 Pro Tip</h4>
                <p>Rent expensive single-use tools (wet saw, plate compactor). Buy tools you'll use more than 3 times.</p>
            </div>
            <h3 class="text-2xl font-bold mt-6 mb-3">Essential Safety Gear (Every Project)</h3>
            <ul class="list-disc pl-6 space-y-2">
                <li>Safety glasses (ANSI Z87.1 rated)</li>
                <li>Work gloves appropriate for the task</li>
                <li>Hearing protection for power tools</li>
                <li>Dust mask or N95 for sanding/cutting</li>
                <li>First aid kit nearby</li>
            </ul>
        `
    };

    function calculate(e) {
        e.preventDefault();
        const type = document.getElementById('projectType').value;
        const level = document.getElementById('level').value;
        const budget = document.getElementById('budget').value;
        const project = toolDB[type];

        let tools = [...project.basic];
        if (level !== 'basic' || budget === 'invest') tools = [...tools, ...project.intermediate];
        if (level === 'pro' || budget === 'invest') tools = [...tools, ...project.pro];

        const listLabel = level === 'basic' ? 'Essential' : level === 'intermediate' ? 'Recommended' : 'Complete';

        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-3xl font-bold mb-4">🔧 ${project.name} — ${listLabel} Tool List</h3>
            <p class="mb-4 opacity-80">${tools.length} tools recommended</p>
            <div class="bg-white bg-opacity-20 rounded-lg p-4">
                <div class="space-y-4">
                    <div>
                        <h4 class="font-bold mb-2 text-yellow-200">Must-Have (${project.basic.length} items)</h4>
                        <ul class="list-disc pl-5 space-y-1">${project.basic.map(t => `<li>${t}</li>`).join('')}</ul>
                    </div>
                    ${level !== 'basic' || budget === 'invest' ? `<div>
                        <h4 class="font-bold mb-2 text-green-200">Recommended (${project.intermediate.length} items)</h4>
                        <ul class="list-disc pl-5 space-y-1">${project.intermediate.map(t => `<li>${t}</li>`).join('')}</ul>
                    </div>` : ''}
                    ${level === 'pro' || budget === 'invest' ? `<div>
                        <h4 class="font-bold mb-2 text-blue-200">Pro / Specialty (${project.pro.length} items)</h4>
                        <ul class="list-disc pl-5 space-y-1">${project.pro.map(t => `<li>${t}</li>`).join('')}</ul>
                    </div>` : ''}
                </div>
            </div>
            <div class="mt-4 p-3 bg-white bg-opacity-10 rounded-lg text-sm">
                <strong>🦺 Don't forget safety gear:</strong> Safety glasses, gloves, hearing protection, dust mask, and a first aid kit.
            </div>
        `;
    }

    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('planningForm').addEventListener('submit', calculate);
    loadRelatedTools('planning');
})();
