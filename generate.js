#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Tool definitions from RESEARCH.md
const tools = [
  // Cost Estimators (15)
  { id: 1, slug: 'bathroom-remodel-cost', name: 'Bathroom Remodel Cost Calculator', category: 'cost', icon: '🚿', desc: 'Estimate your bathroom renovation costs with detailed breakdowns for fixtures, labor, and materials.' },
  { id: 2, slug: 'kitchen-remodel-cost', name: 'Kitchen Remodel Cost Estimator', category: 'cost', icon: '🍳', desc: 'Calculate kitchen renovation costs including cabinets, countertops, appliances, and labor.' },
  { id: 3, slug: 'roof-replacement-cost', name: 'Roof Replacement Cost Calculator', category: 'cost', icon: '🏠', desc: 'Estimate roof replacement costs based on size, material type, and pitch complexity.' },
  { id: 4, slug: 'fence-installation-cost', name: 'Fence Installation Cost Calculator', category: 'cost', icon: '🏡', desc: 'Calculate fencing costs by material, length, height, and terrain difficulty.' },
  { id: 5, slug: 'deck-building-cost', name: 'Deck Building Cost Estimator', category: 'cost', icon: '🪵', desc: 'Estimate deck construction costs based on size, material, and design complexity.' },
  { id: 6, slug: 'painting-cost', name: 'Painting Cost Calculator', category: 'cost', icon: '🎨', desc: 'Calculate interior and exterior painting costs by square footage and number of coats.' },
  { id: 7, slug: 'flooring-cost', name: 'Flooring Cost Calculator', category: 'cost', icon: '📏', desc: 'Estimate flooring installation costs for hardwood, laminate, tile, carpet, and vinyl.' },
  { id: 8, slug: 'plumbing-repair-cost', name: 'Plumbing Repair Cost Estimator', category: 'cost', icon: '🔧', desc: 'Calculate costs for common plumbing repairs and installations.' },
  { id: 9, slug: 'electrical-work-cost', name: 'Electrical Work Cost Calculator', category: 'cost', icon: '⚡', desc: 'Estimate electrical repair and installation costs for various projects.' },
  { id: 10, slug: 'hvac-replacement-cost', name: 'HVAC Replacement Cost Estimator', category: 'cost', icon: '❄️', desc: 'Calculate HVAC system replacement costs by size, efficiency rating, and installation complexity.' },
  { id: 11, slug: 'window-replacement-cost', name: 'Window Replacement Cost Calculator', category: 'cost', icon: '🪟', desc: 'Estimate window replacement costs by type, size, and energy efficiency rating.' },
  { id: 12, slug: 'drywall-repair-cost', name: 'Drywall Repair Cost Calculator', category: 'cost', icon: '🧱', desc: 'Calculate drywall repair costs from small holes to full room replacement.' },
  { id: 13, slug: 'concrete-patio-cost', name: 'Concrete/Patio Cost Estimator', category: 'cost', icon: '🏗️', desc: 'Estimate concrete work costs for patios, driveways, and walkways.' },
  { id: 14, slug: 'garage-door-cost', name: 'Garage Door Replacement Cost Calculator', category: 'cost', icon: '🚪', desc: 'Calculate garage door replacement costs by type, size, and opener features.' },
  { id: 15, slug: 'siding-installation-cost', name: 'Siding Installation Cost Estimator', category: 'cost', icon: '🏘️', desc: 'Estimate siding installation costs by material, square footage, and home height.' },
  
  // DIY Planning Tools (15)
  { id: 16, slug: 'diy-vs-hire', name: 'DIY vs Hire a Pro Calculator', category: 'planning', icon: '🤔', desc: 'Determine whether to DIY or hire a professional based on cost, time, and skill requirements.' },
  { id: 17, slug: 'paint-calculator', name: 'Paint Calculator', category: 'planning', icon: '🖌️', desc: 'Calculate exactly how much paint you need for any room or exterior project.' },
  { id: 18, slug: 'tile-calculator', name: 'Tile Calculator', category: 'planning', icon: '⬛', desc: 'Calculate the number of tiles needed including waste allowance.' },
  { id: 19, slug: 'mulch-calculator', name: 'Mulch Calculator', category: 'planning', icon: '🌱', desc: 'Calculate how much mulch you need for landscaping projects.' },
  { id: 20, slug: 'concrete-calculator', name: 'Concrete Calculator', category: 'planning', icon: '🏗️', desc: 'Calculate cubic yards of concrete needed for slabs, footings, and projects.' },
  { id: 21, slug: 'wallpaper-calculator', name: 'Wallpaper Calculator', category: 'planning', icon: '📄', desc: 'Calculate wallpaper rolls needed for your room with pattern matching.' },
  { id: 22, slug: 'lumber-calculator', name: 'Lumber Calculator', category: 'planning', icon: '🪵', desc: 'Calculate board feet and estimate lumber costs for framing and projects.' },
  { id: 23, slug: 'insulation-calculator', name: 'Insulation Calculator', category: 'planning', icon: '🧊', desc: 'Calculate insulation needed based on R-value requirements by climate zone.' },
  { id: 24, slug: 'grout-calculator', name: 'Grout Calculator', category: 'planning', icon: '⬜', desc: 'Calculate how much grout you need for tile installation projects.' },
  { id: 25, slug: 'stain-sealer-calculator', name: 'Stain & Sealer Calculator', category: 'planning', icon: '🎨', desc: 'Calculate stain and sealer quantities for deck and fence projects.' },
  { id: 26, slug: 'maintenance-schedule', name: 'Home Maintenance Schedule Generator', category: 'planning', icon: '📅', desc: 'Generate a personalized maintenance schedule based on your home features.' },
  { id: 27, slug: 'project-timeline', name: 'Project Timeline Estimator', category: 'planning', icon: '⏱️', desc: 'Estimate realistic timelines for home improvement projects.' },
  { id: 28, slug: 'repair-priority', name: 'Home Repair Priority Planner', category: 'planning', icon: '📋', desc: 'Prioritize repairs based on urgency, cost, and impact on home value.' },
  { id: 29, slug: 'emergency-checklist', name: 'Emergency Repair Checklist Generator', category: 'planning', icon: '🚨', desc: 'Create emergency repair checklists for common home disasters.' },
  { id: 30, slug: 'seasonal-maintenance', name: 'Seasonal Home Maintenance Checklist', category: 'planning', icon: '🍂', desc: 'Get seasonal maintenance tasks for spring, summer, fall, and winter.' },
  
  // Diagnostic Tools (10)
  { id: 31, slug: 'toilet-troubleshooter', name: 'Toilet Troubleshooter', category: 'diagnostic', icon: '🚽', desc: 'Diagnose toilet problems by symptoms and get step-by-step fix instructions.' },
  { id: 32, slug: 'hvac-diagnoser', name: 'HVAC Problem Diagnoser', category: 'diagnostic', icon: '🌡️', desc: 'Troubleshoot heating and cooling issues with guided diagnostics.' },
  { id: 33, slug: 'water-heater-troubleshooter', name: 'Water Heater Troubleshooter', category: 'diagnostic', icon: '♨️', desc: 'Diagnose water heater problems and determine if DIY fixes are possible.' },
  { id: 34, slug: 'garbage-disposal-fix', name: 'Garbage Disposal Fix Finder', category: 'diagnostic', icon: '🗑️', desc: 'Troubleshoot garbage disposal issues and find quick fixes.' },
  { id: 35, slug: 'electrical-diagnoser', name: 'Electrical Problem Diagnoser', category: 'diagnostic', icon: '💡', desc: 'Diagnose common electrical issues with circuit breakers and outlets.' },
  { id: 36, slug: 'appliance-error-codes', name: 'Appliance Error Code Lookup', category: 'diagnostic', icon: '🔍', desc: 'Decode error codes from major appliance brands and find solutions.' },
  { id: 37, slug: 'roof-leak-locator', name: 'Roof Leak Locator Guide', category: 'diagnostic', icon: '💧', desc: 'Interactive guide to locate and diagnose roof leaks.' },
  { id: 38, slug: 'plumbing-noise-identifier', name: 'Plumbing Noise Identifier', category: 'diagnostic', icon: '🔊', desc: 'Identify plumbing noises and determine what they mean.' },
  { id: 39, slug: 'mold-risk-assessment', name: 'Mold Risk Assessment Tool', category: 'diagnostic', icon: '🦠', desc: 'Assess mold risk and get remediation recommendations.' },
  { id: 40, slug: 'foundation-crack-evaluator', name: 'Foundation Crack Evaluator', category: 'diagnostic', icon: '🏚️', desc: 'Evaluate foundation cracks for severity and urgency.' },
  
  // Utility Tools (10 - expanded from 5)
  { id: 41, slug: 'energy-savings-calculator', name: 'Energy Savings Calculator', category: 'utility', icon: '💰', desc: 'Calculate ROI on energy-efficient upgrades like insulation and windows.' },
  { id: 42, slug: 'home-value-impact', name: 'Home Value Impact Calculator', category: 'utility', icon: '📈', desc: 'Estimate which repairs and upgrades add the most value to your home.' },
  { id: 43, slug: 'tool-finder-quiz', name: 'Tool Finder Quiz', category: 'utility', icon: '🔨', desc: 'Find out which tools you need for your project with our interactive quiz.' },
  { id: 44, slug: 'contractor-comparison', name: 'Contractor Comparison Checklist', category: 'utility', icon: '✅', desc: 'Compare contractor quotes with our printable comparison checklist.' },
  { id: 45, slug: 'btu-calculator', name: 'BTU Calculator', category: 'utility', icon: '🌡️', desc: 'Calculate the right BTU size for air conditioners and heaters.' },
  { id: 46, slug: 'ladder-height-calculator', name: 'Ladder Height Calculator', category: 'utility', icon: '🪜', desc: 'Determine the correct ladder height needed for your project safely.' },
  { id: 47, slug: 'room-measurement-guide', name: 'Room Measurement Guide', category: 'utility', icon: '📐', desc: 'Calculate room dimensions and convert between measurement units.' },
  { id: 48, slug: 'load-calculator', name: 'Structural Load Calculator', category: 'utility', icon: '⚖️', desc: 'Estimate load-bearing requirements for shelving and storage projects.' },
  { id: 49, slug: 'color-visualizer', name: 'Paint Color Visualizer', category: 'utility', icon: '🎨', desc: 'Preview paint colors and get complementary color suggestions.' },
  { id: 50, slug: 'material-cost-comparison', name: 'Material Cost Comparison Tool', category: 'utility', icon: '💵', desc: 'Compare costs between different materials for your project.' },
];

// HTML template for tool pages
function generateToolHTML(tool) {
  const catColors = {
    cost: 'cat-cost',
    planning: 'cat-planning',
    diagnostic: 'cat-diagnostic',
    utility: 'cat-utility'
  };

  const catNames = {
    cost: 'Cost Estimator',
    planning: 'Planning Tool',
    diagnostic: 'Diagnostic Tool',
    utility: 'Utility Tool'
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${tool.name} | GoFixr - Home Repair Tools</title>
    <meta name="description" content="${tool.desc}">
    <meta property="og:title" content="${tool.name}">
    <meta property="og:description" content="${tool.desc}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://gofixr.com/tools/${tool.slug}.html">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">
    <link rel="stylesheet" href="../assets/css/style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
</head>
<body>
    <!-- Navigation -->
    <nav class="bg-brand-blue text-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <div class="flex items-center">
                    <a href="../index.html" class="text-2xl font-bold brand-orange">GoFixr</a>
                </div>
                <div class="hidden md:flex space-x-1">
                    <a href="../index.html" class="nav-link">Home</a>
                    <a href="../index.html#tools" class="nav-link">Tools</a>
                    <a href="../guides.html" class="nav-link">Guides</a>
                    <a href="../about.html" class="nav-link">About</a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <!-- Breadcrumb -->
        <div class="text-sm mb-6 text-gray-600">
            <a href="../index.html" class="hover:text-orange-600">Home</a> / 
            <a href="../index.html#tools" class="hover:text-orange-600">Tools</a> / 
            <span class="text-gray-900">${tool.name}</span>
        </div>

        <!-- Header -->
        <div class="mb-8">
            <div class="flex items-center gap-3 mb-3">
                <span class="text-5xl">${tool.icon}</span>
                <div>
                    <span class="category-badge ${catColors[tool.category]}">${catNames[tool.category]}</span>
                    <h1 class="text-4xl font-bold text-gray-900 mt-2">${tool.name}</h1>
                </div>
            </div>
            <p class="text-lg text-gray-700">${tool.desc}</p>
        </div>

        <!-- Tool Interface -->
        <div class="tool-card mb-8">
            <div id="toolInterface"></div>
        </div>

        <!-- Educational Content -->
        <div class="prose max-w-none">
            <div id="educationalContent"></div>
        </div>

        <!-- Related Tools -->
        <div class="mt-12">
            <h3 class="text-2xl font-bold mb-4">Related Tools</h3>
            <div id="relatedTools" class="grid grid-cols-1 md:grid-cols-3 gap-4"></div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="bg-brand-blue text-white mt-16 py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 class="text-2xl font-bold brand-orange mb-4">GoFixr</h3>
                    <p class="text-sm text-gray-300">Your trusted home repair companion. DIY guidance, cost transparency, and expert advice.</p>
                </div>
                <div>
                    <h4 class="font-bold mb-3">Tools</h4>
                    <ul class="space-y-2 text-sm">
                        <li><a href="bathroom-remodel-cost.html" class="footer-link">Cost Calculators</a></li>
                        <li><a href="paint-calculator.html" class="footer-link">Planning Tools</a></li>
                        <li><a href="toilet-troubleshooter.html" class="footer-link">Troubleshooters</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-bold mb-3">Resources</h4>
                    <ul class="space-y-2 text-sm">
                        <li><a href="../guides.html" class="footer-link">Repair Guides</a></li>
                        <li><a href="../about.html" class="footer-link">About Us</a></li>
                        <li><a href="../contact.html" class="footer-link">Contact</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-bold mb-3">Legal</h4>
                    <ul class="space-y-2 text-sm">
                        <li><a href="../privacy.html" class="footer-link">Privacy Policy</a></li>
                        <li><a href="../terms.html" class="footer-link">Terms of Use</a></li>
                        <li><a href="../disclaimer.html" class="footer-link">Disclaimer</a></li>
                    </ul>
                </div>
            </div>
            <div class="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
                <p>&copy; 2026 GoFixr.com - All rights reserved. Always consult a licensed professional for complex repairs.</p>
            </div>
        </div>
    </footer>

    <script src="../assets/js/tools/${tool.slug}.js"></script>
</body>
</html>`;
}

// Generate all tool pages
console.log('Generating GoFixr tool pages...\n');

tools.forEach(tool => {
  const html = generateToolHTML(tool);
  const filename = path.join(__dirname, 'tools', `${tool.slug}.html`);
  fs.writeFileSync(filename, html);
  console.log(`✓ Created ${tool.slug}.html`);
});

console.log(`\n✅ Generated ${tools.length} tool pages successfully!`);
console.log('\nNext: Generate JavaScript files for each tool...');

// Export tools data for use in index.html
fs.writeFileSync(
  path.join(__dirname, 'tools-data.json'),
  JSON.stringify(tools, null, 2)
);
console.log('✓ Created tools-data.json');
