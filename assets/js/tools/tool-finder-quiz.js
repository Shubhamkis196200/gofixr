// Tool Finder Quiz
(function() {
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Find the Right Tool for Your Project</h2>
            <form id="utilityForm" class="space-y-4">
                <div class="input-group">
                    <label>What kind of project are you planning?</label>
                    <select id="projectType">
                        <option value="repair">Fix / Repair Something Broken</option>
                        <option value="improve">Home Improvement / Upgrade</option>
                        <option value="maintain">Maintenance / Prevention</option>
                        <option value="estimate">Get a Cost Estimate</option>
                        <option value="calculate">Calculate Materials Needed</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>What area of the home?</label>
                    <select id="area">
                        <option value="kitchen">Kitchen</option>
                        <option value="bathroom">Bathroom</option>
                        <option value="exterior">Exterior / Siding / Roof</option>
                        <option value="plumbing">Plumbing System</option>
                        <option value="electrical">Electrical System</option>
                        <option value="hvac">Heating & Cooling</option>
                        <option value="flooring">Floors</option>
                        <option value="walls">Walls & Ceilings</option>
                        <option value="outdoor">Yard / Deck / Patio</option>
                        <option value="general">General / Whole House</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Your experience level?</label>
                    <select id="experience">
                        <option value="beginner">Beginner — First time doing this</option>
                        <option value="intermediate" selected>Intermediate — Some DIY experience</option>
                        <option value="advanced">Advanced — Comfortable with most projects</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary w-full">Find My Tools</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Choosing the Right Tool for Every Job</h2>
            <p class="mb-4">GoFixr offers over 50 free calculators, estimators, troubleshooters, and planning tools for every home repair and improvement need. But with so many options, it can be hard to know where to start. This quiz matches you with the most relevant tools based on your specific project, the area of your home involved, and your experience level.</p>

            <div class="pro-tip mb-6">
                <h4 class="font-bold">💡 Pro Tip</h4>
                <p>Start with a cost estimator to budget your project, then use a material calculator to build your shopping list, and finally check the DIY vs. Hire tool to decide whether to tackle it yourself. This three-step approach prevents the most common DIY mistakes: underbudgeting, buying the wrong quantities, and taking on projects beyond your skill level.</p>
            </div>

            <h3 class="text-2xl font-bold mt-6 mb-3">Tool Categories Explained</h3>
            <ul class="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Cost Estimators:</strong> Get realistic budget ranges for renovation and repair projects based on your specifications. Great for comparing quotes from contractors</li>
                <li><strong>Material Calculators:</strong> Know exactly how much paint, tile, concrete, mulch, or lumber to buy. Includes waste factors so you don't come up short</li>
                <li><strong>Troubleshooters:</strong> Diagnose problems with toilets, HVAC systems, water heaters, electrical issues, and more. Step-by-step symptom analysis with repair recommendations</li>
                <li><strong>Planning Tools:</strong> Maintenance schedules, project timelines, DIY vs. hire decisions, emergency checklists, and repair priority planners</li>
            </ul>

            <h3 class="text-2xl font-bold mt-6 mb-3">Most Popular Tools</h3>
            <p class="mb-4">Our most-used tools are the <strong>Paint Calculator</strong> (everyone needs to know how many gallons to buy), the <strong>Bathroom Remodel Cost Estimator</strong> (bathrooms are the #1 renovation project), and the <strong>DIY vs. Hire Calculator</strong> (which helps you honestly assess whether a project is within your capabilities). The <strong>Toilet Troubleshooter</strong> is our most popular diagnostic tool — because a running toilet is something every homeowner encounters.</p>

            <h3 class="text-2xl font-bold mt-6 mb-3">When to DIY vs. When to Hire</h3>
            <p class="mb-4">As a general rule: cosmetic projects (painting, simple flooring, landscaping) are great for DIY. Anything involving structural changes, electrical wiring, gas lines, or major plumbing should involve licensed professionals. Our DIY vs. Hire tool gives you a personalized assessment based on your specific project and skill level.</p>
        `
    };

    const toolMap = {
        'repair-kitchen':    [{slug:'garbage-disposal-fix',name:'Garbage Disposal Troubleshooter',icon:'🔧'},{slug:'appliance-error-codes',name:'Appliance Error Code Lookup',icon:'📱'},{slug:'plumbing-noise-identifier',name:'Plumbing Noise Identifier',icon:'🔊'}],
        'repair-bathroom':   [{slug:'toilet-troubleshooter',name:'Toilet Troubleshooter',icon:'🚽'},{slug:'plumbing-noise-identifier',name:'Plumbing Noise Identifier',icon:'🔊'},{slug:'grout-calculator',name:'Grout Calculator',icon:'🔲'}],
        'repair-exterior':   [{slug:'roof-leak-locator',name:'Roof Leak Locator',icon:'🔍'},{slug:'foundation-crack-evaluator',name:'Foundation Crack Evaluator',icon:'🏗️'},{slug:'siding-installation-cost',name:'Siding Cost Estimator',icon:'🏠'}],
        'repair-plumbing':   [{slug:'toilet-troubleshooter',name:'Toilet Troubleshooter',icon:'🚽'},{slug:'plumbing-noise-identifier',name:'Plumbing Noise Identifier',icon:'🔊'},{slug:'plumbing-repair-cost',name:'Plumbing Repair Cost',icon:'🔧'}],
        'repair-electrical': [{slug:'electrical-diagnoser',name:'Electrical Diagnoser',icon:'⚡'},{slug:'electrical-work-cost',name:'Electrical Work Cost',icon:'💡'},{slug:'load-calculator',name:'Load Calculator',icon:'📊'}],
        'repair-hvac':       [{slug:'hvac-diagnoser',name:'HVAC Troubleshooter',icon:'❄️'},{slug:'water-heater-troubleshooter',name:'Water Heater Troubleshooter',icon:'🔥'},{slug:'btu-calculator',name:'BTU Calculator',icon:'🌡️'}],
        'repair-flooring':   [{slug:'flooring-cost',name:'Flooring Cost Estimator',icon:'🏠'},{slug:'tile-calculator',name:'Tile Calculator',icon:'🔲'},{slug:'grout-calculator',name:'Grout Calculator',icon:'🔲'}],
        'repair-walls':      [{slug:'drywall-repair-cost',name:'Drywall Repair Cost',icon:'🔨'},{slug:'paint-calculator',name:'Paint Calculator',icon:'🎨'},{slug:'room-measurement-guide',name:'Room Measurement Guide',icon:'📐'}],
        'repair-outdoor':    [{slug:'deck-building-cost',name:'Deck Building Cost',icon:'🏗️'},{slug:'concrete-patio-cost',name:'Concrete Patio Cost',icon:'🏗️'},{slug:'fence-installation-cost',name:'Fence Cost',icon:'🏡'}],
        'repair-general':    [{slug:'diy-vs-hire',name:'DIY vs. Hire Calculator',icon:'🤔'},{slug:'repair-priority',name:'Repair Priority Planner',icon:'📋'},{slug:'emergency-checklist',name:'Emergency Checklist',icon:'🚨'}],
        'improve-kitchen':   [{slug:'kitchen-remodel-cost',name:'Kitchen Remodel Cost',icon:'🍳'},{slug:'paint-calculator',name:'Paint Calculator',icon:'🎨'},{slug:'home-value-impact',name:'Home Value Impact',icon:'📈'}],
        'improve-bathroom':  [{slug:'bathroom-remodel-cost',name:'Bathroom Remodel Cost',icon:'🛁'},{slug:'tile-calculator',name:'Tile Calculator',icon:'🔲'},{slug:'home-value-impact',name:'Home Value Impact',icon:'📈'}],
        'estimate-general':  [{slug:'diy-vs-hire',name:'DIY vs. Hire',icon:'🤔'},{slug:'home-value-impact',name:'Home Value Impact',icon:'📈'},{slug:'material-cost-comparison',name:'Material Comparison',icon:'📊'}],
        'calculate-general': [{slug:'paint-calculator',name:'Paint Calculator',icon:'🎨'},{slug:'room-measurement-guide',name:'Room Measurement',icon:'📐'},{slug:'concrete-calculator',name:'Concrete Calculator',icon:'🏗️'}],
        'maintain-general':  [{slug:'maintenance-schedule',name:'Maintenance Schedule',icon:'📅'},{slug:'seasonal-maintenance',name:'Seasonal Maintenance',icon:'🍂'},{slug:'mold-risk-assessment',name:'Mold Risk Assessment',icon:'🔬'}],
    };

    function calculate(e) {
        e.preventDefault();
        const proj = document.getElementById('projectType').value;
        const area = document.getElementById('area').value;
        const exp = document.getElementById('experience').value;

        let key = `${proj}-${area}`;
        let tools = toolMap[key] || toolMap[`${proj}-general`] || toolMap['repair-general'];

        const expTips = {
            beginner: 'As a beginner, start with our troubleshooters and guides before tackling repairs. Consider using the DIY vs. Hire tool.',
            intermediate: 'With some experience, you can handle most projects with the right planning tools and cost estimates.',
            advanced: 'As an experienced DIYer, our material calculators and cost estimators will help you plan efficiently.'
        };

        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-2xl font-bold mb-4">Recommended Tools for You</h3>
            <p class="text-sm mb-4">${expTips[exp]}</p>
            <div class="space-y-3">
                ${tools.map((t,i) => `
                    <a href="${t.slug}.html" class="block bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg p-4 transition-all">
                        <div class="flex items-center gap-3">
                            <span class="text-3xl">${t.icon}</span>
                            <div>
                                <h4 class="font-bold">${i===0?'⭐ Best Match: ':''}${t.name}</h4>
                                <p class="text-sm opacity-80">Click to open this tool →</p>
                            </div>
                        </div>
                    </a>
                `).join('')}
            </div>
            <p class="text-sm mt-4 opacity-70">Want to see all tools? <a href="../index.html#tools" class="underline">Browse all 50+ tools</a></p>
        `;
    }

    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('utilityForm').addEventListener('submit', calculate);
    loadRelatedTools('utility');
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
