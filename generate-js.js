#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Create assets/js/tools directory
const toolsDir = path.join(__dirname, 'assets', 'js', 'tools');
if (!fs.existsSync(toolsDir)) {
  fs.mkdirSync(toolsDir, { recursive: true });
}

// Load tools data
const tools = JSON.parse(fs.readFileSync(path.join(__dirname, 'tools-data.json')));

// JavaScript generators for different tool types
const generators = {
  // Cost calculator template
  cost: (tool) => `// ${tool.name} - Cost Calculator
(function() {
    const content = {
        interface: \`
            <h2 class="text-2xl font-bold mb-6">Calculate Your Project Cost</h2>
            <form id="costForm" class="space-y-4">
                <div class="input-group">
                    <label>Project Size (sq ft)</label>
                    <input type="number" id="sqft" min="1" value="100" required>
                </div>
                <div class="input-group">
                    <label>Quality Level</label>
                    <select id="quality">
                        <option value="budget">Budget (Basic materials)</option>
                        <option value="standard" selected>Standard (Mid-grade)</option>
                        <option value="premium">Premium (High-end)</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Location Type</label>
                    <select id="location">
                        <option value="rural">Rural</option>
                        <option value="suburban" selected>Suburban</option>
                        <option value="urban">Urban</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Include Labor?</label>
                    <select id="labor">
                        <option value="yes" selected>Yes - Full Installation</option>
                        <option value="no">No - DIY (Materials Only)</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary w-full">Calculate Cost</button>
            </form>
            <div id="result" class="hidden"></div>
        \`,
        
        education: \`
            <h2 class="text-3xl font-bold mb-4">Understanding ${tool.name.replace(' Calculator', '').replace(' Estimator', '')} Costs</h2>
            
            <div class="pro-tip mb-6">
                <h4 class="font-bold mb-2">💡 Pro Tip</h4>
                <p>Get at least 3 quotes from licensed contractors and compare them against this estimate. Costs can vary significantly by region.</p>
            </div>

            <h3 class="text-2xl font-bold mt-6 mb-3">Cost Breakdown</h3>
            <p>A typical project includes:</p>
            <ul class="list-disc pl-6 space-y-2 my-4">
                <li><strong>Materials:</strong> 40-60% of total cost</li>
                <li><strong>Labor:</strong> 30-50% of total cost</li>
                <li><strong>Permits & Fees:</strong> 5-10% of total cost</li>
                <li><strong>Disposal & Cleanup:</strong> 5% of total cost</li>
            </ul>

            <h3 class="text-2xl font-bold mt-6 mb-3">Factors That Affect Cost</h3>
            <ul class="list-disc pl-6 space-y-2 my-4">
                <li><strong>Location:</strong> Urban areas typically cost 20-40% more than rural</li>
                <li><strong>Accessibility:</strong> Difficult access can increase labor costs</li>
                <li><strong>Time of Year:</strong> Peak season (spring/summer) may cost more</li>
                <li><strong>Material Quality:</strong> Premium materials can double the cost</li>
                <li><strong>Project Complexity:</strong> Custom work requires more skilled labor</li>
            </ul>

            <div class="warning-box mt-6">
                <h4 class="font-bold mb-2">⚠️ Important</h4>
                <p>These are estimates only. Actual costs vary based on specific project requirements, local labor rates, and material availability. Always get multiple professional quotes.</p>
            </div>

            <h3 class="text-2xl font-bold mt-6 mb-3">DIY vs Professional</h3>
            <p>Consider hiring a professional if:</p>
            <ul class="list-disc pl-6 space-y-2 my-4">
                <li>The project requires permits or inspections</li>
                <li>You lack experience with similar projects</li>
                <li>The project involves electrical, plumbing, or structural work</li>
                <li>You don't have the necessary tools or equipment</li>
                <li>Time constraints make DIY impractical</li>
            </ul>
        \`
    };

    function calculate(e) {
        e.preventDefault();
        
        const sqft = parseFloat(document.getElementById('sqft').value);
        const quality = document.getElementById('quality').value;
        const location = document.getElementById('location').value;
        const labor = document.getElementById('labor').value;
        
        // Base cost per square foot (varies by quality)
        const baseCosts = { budget: 15, standard: 30, premium: 60 };
        let costPerSqft = baseCosts[quality];
        
        // Location multiplier
        const locationMult = { rural: 0.85, suburban: 1.0, urban: 1.25 };
        costPerSqft *= locationMult[location];
        
        // Calculate totals
        let materialCost = sqft * costPerSqft * 0.5;
        let laborCost = labor === 'yes' ? sqft * costPerSqft * 0.5 : 0;
        let totalCost = materialCost + laborCost;
        
        // Add contingency
        const contingency = totalCost * 0.1;
        const totalWithContingency = totalCost + contingency;
        
        displayResult({
            sqft,
            materialCost,
            laborCost,
            contingency,
            totalCost,
            totalWithContingency,
            quality,
            location
        });
    }

    function displayResult(data) {
        const resultDiv = document.getElementById('result');
        resultDiv.className = 'result-box mt-6';
        resultDiv.innerHTML = \`
            <h3 class="text-3xl font-bold mb-4">Estimated Cost: $\${data.totalCost.toLocaleString('en-US', {maximumFractionDigits: 0})}</h3>
            <p class="text-lg mb-4">Range: $\${(data.totalCost * 0.85).toLocaleString('en-US', {maximumFractionDigits: 0})} - $\${(data.totalCost * 1.15).toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
            
            <div class="bg-white bg-opacity-20 rounded-lg p-4 mb-4">
                <h4 class="font-bold mb-3">Cost Breakdown</h4>
                <div class="space-y-2">
                    <div class="flex justify-between"><span>Materials:</span><span class="font-bold">$\${data.materialCost.toLocaleString('en-US', {maximumFractionDigits: 0})}</span></div>
                    \${data.laborCost > 0 ? \`<div class="flex justify-between"><span>Labor:</span><span class="font-bold">$\${data.laborCost.toLocaleString('en-US', {maximumFractionDigits: 0})}</span></div>\` : ''}
                    <div class="flex justify-between"><span>Contingency (10%):</span><span class="font-bold">$\${data.contingency.toLocaleString('en-US', {maximumFractionDigits: 0})}</span></div>
                    <div class="border-t border-white border-opacity-30 pt-2 mt-2 flex justify-between text-lg"><span class="font-bold">Total with Contingency:</span><span class="font-bold">$\${data.totalWithContingency.toLocaleString('en-US', {maximumFractionDigits: 0})}</span></div>
                </div>
            </div>
            
            <p class="text-sm opacity-90">📍 Based on \${data.quality} quality in \${data.location} area</p>
            <p class="text-sm opacity-90 mt-2">💰 Cost per sq ft: $\${(data.totalCost / data.sqft).toFixed(2)}</p>
        \`;
    }

    // Initialize
    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('costForm').addEventListener('submit', calculate);
    
    // Related tools
    loadRelatedTools('${tool.category}');
})();

function loadRelatedTools(category) {
    fetch('../tools-data.json')
        .then(r => r.json())
        .then(tools => {
            const related = tools
                .filter(t => t.category === category && t.slug !== '${tool.slug}')
                .slice(0, 3);
            
            const html = related.map(t => \`
                <a href="\${t.slug}.html" class="tool-card block">
                    <div class="text-3xl mb-2">\${t.icon}</div>
                    <h4 class="font-bold text-lg mb-1">\${t.name}</h4>
                    <p class="text-sm text-gray-600">\${t.desc}</p>
                </a>
            \`).join('');
            
            document.getElementById('relatedTools').innerHTML = html;
        });
}
`,

  // Planning calculator template
  planning: (tool) => `// ${tool.name} - Planning Tool
(function() {
    const content = {
        interface: \`
            <h2 class="text-2xl font-bold mb-6">Calculate Your Material Needs</h2>
            <form id="planningForm" class="space-y-4">
                <div class="input-group">
                    <label>Length (feet)</label>
                    <input type="number" id="length" min="1" value="10" step="0.1" required>
                </div>
                <div class="input-group">
                    <label>Width (feet)</label>
                    <input type="number" id="width" min="1" value="10" step="0.1" required>
                </div>
                <div class="input-group">
                    <label>Add Waste Factor (%)</label>
                    <select id="waste">
                        <option value="5">5% - Simple project</option>
                        <option value="10" selected>10% - Standard</option>
                        <option value="15">15% - Complex pattern</option>
                        <option value="20">20% - Lots of cuts</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary w-full">Calculate Materials</button>
            </form>
            <div id="result" class="hidden"></div>
        \`,
        
        education: \`
            <h2 class="text-3xl font-bold mb-4">Material Planning Guide</h2>
            
            <div class="pro-tip mb-6">
                <h4 class="font-bold mb-2">💡 Pro Tip</h4>
                <p>Always buy extra materials to account for cuts, mistakes, and future repairs. It's better to return unused materials than to run short mid-project.</p>
            </div>

            <h3 class="text-2xl font-bold mt-6 mb-3">Why Add a Waste Factor?</h3>
            <ul class="list-disc pl-6 space-y-2 my-4">
                <li><strong>Cuts and Trims:</strong> Materials at edges need to be cut to fit</li>
                <li><strong>Damaged Pieces:</strong> Some materials may arrive damaged</li>
                <li><strong>Installation Errors:</strong> Mistakes happen, especially on first DIY projects</li>
                <li><strong>Pattern Matching:</strong> More waste when matching patterns or grain</li>
                <li><strong>Future Repairs:</strong> Keep extras for future patch work</li>
            </ul>

            <h3 class="text-2xl font-bold mt-6 mb-3">Measuring Tips</h3>
            <ul class="list-disc pl-6 space-y-2 my-4">
                <li>Measure twice, order once - double-check all measurements</li>
                <li>Account for obstacles like doors, windows, and built-ins</li>
                <li>Draw a diagram with all dimensions labeled</li>
                <li>Use a laser measure for large rooms (more accurate)</li>
                <li>Round up to the nearest inch when in doubt</li>
            </ul>

            <div class="warning-box mt-6">
                <h4 class="font-bold mb-2">⚠️ Important</h4>
                <p>These calculations are estimates. Always consult product specifications and manufacturer recommendations for precise quantities.</p>
            </div>

            <h3 class="text-2xl font-bold mt-6 mb-3">Shopping Tips</h3>
            <ul class="list-disc pl-6 space-y-2 my-4">
                <li>Buy all materials from the same batch/lot for color consistency</li>
                <li>Check return policies before purchasing extra</li>
                <li>Keep receipts and packaging for returns</li>
                <li>Store materials properly until installation</li>
                <li>Inspect materials before installation begins</li>
            </ul>
        \`
    };

    function calculate(e) {
        e.preventDefault();
        
        const length = parseFloat(document.getElementById('length').value);
        const width = parseFloat(document.getElementById('width').value);
        const wastePercent = parseFloat(document.getElementById('waste').value);
        
        const sqft = length * width;
        const waste = sqft * (wastePercent / 100);
        const totalSqft = sqft + waste;
        
        displayResult({
            length,
            width,
            sqft,
            waste,
            wastePercent,
            totalSqft
        });
    }

    function displayResult(data) {
        const resultDiv = document.getElementById('result');
        resultDiv.className = 'result-box mt-6';
        resultDiv.innerHTML = \`
            <h3 class="text-3xl font-bold mb-4">You Need: \${data.totalSqft.toFixed(1)} sq ft</h3>
            
            <div class="bg-white bg-opacity-20 rounded-lg p-4 mb-4">
                <h4 class="font-bold mb-3">Calculation Breakdown</h4>
                <div class="space-y-2">
                    <div class="flex justify-between"><span>Room Size:</span><span class="font-bold">\${data.length}' × \${data.width}' = \${data.sqft.toFixed(1)} sq ft</span></div>
                    <div class="flex justify-between"><span>Waste Factor (\${data.wastePercent}%):</span><span class="font-bold">+\${data.waste.toFixed(1)} sq ft</span></div>
                    <div class="border-t border-white border-opacity-30 pt-2 mt-2 flex justify-between text-lg">
                        <span class="font-bold">Total to Purchase:</span>
                        <span class="font-bold">\${data.totalSqft.toFixed(1)} sq ft</span>
                    </div>
                </div>
            </div>
            
            <div class="bg-green-500 bg-opacity-20 rounded-lg p-4">
                <p class="font-bold mb-2">✅ Shopping List:</p>
                <ul class="space-y-1 text-sm">
                    <li>📦 Order at least \${Math.ceil(data.totalSqft)} sq ft of material</li>
                    <li>📏 Double-check measurements before purchasing</li>
                    <li>🧾 Keep receipts for returns of unused materials</li>
                </ul>
            </div>
        \`;
    }

    // Initialize
    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('planningForm').addEventListener('submit', calculate);
    
    // Related tools
    loadRelatedTools('${tool.category}');
})();

function loadRelatedTools(category) {
    fetch('../tools-data.json')
        .then(r => r.json())
        .then(tools => {
            const related = tools
                .filter(t => t.category === category && t.slug !== '${tool.slug}')
                .slice(0, 3);
            
            const html = related.map(t => \`
                <a href="\${t.slug}.html" class="tool-card block">
                    <div class="text-3xl mb-2">\${t.icon}</div>
                    <h4 class="font-bold text-lg mb-1">\${t.name}</h4>
                    <p class="text-sm text-gray-600">\${t.desc}</p>
                </a>
            \`).join('');
            
            document.getElementById('relatedTools').innerHTML = html;
        });
}
`,

  // Diagnostic tool template
  diagnostic: (tool) => `// ${tool.name} - Diagnostic Tool
(function() {
    const content = {
        interface: \`
            <h2 class="text-2xl font-bold mb-6">Describe Your Problem</h2>
            <form id="diagnosticForm" class="space-y-4">
                <div class="input-group">
                    <label>What's the main symptom?</label>
                    <select id="symptom" required>
                        <option value="">Select a symptom...</option>
                        <option value="no-function">Not working at all</option>
                        <option value="partial">Working partially/intermittently</option>
                        <option value="noise">Making unusual noises</option>
                        <option value="leak">Leaking water</option>
                        <option value="smell">Strange smell</option>
                        <option value="performance">Poor performance</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>When did this start?</label>
                    <select id="timing">
                        <option value="sudden">Just now / suddenly</option>
                        <option value="recent">In the past few days</option>
                        <option value="gradual">Gradually over time</option>
                        <option value="always">Has always been an issue</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Have you tried anything already?</label>
                    <textarea id="attempts" rows="3" class="w-full p-3 border-2 border-gray-300 rounded-lg" placeholder="Describe what you've tried..."></textarea>
                </div>
                <button type="submit" class="btn-primary w-full">Diagnose Problem</button>
            </form>
            <div id="result" class="hidden"></div>
        \`,
        
        education: \`
            <h2 class="text-3xl font-bold mb-4">Troubleshooting Guide</h2>
            
            <div class="danger-box mb-6">
                <h4 class="font-bold mb-2">⚠️ Safety First</h4>
                <p>Before attempting any repairs, turn off power/water to the affected area. If you're not comfortable with DIY repairs, call a licensed professional.</p>
            </div>

            <h3 class="text-2xl font-bold mt-6 mb-3">Common Causes</h3>
            <p>Most problems fall into these categories:</p>
            <ul class="list-disc pl-6 space-y-2 my-4">
                <li><strong>Wear and Tear:</strong> Normal aging of components</li>
                <li><strong>Clogs/Blockages:</strong> Buildup of debris or mineral deposits</li>
                <li><strong>Loose Connections:</strong> Electrical or mechanical connections</li>
                <li><strong>Failed Components:</strong> Individual parts that need replacement</li>
                <li><strong>Improper Installation:</strong> Original installation issues</li>
            </ul>

            <h3 class="text-2xl font-bold mt-6 mb-3">When to Call a Pro</h3>
            <ul class="list-disc pl-6 space-y-2 my-4">
                <li>Problem involves electrical wiring or gas lines</li>
                <li>You don't have the right tools or experience</li>
                <li>Problem persists after basic troubleshooting</li>
                <li>Safety concerns (water near electricity, gas smell, etc.)</li>
                <li>Warranty work that requires licensed technician</li>
            </ul>

            <div class="pro-tip mt-6">
                <h4 class="font-bold mb-2">💡 Pro Tip</h4>
                <p>Take photos and notes during troubleshooting. This helps professionals diagnose faster and can save you money on service calls.</p>
            </div>

            <h3 class="text-2xl font-bold mt-6 mb-3">Diagnostic Process</h3>
            <ol class="list-decimal pl-6 space-y-2 my-4">
                <li><strong>Identify the symptom:</strong> What exactly isn't working?</li>
                <li><strong>Check the obvious:</strong> Power, water supply, switches</li>
                <li><strong>Isolate the problem:</strong> Test related systems</li>
                <li><strong>Research solutions:</strong> Look up error codes or symptoms</li>
                <li><strong>Attempt safe fixes:</strong> Try simple solutions first</li>
                <li><strong>Know when to stop:</strong> Call professional if needed</li>
            </ol>
        \`
    };

    const solutions = {
        'no-function': {
            title: 'Not Working At All',
            checks: [
                'Check if power/water supply is on',
                'Inspect circuit breaker or GFCI outlet',
                'Look for tripped switches or shutoff valves',
                'Check for blown fuses',
                'Verify main switch is in ON position'
            ],
            likely: 'Power supply issue or main component failure',
            diy: 'Easy - Start with power/supply checks',
            pro: 'If power supply is fine, likely needs professional diagnosis'
        },
        'partial': {
            title: 'Working Partially/Intermittently',
            checks: [
                'Check for loose electrical connections',
                'Inspect for overheating (touch components carefully)',
                'Test under different conditions',
                'Check for corrosion on connections',
                'Look for worn or damaged parts'
            ],
            likely: 'Failing component or loose connection',
            diy: 'Medium - Requires some troubleshooting skills',
            pro: 'Consider professional if you can\'t identify the issue'
        },
        'noise': {
            title: 'Making Unusual Noises',
            checks: [
                'Identify when noise occurs (startup, running, shutdown)',
                'Determine noise type (grinding, squealing, banging)',
                'Check for loose parts or mounting',
                'Look for debris or foreign objects',
                'Inspect belts and bearings'
            ],
            likely: 'Worn bearings, loose parts, or debris',
            diy: 'Medium - Depends on accessibility',
            pro: 'If noise is severe or grinding, call professional'
        },
        'leak': {
            title: 'Leaking Water',
            checks: [
                'Find exact source of leak',
                'Check all connections and seals',
                'Inspect for cracks or damage',
                'Tighten loose connections',
                'Look for worn gaskets or O-rings'
            ],
            likely: 'Worn seal, loose connection, or crack',
            diy: 'Easy to Medium - Many leaks are simple fixes',
            pro: 'If leak is from tank or major component, may need professional'
        },
        'smell': {
            title: 'Strange Smell',
            checks: [
                'Identify smell type (burning, rotten, chemical)',
                'Check for overheating components',
                'Look for signs of burning or melting',
                'Inspect for mold or standing water',
                'Check drain for clogs'
            ],
            likely: 'Overheating, burning, or mold/mildew',
            diy: 'Easy for cleaning issues, hard for electrical',
            pro: 'If smell is electrical/burning, turn off and call professional immediately'
        },
        'performance': {
            title: 'Poor Performance',
            checks: [
                'Clean filters and screens',
                'Check for clogs or blockages',
                'Verify settings are correct',
                'Inspect for worn components',
                'Check age and maintenance history'
            ],
            likely: 'Maintenance needed or worn components',
            diy: 'Easy - Start with cleaning and maintenance',
            pro: 'If performance doesn\'t improve after maintenance, may need repair'
        }
    };

    function diagnose(e) {
        e.preventDefault();
        
        const symptom = document.getElementById('symptom').value;
        const timing = document.getElementById('timing').value;
        const attempts = document.getElementById('attempts').value;
        
        if (!symptom) {
            alert('Please select a symptom');
            return;
        }
        
        const solution = solutions[symptom];
        displayDiagnosis(solution, timing, attempts);
    }

    function displayDiagnosis(solution, timing, attempts) {
        const urgency = timing === 'sudden' ? 'HIGH' : timing === 'recent' ? 'MEDIUM' : 'LOW';
        const urgencyColors = {
            HIGH: 'bg-red-500',
            MEDIUM: 'bg-yellow-500',
            LOW: 'bg-green-500'
        };
        
        const resultDiv = document.getElementById('result');
        resultDiv.className = 'mt-6';
        resultDiv.innerHTML = \`
            <div class="result-box mb-4">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-2xl font-bold">\${solution.title}</h3>
                    <span class="\${urgencyColors[urgency]} text-white px-3 py-1 rounded-full text-sm font-bold">
                        \${urgency} URGENCY
                    </span>
                </div>
                <p class="text-lg mb-2"><strong>Likely Cause:</strong> \${solution.likely}</p>
                <p class="mb-4"><strong>DIY Difficulty:</strong> \${solution.diy}</p>
            </div>

            <div class="tool-card mb-4">
                <h4 class="text-xl font-bold mb-3">🔍 Diagnostic Checklist</h4>
                <p class="mb-3">Work through these steps in order:</p>
                <div class="space-y-2">
                    \${solution.checks.map((check, i) => \`
                        <label class="flex items-start gap-3 p-3 hover:bg-gray-50 rounded cursor-pointer">
                            <input type="checkbox" class="mt-1">
                            <span><strong>\${i + 1}.</strong> \${check}</span>
                        </label>
                    \`).join('')}
                </div>
            </div>

            <div class="tool-card bg-blue-50">
                <h4 class="text-xl font-bold mb-3">📋 Recommendation</h4>
                <p class="mb-3">\${solution.pro}</p>
                <a href="../guides.html" class="btn-secondary">View Repair Guides</a>
            </div>

            \${attempts ? \`
                <div class="tool-card mt-4 bg-gray-50">
                    <h4 class="font-bold mb-2">What You've Tried:</h4>
                    <p class="text-sm text-gray-700">\${attempts}</p>
                </div>
            \` : ''}
        \`;
    }

    // Initialize
    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('diagnosticForm').addEventListener('submit', diagnose);
    
    // Related tools
    loadRelatedTools('${tool.category}');
})();

function loadRelatedTools(category) {
    fetch('../tools-data.json')
        .then(r => r.json())
        .then(tools => {
            const related = tools
                .filter(t => t.category === category && t.slug !== '${tool.slug}')
                .slice(0, 3);
            
            const html = related.map(t => \`
                <a href="\${t.slug}.html" class="tool-card block">
                    <div class="text-3xl mb-2">\${t.icon}</div>
                    <h4 class="font-bold text-lg mb-1">\${t.name}</h4>
                    <p class="text-sm text-gray-600">\${t.desc}</p>
                </a>
            \`).join('');
            
            document.getElementById('relatedTools').innerHTML = html;
        });
}
`,

  // Utility tool template
  utility: (tool) => `// ${tool.name} - Utility Tool
(function() {
    const content = {
        interface: \`
            <h2 class="text-2xl font-bold mb-6">Use This Tool</h2>
            <form id="utilityForm" class="space-y-4">
                <div class="input-group">
                    <label>Primary Input</label>
                    <input type="number" id="input1" min="0" step="0.1" required>
                </div>
                <div class="input-group">
                    <label>Options</label>
                    <select id="option1">
                        <option value="standard">Standard</option>
                        <option value="advanced">Advanced</option>
                        <option value="professional">Professional</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary w-full">Calculate Result</button>
            </form>
            <div id="result" class="hidden"></div>
        \`,
        
        education: \`
            <h2 class="text-3xl font-bold mb-4">How to Use This Tool</h2>
            
            <div class="pro-tip mb-6">
                <h4 class="font-bold mb-2">💡 Pro Tip</h4>
                <p>This tool provides quick estimates to help with planning and decision-making. For critical projects, always verify with professional measurements and calculations.</p>
            </div>

            <h3 class="text-2xl font-bold mt-6 mb-3">Understanding the Results</h3>
            <p>The tool calculates based on industry standards and best practices:</p>
            <ul class="list-disc pl-6 space-y-2 my-4">
                <li>Results are approximations for planning purposes</li>
                <li>Actual requirements may vary based on specific conditions</li>
                <li>Always consult product specifications</li>
                <li>Consider local building codes and requirements</li>
            </ul>

            <h3 class="text-2xl font-bold mt-6 mb-3">Best Practices</h3>
            <ul class="list-disc pl-6 space-y-2 my-4">
                <li>Double-check all input measurements</li>
                <li>Account for specific project conditions</li>
                <li>Factor in safety margins when applicable</li>
                <li>Consult professionals for complex projects</li>
                <li>Keep records of calculations for reference</li>
            </ul>

            <div class="warning-box mt-6">
                <h4 class="font-bold mb-2">⚠️ Important</h4>
                <p>This tool provides estimates only. For structural, electrical, or plumbing work, always consult with licensed professionals to ensure safety and code compliance.</p>
            </div>
        \`
    };

    function calculate(e) {
        e.preventDefault();
        
        const input1 = parseFloat(document.getElementById('input1').value);
        const option1 = document.getElementById('option1').value;
        
        // Sample calculation
        const multipliers = { standard: 1.0, advanced: 1.25, professional: 1.5 };
        const result = input1 * multipliers[option1];
        
        displayResult({
            input: input1,
            option: option1,
            result: result
        });
    }

    function displayResult(data) {
        const resultDiv = document.getElementById('result');
        resultDiv.className = 'result-box mt-6';
        resultDiv.innerHTML = \`
            <h3 class="text-3xl font-bold mb-4">Result: \${data.result.toFixed(2)}</h3>
            
            <div class="bg-white bg-opacity-20 rounded-lg p-4 mb-4">
                <h4 class="font-bold mb-3">Calculation Details</h4>
                <div class="space-y-2">
                    <div class="flex justify-between"><span>Input Value:</span><span class="font-bold">\${data.input}</span></div>
                    <div class="flex justify-between"><span>Option Selected:</span><span class="font-bold capitalize">\${data.option}</span></div>
                    <div class="border-t border-white border-opacity-30 pt-2 mt-2 flex justify-between text-lg">
                        <span class="font-bold">Final Result:</span>
                        <span class="font-bold">\${data.result.toFixed(2)}</span>
                    </div>
                </div>
            </div>
            
            <p class="text-sm opacity-90">✓ Calculation complete</p>
        \`;
    }

    // Initialize
    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('utilityForm').addEventListener('submit', calculate);
    
    // Related tools
    loadRelatedTools('${tool.category}');
})();

function loadRelatedTools(category) {
    fetch('../tools-data.json')
        .then(r => r.json())
        .then(tools => {
            const related = tools
                .filter(t => t.category === category && t.slug !== '${tool.slug}')
                .slice(0, 3);
            
            const html = related.map(t => \`
                <a href="\${t.slug}.html" class="tool-card block">
                    <div class="text-3xl mb-2">\${t.icon}</div>
                    <h4 class="font-bold text-lg mb-1">\${t.name}</h4>
                    <p class="text-sm text-gray-600">\${t.desc}</p>
                </a>
            \`).join('');
            
            document.getElementById('relatedTools').innerHTML = html;
        });
}
`
};

// Generate JS files for all tools
console.log('\nGenerating JavaScript files for all tools...\n');

tools.forEach(tool => {
  const generator = generators[tool.category];
  if (!generator) {
    console.log(\`⚠️  No generator for category: \${tool.category}\`);
    return;
  }
  
  const js = generator(tool);
  const filename = path.join(toolsDir, \`\${tool.slug}.js\`);
  fs.writeFileSync(filename, js);
  console.log(\`✓ Created \${tool.slug}.js\`);
});

console.log(\`\n✅ Generated JavaScript for all \${tools.length} tools!\n\`);
