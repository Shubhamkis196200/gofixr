#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Define all 50 tools
const tools = [
  // Cost Estimators (1-15)
  { id: 'bathroom-remodel-cost', name: 'Bathroom Remodel Cost Calculator', category: 'Cost Estimators', icon: '🛁', color: 'blue', description: 'Estimate the total cost of your bathroom renovation project based on size, fixtures, and finishes.' },
  { id: 'kitchen-remodel-cost', name: 'Kitchen Remodel Cost Estimator', category: 'Cost Estimators', icon: '🍳', color: 'blue', description: 'Calculate kitchen renovation costs including cabinets, countertops, appliances, and labor.' },
  { id: 'roof-replacement-cost', name: 'Roof Replacement Cost Calculator', category: 'Cost Estimators', icon: '🏠', color: 'blue', description: 'Estimate roof replacement costs based on square footage, material type, and roof complexity.' },
  { id: 'fence-installation-cost', name: 'Fence Installation Cost Calculator', category: 'Cost Estimators', icon: '🪵', color: 'blue', description: 'Calculate fencing costs based on linear feet, material choice, and installation complexity.' },
  { id: 'deck-building-cost', name: 'Deck Building Cost Estimator', category: 'Cost Estimators', icon: '🏗️', color: 'blue', description: 'Estimate deck construction costs including materials, labor, and design complexity.' },
  { id: 'painting-cost', name: 'Painting Cost Calculator', category: 'Cost Estimators', icon: '🎨', color: 'blue', description: 'Calculate interior and exterior painting costs based on square footage and paint quality.' },
  { id: 'flooring-cost', name: 'Flooring Cost Calculator', category: 'Cost Estimators', icon: '🪵', color: 'blue', description: 'Estimate flooring installation costs for hardwood, tile, laminate, and carpet.' },
  { id: 'plumbing-repair-cost', name: 'Plumbing Repair Cost Estimator', category: 'Cost Estimators', icon: '🔧', color: 'blue', description: 'Calculate plumbing repair costs for common issues like leaks, clogs, and fixture replacements.' },
  { id: 'electrical-work-cost', name: 'Electrical Work Cost Calculator', category: 'Cost Estimators', icon: '⚡', color: 'blue', description: 'Estimate electrical project costs including outlets, panels, wiring, and lighting.' },
  { id: 'hvac-replacement-cost', name: 'HVAC Replacement Cost Estimator', category: 'Cost Estimators', icon: '❄️', color: 'blue', description: 'Calculate heating and cooling system replacement costs based on home size and efficiency.' },
  { id: 'window-replacement-cost', name: 'Window Replacement Cost Calculator', category: 'Cost Estimators', icon: '🪟', color: 'blue', description: 'Estimate window replacement costs based on window type, size, and energy efficiency.' },
  { id: 'drywall-repair-cost', name: 'Drywall Repair Cost Calculator', category: 'Cost Estimators', icon: '🧱', color: 'blue', description: 'Calculate drywall repair costs for holes, cracks, and water damage.' },
  { id: 'concrete-patio-cost', name: 'Concrete/Patio Cost Estimator', category: 'Cost Estimators', icon: '🏗️', color: 'blue', description: 'Estimate concrete slab, patio, or driveway costs based on square footage and finish.' },
  { id: 'garage-door-replacement-cost', name: 'Garage Door Replacement Cost Calculator', category: 'Cost Estimators', icon: '🚪', color: 'blue', description: 'Calculate garage door replacement costs including door type, opener, and installation.' },
  { id: 'siding-installation-cost', name: 'Siding Installation Cost Estimator', category: 'Cost Estimators', icon: '🏡', color: 'blue', description: 'Estimate siding installation costs for vinyl, fiber cement, wood, and other materials.' },
  
  // DIY Planning & Decision Tools (16-30)
  { id: 'diy-vs-hire', name: 'DIY vs Hire a Pro Calculator', category: 'Planning Tools', icon: '🤔', color: 'orange', description: 'Determine whether to DIY or hire a professional based on skill, time, tools, and cost.' },
  { id: 'paint-calculator', name: 'Paint Calculator', category: 'Planning Tools', icon: '🎨', color: 'orange', description: 'Calculate how much paint you need for any room based on dimensions and coats.' },
  { id: 'tile-calculator', name: 'Tile Calculator', category: 'Planning Tools', icon: '◻️', color: 'orange', description: 'Determine how many tiles you need for floors, walls, or backsplashes with waste factor.' },
  { id: 'mulch-calculator', name: 'Mulch Calculator', category: 'Planning Tools', icon: '🌳', color: 'orange', description: 'Calculate mulch needed for landscaping based on area and desired depth.' },
  { id: 'concrete-calculator', name: 'Concrete Calculator', category: 'Planning Tools', icon: '🏗️', color: 'orange', description: 'Calculate cubic yards of concrete needed for slabs, footings, or countertops.' },
  { id: 'wallpaper-calculator', name: 'Wallpaper Calculator', category: 'Planning Tools', icon: '📐', color: 'orange', description: 'Determine how many rolls of wallpaper you need based on room dimensions and pattern repeat.' },
  { id: 'lumber-calculator', name: 'Lumber Calculator', category: 'Planning Tools', icon: '🪵', color: 'orange', description: 'Calculate board feet and estimate lumber costs for framing and carpentry projects.' },
  { id: 'insulation-calculator', name: 'Insulation Calculator', category: 'Planning Tools', icon: '🏠', color: 'orange', description: 'Determine R-value and insulation needed based on climate zone and area.' },
  { id: 'grout-calculator', name: 'Grout Calculator', category: 'Planning Tools', icon: '◻️', color: 'orange', description: 'Calculate grout needed for tile installation based on tile size and joint width.' },
  { id: 'stain-sealer-calculator', name: 'Stain & Sealer Calculator', category: 'Planning Tools', icon: '🪵', color: 'orange', description: 'Calculate stain and sealer quantities for decks, fences, and wood surfaces.' },
  { id: 'home-maintenance-schedule', name: 'Home Maintenance Schedule Generator', category: 'Planning Tools', icon: '📅', color: 'orange', description: 'Generate a personalized home maintenance schedule based on your home type and age.' },
  { id: 'project-timeline-estimator', name: 'Project Timeline Estimator', category: 'Planning Tools', icon: '⏱️', color: 'orange', description: 'Estimate project duration for common home improvement projects.' },
  { id: 'repair-priority-planner', name: 'Home Repair Priority Planner', category: 'Planning Tools', icon: '📋', color: 'orange', description: 'Prioritize home repairs based on urgency, safety, and cost-effectiveness.' },
  { id: 'emergency-repair-checklist', name: 'Emergency Repair Checklist Generator', category: 'Planning Tools', icon: '🚨', color: 'orange', description: 'Generate emergency repair checklists for different types of home emergencies.' },
  { id: 'seasonal-maintenance-checklist', name: 'Seasonal Home Maintenance Checklist', category: 'Planning Tools', icon: '🍂', color: 'orange', description: 'Get season-specific maintenance checklists to keep your home in top shape.' },
  
  // Diagnostic/Troubleshooting Tools (31-40)
  { id: 'toilet-troubleshooter', name: 'Toilet Troubleshooter', category: 'Troubleshooting', icon: '🚽', color: 'red', description: 'Diagnose common toilet problems and get step-by-step repair guidance.' },
  { id: 'hvac-problem-diagnoser', name: 'HVAC Problem Diagnoser', category: 'Troubleshooting', icon: '❄️', color: 'red', description: 'Identify HVAC issues by symptoms and determine if you need professional help.' },
  { id: 'water-heater-troubleshooter', name: 'Water Heater Troubleshooter', category: 'Troubleshooting', icon: '🔥', color: 'red', description: 'Diagnose water heater problems from no hot water to strange noises.' },
  { id: 'garbage-disposal-fix', name: 'Garbage Disposal Fix Finder', category: 'Troubleshooting', icon: '🗑️', color: 'red', description: 'Troubleshoot garbage disposal issues including jams, leaks, and noise.' },
  { id: 'electrical-problem-diagnoser', name: 'Electrical Problem Diagnoser', category: 'Troubleshooting', icon: '⚡', color: 'red', description: 'Diagnose electrical issues with outlets, switches, and circuit breakers safely.' },
  { id: 'appliance-error-codes', name: 'Appliance Error Code Lookup', category: 'Troubleshooting', icon: '📱', color: 'red', description: 'Look up error codes for common household appliances and get solutions.' },
  { id: 'roof-leak-locator', name: 'Roof Leak Locator Guide', category: 'Troubleshooting', icon: '💧', color: 'red', description: 'Identify the source of roof leaks with our interactive diagnostic guide.' },
  { id: 'plumbing-noise-identifier', name: 'Plumbing Noise Identifier', category: 'Troubleshooting', icon: '🔊', color: 'red', description: 'Identify plumbing problems by the sounds your pipes make.' },
  { id: 'mold-risk-assessment', name: 'Mold Risk Assessment Tool', category: 'Troubleshooting', icon: '🦠', color: 'red', description: 'Assess mold risk in your home and get remediation recommendations.' },
  { id: 'foundation-crack-evaluator', name: 'Foundation Crack Evaluator', category: 'Troubleshooting', icon: '🏚️', color: 'red', description: 'Evaluate foundation cracks to determine severity and repair urgency.' },
  
  // Utility/Comparison Tools (41-50)
  { id: 'energy-savings-calculator', name: 'Energy Savings Calculator', category: 'Utilities', icon: '💡', color: 'green', description: 'Calculate ROI on energy-efficient upgrades like windows, insulation, and HVAC.' },
  { id: 'home-value-impact', name: 'Home Value Impact Calculator', category: 'Utilities', icon: '📈', color: 'green', description: 'Estimate which repairs and upgrades add the most value to your home.' },
  { id: 'tool-finder-quiz', name: 'Tool Finder Quiz', category: 'Utilities', icon: '🔨', color: 'green', description: 'Discover which tools you need for your home repair projects.' },
  { id: 'contractor-comparison', name: 'Contractor Comparison Checklist', category: 'Utilities', icon: '👷', color: 'green', description: 'Compare contractors with our comprehensive evaluation checklist.' },
  { id: 'btu-calculator', name: 'BTU Calculator', category: 'Utilities', icon: '🌡️', color: 'green', description: 'Calculate the right BTU capacity for air conditioners and heaters.' },
  { id: 'dumpster-size-calculator', name: 'Dumpster Size Calculator', category: 'Utilities', icon: '🗑️', color: 'green', description: 'Determine the right dumpster size for your renovation or cleanup project.' },
  { id: 'electrical-load-calculator', name: 'Electrical Load Calculator', category: 'Utilities', icon: '⚡', color: 'green', description: 'Calculate electrical load to ensure your circuit can handle new appliances.' },
  { id: 'water-usage-calculator', name: 'Water Usage Calculator', category: 'Utilities', icon: '💧', color: 'green', description: 'Estimate water usage and potential savings from fixture upgrades.' },
  { id: 'gutter-size-calculator', name: 'Gutter Size Calculator', category: 'Utilities', icon: '🌧️', color: 'green', description: 'Calculate the right gutter size for your roof based on rainfall and area.' },
  { id: 'carpet-calculator', name: 'Carpet Calculator', category: 'Utilities', icon: '🧶', color: 'green', description: 'Calculate carpet needed for rooms including waste factor and padding.' }
];

// Create output directory
const siteDir = path.join(__dirname, 'site');
const toolsDir = path.join(siteDir, 'tools');
const guidesDir = path.join(siteDir, 'guides');

[siteDir, toolsDir, guidesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Color schemes
const colorSchemes = {
  blue: { primary: '#1B4965', light: '#E3F2FD', accent: '#2196F3' },
  orange: { primary: '#FF6B35', light: '#FFF3E0', accent: '#FF9800' },
  red: { primary: '#D64045', light: '#FFEBEE', accent: '#F44336' },
  green: { primary: '#2D936C', light: '#E8F5E9', accent: '#4CAF50' }
};

// Navigation HTML
const nav = `<nav class="bg-blue-900 text-white shadow-lg sticky top-0 z-50">
    <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
      <a href="/" class="text-2xl font-bold tracking-tight flex items-center gap-2">
        <span class="text-orange-400">🔧</span> GoFixr
      </a>
      <div class="hidden md:flex gap-6 text-sm font-medium">
        <a href="/" class="hover:text-orange-300 transition">Home</a>
        <a href="/tools/" class="hover:text-orange-300 transition">All Tools</a>
        <a href="/guides/" class="hover:text-orange-300 transition">Guides</a>
        <a href="/about.html" class="hover:text-orange-300 transition">About</a>
      </div>
      <button onclick="document.getElementById('mobile-menu').classList.toggle('hidden')" class="md:hidden text-white">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
    </div>
    <div id="mobile-menu" class="hidden md:hidden px-4 pb-3 space-y-2 text-sm">
      <a href="/" class="block py-1 hover:text-orange-300">Home</a>
      <a href="/tools/" class="block py-1 hover:text-orange-300">All Tools</a>
      <a href="/guides/" class="block py-1 hover:text-orange-300">Guides</a>
      <a href="/about.html" class="block py-1 hover:text-orange-300">About</a>
    </div>
  </nav>`;

// Footer HTML
const footer = `<footer class="bg-gray-900 text-gray-300 mt-16">
    <div class="max-w-6xl mx-auto px-4 py-12">
      <div class="grid md:grid-cols-4 gap-8 mb-8">
        <div>
          <h3 class="font-bold text-white mb-3 flex items-center gap-2"><span class="text-orange-400">🔧</span> GoFixr</h3>
          <p class="text-sm">Your trusted partner for home repair guidance, cost estimates, and DIY solutions.</p>
        </div>
        <div>
          <h4 class="font-semibold text-white mb-3">Tools</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="/tools/paint-calculator.html" class="hover:text-orange-400">Paint Calculator</a></li>
            <li><a href="/tools/tile-calculator.html" class="hover:text-orange-400">Tile Calculator</a></li>
            <li><a href="/tools/diy-vs-hire.html" class="hover:text-orange-400">DIY vs Hire</a></li>
            <li><a href="/tools/" class="hover:text-orange-400">View All Tools →</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold text-white mb-3">Resources</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="/guides/" class="hover:text-orange-400">Repair Guides</a></li>
            <li><a href="/about.html" class="hover:text-orange-400">About Us</a></li>
            <li><a href="#" class="hover:text-orange-400">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold text-white mb-3">Legal</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="#" class="hover:text-orange-400">Privacy Policy</a></li>
            <li><a href="#" class="hover:text-orange-400">Terms of Service</a></li>
            <li><a href="#" class="hover:text-orange-400">Disclaimer</a></li>
          </ul>
        </div>
      </div>
      <div class="border-t border-gray-800 pt-8 text-sm text-center text-gray-500">
        <p>© ${new Date().getFullYear()} GoFixr. All rights reserved. | Providing home repair guidance since 2026.</p>
        <p class="mt-2 text-xs">⚠️ Always consult licensed professionals for electrical, gas, structural work, and when you're unsure.</p>
      </div>
    </div>
  </footer>`;

// Generate tool page
function generateToolPage(tool) {
  const colors = colorSchemes[tool.color];
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${tool.name} | GoFixr</title>
  <meta name="description" content="${tool.description}">
  <meta name="keywords" content="${tool.name.toLowerCase()}, home repair calculator, home improvement estimator">
  <link rel="canonical" href="https://gofixr.com/tools/${tool.id}.html">
  <meta property="og:title" content="${tool.name} | GoFixr">
  <meta property="og:description" content="${tool.description}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://gofixr.com/tools/${tool.id}.html">
  <meta name="twitter:card" content="summary_large_image">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🔧</text></svg>">
  <style>
    .result-value { font-size: 1.5rem; font-weight: 700; color: ${colors.primary}; }
    .calc-card { background: linear-gradient(135deg, ${colors.light} 0%, #ffffff 100%); }
    input[type=number], input[type=text], select { -moz-appearance: textfield; }
    input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; }
  </style>
</head>
<body class="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"WebApplication","name":"${tool.name}","description":"${tool.description}","url":"https://gofixr.com/tools/${tool.id}.html","applicationCategory":"UtilityApplication","operatingSystem":"Web","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"}}</script>
  
  ${nav}

  <main class="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
    <nav class="text-sm text-gray-500 mb-6">
      <a href="/" class="hover:text-blue-700">Home</a> →
      <a href="/tools/" class="hover:text-blue-700">Tools</a> →
      <span class="text-gray-700">${tool.name}</span>
    </nav>

    <div class="mb-8">
      <span class="inline-block bg-${tool.color}-100 text-${tool.color}-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">${tool.icon} ${tool.category}</span>
      <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3">${tool.name}</h1>
      <p class="text-lg text-gray-600">${tool.description}</p>
    </div>

    <div class="calc-card rounded-2xl shadow-lg border border-${tool.color}-100 p-6 md:p-8 mb-8">
      <div id="calculator-form">
        ${generateCalculatorInputs(tool)}
      </div>
      <div id="results" class="mt-6 grid gap-4">
        ${generateResultsDisplay(tool)}
      </div>
    </div>

    <div class="prose max-w-none">
      ${generateEducationalContent(tool)}
    </div>

    <div class="mt-12 bg-orange-50 border border-orange-200 rounded-xl p-6">
      <h3 class="text-xl font-bold text-gray-900 mb-3">💡 Need Professional Help?</h3>
      <p class="text-gray-700 mb-4">While DIY can save money, some projects require professional expertise. Consider hiring a licensed contractor for complex, dangerous, or structural work.</p>
      <a href="#" class="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition">Find Local Pros →</a>
    </div>

    <div class="mt-8">
      <h3 class="text-xl font-bold mb-4">Related Tools</h3>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        ${generateRelatedTools(tool)}
      </div>
    </div>
  </main>

  ${footer}

  <script>
    ${generateCalculatorScript(tool)}
  </script>
</body>
</html>`;
}

function generateCalculatorInputs(tool) {
  // Simplified - generate basic inputs based on tool type
  if (tool.category === 'Cost Estimators') {
    return `
      <div class="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <label for="area" class="block text-sm font-medium text-gray-700 mb-1">Area (sq ft)</label>
          <input type="number" id="area" value="200" step="1" min="0"
            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${tool.color}-500 focus:border-${tool.color}-500 transition"
            oninput="calculate()">
        </div>
        <div>
          <label for="quality" class="block text-sm font-medium text-gray-700 mb-1">Quality Level</label>
          <select id="quality" class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${tool.color}-500 focus:border-${tool.color}-500 transition" onchange="calculate()">
            <option value="basic">Basic</option>
            <option value="mid" selected>Mid-Range</option>
            <option value="premium">Premium</option>
          </select>
        </div>
        <div>
          <label for="labor" class="block text-sm font-medium text-gray-700 mb-1">Include Labor?</label>
          <select id="labor" class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${tool.color}-500 focus:border-${tool.color}-500 transition" onchange="calculate()">
            <option value="yes" selected>Yes (Hire a Pro)</option>
            <option value="no">No (DIY)</option>
          </select>
        </div>
        <div>
          <label for="zipcode" class="block text-sm font-medium text-gray-700 mb-1">Zip Code (optional)</label>
          <input type="text" id="zipcode" placeholder="12345" maxlength="5"
            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${tool.color}-500 focus:border-${tool.color}-500 transition"
            oninput="calculate()">
        </div>
      </div>`;
  } else if (tool.category === 'Planning Tools') {
    return `
      <div class="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <label for="length" class="block text-sm font-medium text-gray-700 mb-1">Length (ft)</label>
          <input type="number" id="length" value="12" step="0.1" min="0"
            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${tool.color}-500 focus:border-${tool.color}-500 transition"
            oninput="calculate()">
        </div>
        <div>
          <label for="width" class="block text-sm font-medium text-gray-700 mb-1">Width (ft)</label>
          <input type="number" id="width" value="10" step="0.1" min="0"
            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${tool.color}-500 focus:border-${tool.color}-500 transition"
            oninput="calculate()">
        </div>
        <div>
          <label for="height" class="block text-sm font-medium text-gray-700 mb-1">Height (ft)</label>
          <input type="number" id="height" value="8" step="0.1" min="0"
            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${tool.color}-500 focus:border-${tool.color}-500 transition"
            oninput="calculate()">
        </div>
        <div>
          <label for="units" class="block text-sm font-medium text-gray-700 mb-1">Measurement Units</label>
          <select id="units" class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${tool.color}-500 focus:border-${tool.color}-500 transition" onchange="calculate()">
            <option value="feet">Feet</option>
            <option value="meters">Meters</option>
          </select>
        </div>
      </div>`;
  } else if (tool.category === 'Troubleshooting') {
    return `
      <div class="space-y-4 mb-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">What's the main problem?</label>
          <select id="problem" class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${tool.color}-500 focus:border-${tool.color}-500 transition" onchange="diagnose()">
            <option value="">Select a symptom...</option>
            <option value="leak">Leaking</option>
            <option value="noise">Strange noise</option>
            <option value="notworking">Not working at all</option>
            <option value="slow">Working slowly/weakly</option>
            <option value="smell">Unusual smell</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">When did it start?</label>
          <select id="timing" class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${tool.color}-500 focus:border-${tool.color}-500 transition">
            <option value="sudden">Suddenly</option>
            <option value="gradual">Gradually over time</option>
            <option value="intermittent">Comes and goes</option>
          </select>
        </div>
      </div>`;
  } else {
    return `
      <div class="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <label for="value1" class="block text-sm font-medium text-gray-700 mb-1">Primary Input</label>
          <input type="number" id="value1" value="100" step="1" min="0"
            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${tool.color}-500 focus:border-${tool.color}-500 transition"
            oninput="calculate()">
        </div>
        <div>
          <label for="value2" class="block text-sm font-medium text-gray-700 mb-1">Secondary Input</label>
          <input type="number" id="value2" value="50" step="1" min="0"
            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${tool.color}-500 focus:border-${tool.color}-500 transition"
            oninput="calculate()">
        </div>
      </div>`;
  }
}

function generateResultsDisplay(tool) {
  if (tool.category === 'Cost Estimators') {
    return `
      <div class="bg-white rounded-lg p-4 border border-${tool.color}-100">
        <p class="text-sm text-gray-500 mb-1">Estimated Total Cost</p>
        <p class="result-value"><span>$</span><span id="result-total">—</span></p>
      </div>
      <div class="bg-white rounded-lg p-4 border border-${tool.color}-100">
        <p class="text-sm text-gray-500 mb-1">Materials Cost</p>
        <p class="result-value"><span>$</span><span id="result-materials">—</span></p>
      </div>
      <div class="bg-white rounded-lg p-4 border border-${tool.color}-100">
        <p class="text-sm text-gray-500 mb-1">Labor Cost</p>
        <p class="result-value"><span>$</span><span id="result-labor">—</span></p>
      </div>`;
  } else if (tool.category === 'Troubleshooting') {
    return `
      <div id="diagnosis" class="bg-white rounded-lg p-6 border border-${tool.color}-100 hidden">
        <h3 class="font-bold text-lg mb-3">Diagnosis</h3>
        <div id="diagnosis-content"></div>
      </div>`;
  } else {
    return `
      <div class="bg-white rounded-lg p-4 border border-${tool.color}-100">
        <p class="text-sm text-gray-500 mb-1">Result</p>
        <p class="result-value"><span id="result-main">—</span></p>
      </div>`;
  }
}

function generateCalculatorScript(tool) {
  if (tool.category === 'Cost Estimators') {
    return `
    function calculate() {
      const area = parseFloat(document.getElementById('area').value) || 0;
      const quality = document.getElementById('quality').value;
      const includeLab or = document.getElementById('labor').value === 'yes';
      
      const qualityMultiplier = quality === 'basic' ? 0.7 : quality === 'premium' ? 1.5 : 1.0;
      const materialCost = area * 8 * qualityMultiplier;
      const laborCost = includeLab or ? area * 5 * qualityMultiplier : 0;
      const total = materialCost + laborCost;
      
      document.getElementById('result-total').textContent = total.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0});
      document.getElementById('result-materials').textContent = materialCost.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0});
      document.getElementById('result-labor').textContent = laborCost.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0});
    }
    calculate();`;
  } else if (tool.category === 'Planning Tools') {
    return `
    function calculate() {
      const length = parseFloat(document.getElementById('length').value) || 0;
      const width = parseFloat(document.getElementById('width').value) || 0;
      const height = parseFloat(document.getElementById('height').value) || 0;
      
      const area = length * width;
      const volume = length * width * height;
      
      document.getElementById('result-main').textContent = area.toFixed(1) + ' sq ft';
    }
    calculate();`;
  } else if (tool.category === 'Troubleshooting') {
    return `
    function diagnose() {
      const problem = document.getElementById('problem').value;
      const diagnosisDiv = document.getElementById('diagnosis');
      const contentDiv = document.getElementById('diagnosis-content');
      
      if (!problem) {
        diagnosisDiv.classList.add('hidden');
        return;
      }
      
      diagnosisDiv.classList.remove('hidden');
      
      const diagnoses = {
        leak: '<p class="mb-2"><strong>Likely Cause:</strong> Worn seal, loose connection, or cracked component.</p><p><strong>Quick Fix:</strong> Check all connections and tighten. If seal is worn, replacement is needed.</p><p class="mt-3 text-sm text-red-600">⚠️ If leak is severe, shut off water supply immediately.</p>',
        noise: '<p class="mb-2"><strong>Likely Cause:</strong> Loose parts, worn bearings, or debris in mechanism.</p><p><strong>Quick Fix:</strong> Check for loose screws or parts. Clear any visible debris.</p>',
        notworking: '<p class="mb-2"><strong>Likely Cause:</strong> Power supply issue, tripped breaker, or failed component.</p><p><strong>Quick Fix:</strong> Check circuit breaker, verify power connection, test with multimeter.</p><p class="mt-3 text-sm text-red-600">⚠️ If electrical, consider hiring a licensed electrician.</p>',
        slow: '<p class="mb-2"><strong>Likely Cause:</strong> Clog, restriction, or component degradation.</p><p><strong>Quick Fix:</strong> Check for blockages, clean filters, verify proper water/power supply.</p>',
        smell: '<p class="mb-2"><strong>Likely Cause:</strong> Mold, debris, or gas leak.</p><p><strong>Quick Fix:</strong> Clean thoroughly. If gas smell, evacuate and call utility company immediately.</p><p class="mt-3 text-sm text-red-600">⚠️ Gas smell = EMERGENCY. Leave home and call 911.</p>'
      };
      
      contentDiv.innerHTML = diagnoses[problem] || '<p>Select a symptom to get diagnosis.</p>';
    }`;
  } else {
    return `
    function calculate() {
      const val1 = parseFloat(document.getElementById('value1').value) || 0;
      const val2 = parseFloat(document.getElementById('value2').value) || 0;
      const result = val1 + val2;
      document.getElementById('result-main').textContent = result.toFixed(1);
    }
    calculate();`;
  }
}

function generateEducationalContent(tool) {
  return `
    <h2 class="text-2xl font-bold mb-4">How to Use This ${tool.name}</h2>
    <p class="mb-4">This calculator helps you estimate costs and plan your ${tool.name.toLowerCase()} project. Enter your project details above to get instant results.</p>
    
    <h3 class="text-xl font-bold mb-3">What Affects the Cost?</h3>
    <ul class="list-disc pl-6 mb-6 space-y-2">
      <li><strong>Project size:</strong> Larger projects cost more in materials and labor</li>
      <li><strong>Material quality:</strong> Premium materials significantly increase costs</li>
      <li><strong>Labor costs:</strong> Professional installation adds 40-60% to material costs</li>
      <li><strong>Location:</strong> Prices vary by region and local market rates</li>
      <li><strong>Complexity:</strong> Complex designs or difficult access increase labor time</li>
    </ul>

    <h3 class="text-xl font-bold mb-3">DIY vs. Hiring a Professional</h3>
    <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
      <p class="font-semibold mb-2">Consider hiring a professional if:</p>
      <ul class="list-disc pl-5 space-y-1 text-sm">
        <li>The project involves electrical, gas, or structural work</li>
        <li>You lack the necessary tools or experience</li>
        <li>Building permits are required</li>
        <li>The project could affect home safety or value</li>
      </ul>
    </div>

    <h3 class="text-xl font-bold mb-3">Money-Saving Tips</h3>
    <ul class="list-disc pl-6 mb-6 space-y-2">
      <li>Get 3-5 quotes from licensed contractors</li>
      <li>Schedule during off-season when contractors are less busy</li>
      <li>Buy materials yourself if contractor agrees</li>
      <li>Do the demo work yourself to save on labor</li>
      <li>Consider mid-range materials for best value</li>
    </ul>

    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
      <p class="text-sm"><strong>⚠️ Safety First:</strong> Always follow manufacturer instructions, wear proper safety gear, and know your limits. When in doubt, call a licensed professional.</p>
    </div>`;
}

function generateRelatedTools(tool) {
  const related = tools
    .filter(t => t.category === tool.category && t.id !== tool.id)
    .slice(0, 3)
    .map(t => `
      <a href="/tools/${t.id}.html" class="block p-4 bg-white rounded-lg border border-gray-200 hover:border-${t.color}-500 hover:shadow-md transition">
        <div class="flex items-center gap-3 mb-2">
          <span class="text-2xl">${t.icon}</span>
          <h4 class="font-semibold text-gray-900">${t.name}</h4>
        </div>
        <p class="text-sm text-gray-600">${t.description}</p>
      </a>
    `).join('');
  
  return related || '<p class="text-gray-500">No related tools found.</p>';
}

// Generate all tool pages
console.log('Generating 50 tool pages...');
tools.forEach((tool, index) => {
  const html = generateToolPage(tool);
  const filename = path.join(toolsDir, `${tool.id}.html`);
  fs.writeFileSync(filename, html);
  console.log(`✓ Generated ${index + 1}/50: ${tool.name}`);
});

console.log('\n✅ All 50 tool pages generated successfully!');
console.log('📁 Output directory:', toolsDir);
