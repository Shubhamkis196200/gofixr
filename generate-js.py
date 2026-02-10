#!/usr/bin/env python3
import os
import json

TOOLS_DIR = "/home/ubuntu/.openclaw/workspace/website-farm/gofixr/assets/js/tools"

# Load tools data
with open('/home/ubuntu/.openclaw/workspace/website-farm/gofixr/tools-data.json') as f:
    tools = json.load(f)

# Template JS code for each category
templates = {
    'cost': '''// {name}
(function() {{
    const content = {{
        interface: `
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
        `,
        
        education: `
            <h2 class="text-3xl font-bold mb-4">Understanding Project Costs</h2>
            <div class="pro-tip mb-6">
                <h4 class="font-bold mb-2">💡 Pro Tip</h4>
                <p>Get at least 3 quotes from licensed contractors. Costs vary by region.</p>
            </div>
            <h3 class="text-2xl font-bold mt-6 mb-3">Cost Breakdown</h3>
            <ul class="list-disc pl-6 space-y-2 my-4">
                <li><strong>Materials:</strong> 40-60% of total cost</li>
                <li><strong>Labor:</strong> 30-50% of total cost</li>
                <li><strong>Permits:</strong> 5-10% of total cost</li>
            </ul>
        `
    }};

    function calculate(e) {{
        e.preventDefault();
        const sqft = parseFloat(document.getElementById('sqft').value);
        const quality = document.getElementById('quality').value;
        const location = document.getElementById('location').value;
        const labor = document.getElementById('labor').value;
        
        const baseCosts = {{ budget: 15, standard: 30, premium: 60 }};
        let costPerSqft = baseCosts[quality];
        const locationMult = {{ rural: 0.85, suburban: 1.0, urban: 1.25 }};
        costPerSqft *= locationMult[location];
        
        let materialCost = sqft * costPerSqft * 0.5;
        let laborCost = labor === 'yes' ? sqft * costPerSqft * 0.5 : 0;
        let totalCost = materialCost + laborCost;
        const contingency = totalCost * 0.1;
        
        displayResult({{ sqft, materialCost, laborCost, contingency, totalCost, quality, location }});
    }}

    function displayResult(d) {{
        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-3xl font-bold mb-4">Estimated Cost: $$${{d.totalCost.toLocaleString('en-US', {{maximumFractionDigits: 0}})}}</h3>
            <div class="bg-white bg-opacity-20 rounded-lg p-4">
                <div class="space-y-2">
                    <div class="flex justify-between"><span>Materials:</span><span class="font-bold">$$${{d.materialCost.toLocaleString()}}</span></div>
                    ${{d.laborCost > 0 ? `<div class="flex justify-between"><span>Labor:</span><span class="font-bold">$$${{d.laborCost.toLocaleString()}}</span></div>` : ''}}
                    <div class="flex justify-between"><span>Contingency:</span><span class="font-bold">$$${{d.contingency.toLocaleString()}}</span></div>
                </div>
            </div>
        `;
    }}

    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('costForm').addEventListener('submit', calculate);
    loadRelatedTools('{category}');
}})();

function loadRelatedTools(category) {{
    fetch('../tools-data.json').then(r => r.json()).then(tools => {{
        const related = tools.filter(t => t.category === category).slice(0, 3);
        document.getElementById('relatedTools').innerHTML = related.map(t => `
            <a href="${{t.slug}}.html" class="tool-card block">
                <div class="text-3xl mb-2">${{t.icon}}</div>
                <h4 class="font-bold text-lg mb-1">${{t.name}}</h4>
                <p class="text-sm text-gray-600">${{t.desc}}</p>
            </a>
        `).join('');
    }});
}}
''',

    'planning': '''// {name}
(function() {{
    const content = {{
        interface: `
            <h2 class="text-2xl font-bold mb-6">Calculate Materials Needed</h2>
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
                    <label>Waste Factor</label>
                    <select id="waste">
                        <option value="5">5% - Simple</option>
                        <option value="10" selected>10% - Standard</option>
                        <option value="15">15% - Complex</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary w-full">Calculate</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Material Planning Guide</h2>
            <div class="pro-tip mb-6">
                <h4 class="font-bold mb-2">💡 Pro Tip</h4>
                <p>Always buy extra for cuts, mistakes, and future repairs.</p>
            </div>
            <h3 class="text-2xl font-bold mt-6 mb-3">Why Waste Factor?</h3>
            <ul class="list-disc pl-6 space-y-2">
                <li>Cuts and trims at edges</li>
                <li>Pattern matching</li>
                <li>Damaged pieces</li>
                <li>Future repairs</li>
            </ul>
        `
    }};

    function calculate(e) {{
        e.preventDefault();
        const length = parseFloat(document.getElementById('length').value);
        const width = parseFloat(document.getElementById('width').value);
        const waste = parseFloat(document.getElementById('waste').value);
        
        const sqft = length * width;
        const wasteAmt = sqft * (waste / 100);
        const total = sqft + wasteAmt;
        
        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-3xl font-bold mb-4">You Need: ${{total.toFixed(1)}} sq ft</h3>
            <div class="bg-white bg-opacity-20 rounded-lg p-4">
                <div class="space-y-2">
                    <div class="flex justify-between"><span>Room:</span><span>${{length}}' × ${{width}}' = ${{sqft.toFixed(1)}} sq ft</span></div>
                    <div class="flex justify-between"><span>Waste (${{waste}}%):</span><span>+${{wasteAmt.toFixed(1)}} sq ft</span></div>
                    <div class="border-t border-white pt-2"><span class="font-bold">Total:</span><span class="font-bold">${{total.toFixed(1)}} sq ft</span></div>
                </div>
            </div>
        `;
    }}

    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('planningForm').addEventListener('submit', calculate);
    loadRelatedTools('{category}');
}})();

function loadRelatedTools(category) {{
    fetch('../tools-data.json').then(r => r.json()).then(tools => {{
        const related = tools.filter(t => t.category === category).slice(0, 3);
        document.getElementById('relatedTools').innerHTML = related.map(t => `
            <a href="${{t.slug}}.html" class="tool-card block">
                <div class="text-3xl mb-2">${{t.icon}}</div>
                <h4 class="font-bold">${{t.name}}</h4>
                <p class="text-sm text-gray-600">${{t.desc}}</p>
            </a>
        `).join('');
    }});
}}
''',

    'diagnostic': '''// {name}
(function() {{
    const content = {{
        interface: `
            <h2 class="text-2xl font-bold mb-6">Diagnose Your Problem</h2>
            <form id="diagForm" class="space-y-4">
                <div class="input-group">
                    <label>What's the symptom?</label>
                    <select id="symptom" required>
                        <option value="">Select...</option>
                        <option value="no-function">Not working</option>
                        <option value="noise">Making noise</option>
                        <option value="leak">Leaking</option>
                        <option value="smell">Strange smell</option>
                        <option value="performance">Poor performance</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>When did it start?</label>
                    <select id="timing">
                        <option value="sudden">Suddenly</option>
                        <option value="gradual">Gradually</option>
                        <option value="always">Always</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary w-full">Diagnose</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Troubleshooting Guide</h2>
            <div class="danger-box mb-6">
                <h4 class="font-bold">⚠️ Safety First</h4>
                <p>Turn off power/water before repairs. Call professionals for complex issues.</p>
            </div>
            <h3 class="text-2xl font-bold mb-3">Common Causes</h3>
            <ul class="list-disc pl-6 space-y-2">
                <li>Wear and tear</li>
                <li>Clogs or blockages</li>
                <li>Loose connections</li>
                <li>Failed components</li>
            </ul>
        `
    }};

    const solutions = {{
        'no-function': {{ title: 'Not Working', checks: ['Check power supply', 'Test circuit breaker', 'Verify switches'] }},
        'noise': {{ title: 'Making Noise', checks: ['Check for loose parts', 'Inspect bearings', 'Look for debris'] }},
        'leak': {{ title: 'Leaking', checks: ['Find leak source', 'Check connections', 'Inspect seals'] }},
        'smell': {{ title: 'Strange Smell', checks: ['Check for burning', 'Inspect for mold', 'Clean drains'] }},
        'performance': {{ title: 'Poor Performance', checks: ['Clean filters', 'Check for clogs', 'Verify settings'] }}
    }};

    function diagnose(e) {{
        e.preventDefault();
        const symptom = document.getElementById('symptom').value;
        if (!symptom) return;
        
        const solution = solutions[symptom];
        document.getElementById('result').className = 'tool-card mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-2xl font-bold mb-4">${{solution.title}}</h3>
            <h4 class="font-bold mb-3">Diagnostic Checklist:</h4>
            <div class="space-y-2">
                ${{solution.checks.map((check, i) => `
                    <label class="flex gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input type="checkbox">
                        <span>${{i + 1}}. ${{check}}</span>
                    </label>
                `).join('')}}
            </div>
        `;
    }}

    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('diagForm').addEventListener('submit', diagnose);
    loadRelatedTools('{category}');
}})();

function loadRelatedTools(category) {{
    fetch('../tools-data.json').then(r => r.json()).then(tools => {{
        const related = tools.filter(t => t.category === category).slice(0, 3);
        document.getElementById('relatedTools').innerHTML = related.map(t => `
            <a href="${{t.slug}}.html" class="tool-card block">
                <div class="text-3xl mb-2">${{t.icon}}</div>
                <h4 class="font-bold">${{t.name}}</h4>
                <p class="text-sm text-gray-600">${{t.desc}}</p>
            </a>
        `).join('');
    }});
}}
''',

    'utility': '''// {name}
(function() {{
    const content = {{
        interface: `
            <h2 class="text-2xl font-bold mb-6">Use This Tool</h2>
            <form id="utilityForm" class="space-y-4">
                <div class="input-group">
                    <label>Input Value</label>
                    <input type="number" id="input1" step="0.1" required>
                </div>
                <div class="input-group">
                    <label>Options</label>
                    <select id="option1">
                        <option value="standard">Standard</option>
                        <option value="advanced">Advanced</option>
                        <option value="professional">Professional</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary w-full">Calculate</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">How to Use This Tool</h2>
            <div class="pro-tip mb-6">
                <h4 class="font-bold">💡 Pro Tip</h4>
                <p>Quick estimates for planning. Verify with professionals for critical projects.</p>
            </div>
            <h3 class="text-2xl font-bold mb-3">Best Practices</h3>
            <ul class="list-disc pl-6 space-y-2">
                <li>Double-check measurements</li>
                <li>Factor safety margins</li>
                <li>Consult professionals</li>
            </ul>
        `
    }};

    function calculate(e) {{
        e.preventDefault();
        const input = parseFloat(document.getElementById('input1').value);
        const option = document.getElementById('option1').value;
        const mult = {{ standard: 1.0, advanced: 1.25, professional: 1.5 }};
        const result = input * mult[option];
        
        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-3xl font-bold mb-4">Result: ${{result.toFixed(2)}}</h3>
            <p>Based on ${{option}} calculation</p>
        `;
    }}

    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('utilityForm').addEventListener('submit', calculate);
    loadRelatedTools('{category}');
}})();

function loadRelatedTools(category) {{
    fetch('../tools-data.json').then(r => r.json()).then(tools => {{
        const related = tools.filter(t => t.category === category).slice(0, 3);
        document.getElementById('relatedTools').innerHTML = related.map(t => `
            <a href="${{t.slug}}.html" class="tool-card block">
                <div class="text-3xl mb-2">${{t.icon}}</div>
                <h4 class="font-bold">${{t.name}}</h4>
                <p class="text-sm text-gray-600">${{t.desc}}</p>
            </a>
        `).join('');
    }});
}}
'''
}

print("Generating JavaScript files for all 50 tools...")
print()

for tool in tools:
    template = templates.get(tool['category'], templates['utility'])
    js_content = template.format(
        name=tool['name'],
        category=tool['category']
    )
    
    filepath = os.path.join(TOOLS_DIR, f"{tool['slug']}.js")
    with open(filepath, 'w') as f:
        f.write(js_content)
    
    print(f"✓ Created {tool['slug']}.js")

print()
print(f"✅ Generated JavaScript for all {len(tools)} tools!")
