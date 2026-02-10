#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const guidesDir = path.join(__dirname, 'site', 'guides');
if (!fs.existsSync(guidesDir)) {
  fs.mkdirSync(guidesDir, { recursive: true });
}

const guides = [
  {
    id: 'fix-leaky-faucet',
    title: 'How to Fix a Leaky Faucet',
    description: 'Stop that annoying drip and save water with this simple repair guide.',
    difficulty: 'Easy',
    time: '30-45 minutes',
    cost: '$10-30',
    tools: ['Adjustable wrench', 'Screwdrivers (flathead & Phillips)', 'Replacement washers/O-rings', 'Plumber\'s grease', 'Towel'],
    steps: [
      { title: 'Turn Off Water Supply', content: 'Locate the shut-off valves under the sink and turn them clockwise to close. Turn on the faucet to drain remaining water.' },
      { title: 'Remove the Handle', content: 'Remove the decorative cap on top of the handle, then unscrew the handle screw. Pull the handle straight up to remove.' },
      { title: 'Disassemble the Faucet', content: 'Use an adjustable wrench to unscrew the packing nut. Remove the valve stem by turning it counterclockwise.' },
      { title: 'Inspect and Replace Washers', content: 'Check the rubber washer and O-ring at the bottom of the valve stem. If worn or damaged, replace them with exact matches.' },
      { title: 'Reassemble the Faucet', content: 'Apply plumber\'s grease to the new washers. Reassemble in reverse order, being careful not to overtighten.' },
      { title: 'Test the Repair', content: 'Turn the water supply back on slowly. Test the faucet for leaks. If still dripping, the valve seat may need resurfacing.' }
    ],
    tips: [
      'Take photos during disassembly to help with reassembly',
      'Bring old washers to hardware store for exact matches',
      'For ceramic disc faucets, clean the disc rather than replacing washers',
      'If valve seat is corroded, use a valve seat wrench to replace it'
    ],
    warnings: [
      'Always turn off water before starting',
      'Be gentle with old parts—they can break easily',
      'If you encounter corrosion or broken parts, consider calling a plumber'
    ]
  },
  {
    id: 'unclog-drain',
    title: 'How to Unclog a Drain',
    description: 'Clear stubborn clogs without calling a plumber using these proven methods.',
    difficulty: 'Easy',
    time: '15-30 minutes',
    cost: '$5-20',
    tools: ['Plunger', 'Drain snake/auger', 'Bucket', 'Rubber gloves', 'Baking soda & vinegar (optional)'],
    steps: [
      { title: 'Try Hot Water First', content: 'For minor clogs, boil water and pour it down the drain in stages. This can dissolve soap buildup and grease.' },
      { title: 'Use a Plunger', content: 'Fill the sink with enough water to cover the plunger cup. Create a tight seal and plunge vigorously 15-20 times.' },
      { title: 'Remove and Clean the P-Trap', content: 'Place a bucket under the P-trap (curved pipe under sink). Unscrew the slip nuts and remove the trap. Clear any debris.' },
      { title: 'Use a Drain Snake', content: 'If the clog is deeper, insert a drain snake into the drain pipe. Rotate while pushing forward to break up the clog.' },
      { title: 'Try Baking Soda & Vinegar', content: 'Pour 1/2 cup baking soda, then 1/2 cup vinegar down the drain. Wait 30 minutes, then flush with hot water.' },
      { title: 'Test the Drain', content: 'Run water to ensure the drain flows freely. If still slow, the clog may be in the main line—call a plumber.' }
    ],
    tips: [
      'Use a drain strainer to prevent future clogs',
      'Never mix chemical drain cleaners—dangerous fumes',
      'Monthly maintenance: flush with hot water and baking soda',
      'Avoid putting grease, coffee grounds, or hair down drains'
    ],
    warnings: [
      'Wear rubber gloves—drains are unsanitary',
      'Avoid chemical drain cleaners—they damage pipes and are toxic',
      'If water backs up in multiple drains, it\'s a main line issue—call a pro'
    ]
  },
  {
    id: 'patch-drywall',
    title: 'How to Patch Drywall Holes',
    description: 'Repair holes and cracks in drywall like a pro with our detailed guide.',
    difficulty: 'Medium',
    time: '1-2 hours (plus drying time)',
    cost: '$15-40',
    tools: ['Drywall patch kit or drywall piece', 'Joint compound (spackle)', 'Putty knife', 'Sandpaper (120-grit)', 'Primer & paint', 'Utility knife', 'Drywall saw (for large holes)'],
    steps: [
      { title: 'Assess the Damage', content: 'Small holes (under 1"): use spackle. Medium (1-4"): use a patch kit. Large (4"+): cut out damaged section and install new drywall.' },
      { title: 'Prepare the Area', content: 'Clean around the hole. For medium/large holes, cut away loose or damaged drywall to create a clean edge.' },
      { title: 'Apply the Patch', content: 'For small holes: fill with spackle. For medium: apply self-adhesive mesh patch, then cover with joint compound. For large: see next step.' },
      { title: 'For Large Holes: Install Backing', content: 'Cut a drywall piece slightly larger than the hole. Insert wood strips behind the hole edges as backing. Screw the patch to the backing.' },
      { title: 'Apply Joint Compound', content: 'Spread joint compound over the patch, feathering edges outward. Apply thin coats—3 coats total, allowing each to dry fully.' },
      { title: 'Sand, Prime, and Paint', content: 'Once dry, sand smooth with 120-grit paper. Wipe dust, apply primer, then paint to match the wall.' }
    ],
    tips: [
      'Feather edges wider than you think—it hides the repair better',
      'Use a damp sponge instead of sanding to minimize dust',
      'Apply thin coats of compound—thick coats crack',
      'Keep a piece of the paint for future touch-ups'
    ],
    warnings: [
      'Wear a dust mask when sanding',
      'Don\'t overtighten drywall screws—they\'ll punch through',
      'If hole is near electrical or plumbing, turn off power/water first'
    ]
  },
  {
    id: 'fix-running-toilet',
    title: 'How to Fix a Running Toilet',
    description: 'Stop water waste and high bills by fixing common running toilet problems.',
    difficulty: 'Easy',
    time: '30 minutes',
    cost: '$10-25',
    tools: ['Replacement flapper or fill valve', 'Adjustable wrench', 'Scissors', 'Towel'],
    steps: [
      { title: 'Diagnose the Problem', content: 'Remove the tank lid. Listen and look: is water trickling into the bowl (flapper issue) or constantly filling (fill valve issue)?' },
      { title: 'Check the Flapper', content: 'Flush and watch the flapper at the bottom of the tank. If it doesn\'t seal properly, it needs replacement. Check the chain for tangles.' },
      { title: 'Replace the Flapper', content: 'Turn off water supply. Flush to empty tank. Unhook old flapper from overflow tube. Install new flapper, ensuring the chain has slight slack.' },
      { title: 'Adjust the Float', content: 'If water level is too high, adjust the float. For ball floats: bend the arm down. For column floats: twist the adjustment screw.' },
      { title: 'Check the Fill Valve', content: 'If water keeps running after the tank fills, the fill valve may be faulty. Replace it by unscrewing the supply line and valve locknut.' },
      { title: 'Test the Repair', content: 'Turn water back on. Let tank fill. Flush and verify the toilet stops running within 30 seconds of refilling.' }
    ],
    tips: [
      'Take a photo of the setup before disassembly',
      'Bring your old flapper to the store for a perfect match',
      'Clean the valve seat before installing a new flapper',
      'Most repair kits include both flapper and fill valve—replace both if toilet is old'
    ],
    warnings: [
      'Always turn off the water supply before repairs',
      'A running toilet can waste 200+ gallons per day—fix it ASAP',
      'If replacing fill valve, make sure new one fits your toilet model'
    ]
  },
  {
    id: 'replace-light-switch',
    title: 'How to Replace a Light Switch',
    description: 'Safely replace a faulty light switch with proper electrical safety techniques.',
    difficulty: 'Medium',
    time: '30-45 minutes',
    cost: '$5-15',
    tools: ['Replacement light switch', 'Screwdrivers (flathead & Phillips)', 'Voltage tester', 'Wire strippers (if needed)', 'Electrical tape'],
    steps: [
      { title: 'Turn Off Power', content: 'Turn off the circuit breaker for the switch. Test the switch with a voltage tester to confirm power is off. NEVER skip this step.' },
      { title: 'Remove the Old Switch', content: 'Remove the cover plate, then unscrew the switch from the electrical box. Gently pull the switch out without touching wires.' },
      { title: 'Test for Power Again', content: 'Use your voltage tester on all wires to absolutely confirm no power is present. Safety first!' },
      { title: 'Disconnect the Wires', content: 'Note which wires go where (take a photo). Loosen terminal screws and disconnect wires. Typically: black (hot) wires to brass screws, white (neutral) to silver, green/bare (ground) to green screw.' },
      { title: 'Connect the New Switch', content: 'Attach wires to the new switch in the same configuration. Hot wires to brass terminals, neutral to silver, ground to green. Tighten screws firmly.' },
      { title: 'Install and Test', content: 'Carefully push wires into the box. Screw in the new switch. Install cover plate. Turn power back on. Test the switch.' }
    ],
    tips: [
      'Buy the same switch type (single-pole, 3-way, dimmer, etc.)',
      'Take a photo of wire connections before disconnecting',
      'Wrap electrical tape around screw terminals for extra safety',
      'If wires are damaged, cut back 1/2" and strip insulation'
    ],
    warnings: [
      'ALWAYS turn off power at the breaker—not just the switch',
      'ALWAYS test for power with a voltage tester before touching wires',
      'If you\'re uncomfortable with electrical work, hire an electrician',
      'If wires are aluminum (not copper), stop and call a pro—special handling required',
      'Never exceed the switch\'s amperage rating'
    ]
  }
];

function generateGuide(guide) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${guide.title} | GoFixr</title>
  <meta name="description" content="${guide.description}">
  <link rel="canonical" href="https://gofixr.com/guides/${guide.id}.html">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🔧</text></svg>">
  <style>
    .step-number {
      background: linear-gradient(135deg, #FF6B35 0%, #F44336 100%);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      flex-shrink: 0;
    }
  </style>
</head>
<body class="bg-gray-50 text-gray-900">
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"HowTo","name":"${guide.title}","description":"${guide.description}","totalTime":"PT${guide.time.split('-')[0].trim().replace(' minutes', 'M')}","estimatedCost":{"@type":"MonetaryAmount","currency":"USD","value":"${guide.cost.replace('$', '').split('-')[0]}"},"tool":${JSON.stringify(guide.tools.map(t => ({ "@type": "HowToTool", "name": t })))},"step":${JSON.stringify(guide.steps.map((s, i) => ({ "@type": "HowToStep", "position": i + 1, "name": s.title, "text": s.content })))}}</script>

  <nav class="bg-blue-900 text-white shadow-lg sticky top-0 z-50">
    <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
      <a href="/" class="text-2xl font-bold tracking-tight flex items-center gap-2">
        <span class="text-orange-400">🔧</span> GoFixr
      </a>
      <div class="hidden md:flex gap-6 text-sm font-medium">
        <a href="/" class="hover:text-orange-300 transition">Home</a>
        <a href="/tools/" class="hover:text-orange-300 transition">All Tools</a>
        <a href="/guides/" class="text-orange-300 transition">Guides</a>
        <a href="/about.html" class="hover:text-orange-300 transition">About</a>
      </div>
      <button onclick="document.getElementById('mobile-menu').classList.toggle('hidden')" class="md:hidden text-white">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
    </div>
    <div id="mobile-menu" class="hidden md:hidden px-4 pb-3 space-y-2 text-sm">
      <a href="/" class="block py-1 hover:text-orange-300">Home</a>
      <a href="/tools/" class="block py-1 hover:text-orange-300">All Tools</a>
      <a href="/guides/" class="block py-1 text-orange-300">Guides</a>
      <a href="/about.html" class="block py-1 hover:text-orange-300">About</a>
    </div>
  </nav>

  <main class="max-w-4xl mx-auto px-4 py-8">
    <nav class="text-sm text-gray-500 mb-6">
      <a href="/" class="hover:text-blue-700">Home</a> →
      <a href="/guides/" class="hover:text-blue-700">Guides</a> →
      <span class="text-gray-700">${guide.title}</span>
    </nav>

    <h1 class="text-3xl md:text-4xl font-bold mb-4">${guide.title}</h1>
    <p class="text-xl text-gray-600 mb-6">${guide.description}</p>

    <div class="flex flex-wrap gap-3 mb-8">
      <div class="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-semibold flex items-center gap-2">
        <span>⭐</span> ${guide.difficulty}
      </div>
      <div class="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-semibold flex items-center gap-2">
        <span>⏱️</span> ${guide.time}
      </div>
      <div class="bg-orange-100 text-orange-800 px-4 py-2 rounded-lg font-semibold flex items-center gap-2">
        <span>💰</span> ${guide.cost}
      </div>
    </div>

    <div class="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-200">
      <h2 class="text-xl font-bold mb-3 flex items-center gap-2">
        <span class="text-2xl">🛠️</span> Tools & Materials Needed
      </h2>
      <ul class="grid sm:grid-cols-2 gap-2">
        ${guide.tools.map(tool => `<li class="flex items-center gap-2"><span class="text-green-600">✓</span>${tool}</li>`).join('\n        ')}
      </ul>
    </div>

    ${guide.warnings.length > 0 ? `
    <div class="bg-red-50 border-l-4 border-red-500 p-6 mb-8">
      <h3 class="text-lg font-bold text-red-900 mb-3 flex items-center gap-2">
        <span class="text-2xl">⚠️</span> Safety Warnings
      </h3>
      <ul class="space-y-2">
        ${guide.warnings.map(warning => `<li class="text-red-900">• ${warning}</li>`).join('\n        ')}
      </ul>
    </div>
    ` : ''}

    <div class="mb-8">
      <h2 class="text-2xl font-bold mb-6">Step-by-Step Instructions</h2>
      <div class="space-y-6">
        ${guide.steps.map((step, index) => `
        <div class="flex gap-4">
          <div class="step-number">${index + 1}</div>
          <div class="flex-1">
            <h3 class="text-xl font-bold mb-2">${step.title}</h3>
            <p class="text-gray-700">${step.content}</p>
          </div>
        </div>
        `).join('\n')}
      </div>
    </div>

    <div class="bg-green-50 rounded-xl p-6 mb-8 border border-green-200">
      <h3 class="text-xl font-bold mb-3 flex items-center gap-2">
        <span class="text-2xl">💡</span> Pro Tips
      </h3>
      <ul class="space-y-2">
        ${guide.tips.map(tip => `<li class="flex gap-2"><span class="text-green-600 flex-shrink-0">✓</span><span>${tip}</span></li>`).join('\n        ')}
      </ul>
    </div>

    <div class="bg-orange-50 rounded-xl p-6 mb-8 border border-orange-200">
      <h3 class="text-xl font-bold mb-3 flex items-center gap-2">
        <span class="text-2xl">🤔</span> When to Call a Professional
      </h3>
      <p class="mb-3">Consider hiring a licensed professional if:</p>
      <ul class="space-y-2">
        <li class="flex gap-2"><span class="flex-shrink-0">•</span>You're uncomfortable with any part of this repair</li>
        <li class="flex gap-2"><span class="flex-shrink-0">•</span>The problem persists after attempting these fixes</li>
        <li class="flex gap-2"><span class="flex-shrink-0">•</span>You encounter unexpected damage or complications</li>
        <li class="flex gap-2"><span class="flex-shrink-0">•</span>Building permits or inspections may be required</li>
      </ul>
      <a href="#" class="inline-block mt-4 bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition">
        Find Local Pros →
      </a>
    </div>

    <div class="border-t border-gray-300 pt-8">
      <h3 class="text-xl font-bold mb-4">Related Resources</h3>
      <div class="grid sm:grid-cols-2 gap-4">
        <a href="/guides/" class="block p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition">
          <h4 class="font-bold mb-1">📚 More Repair Guides</h4>
          <p class="text-sm text-gray-600">Browse all our step-by-step repair guides</p>
        </a>
        <a href="/tools/" class="block p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition">
          <h4 class="font-bold mb-1">🔧 Calculators & Tools</h4>
          <p class="text-sm text-gray-600">Estimate costs and plan your projects</p>
        </a>
      </div>
    </div>
  </main>

  <footer class="bg-gray-900 text-gray-300 mt-16">
    <div class="max-w-6xl mx-auto px-4 py-12">
      <div class="grid md:grid-cols-4 gap-8 mb-8">
        <div>
          <h3 class="font-bold text-white mb-3 flex items-center gap-2"><span class="text-orange-400">🔧</span> GoFixr</h3>
          <p class="text-sm">Your trusted partner for home repair guidance, cost estimates, and DIY solutions.</p>
        </div>
        <div>
          <h4 class="font-semibold text-white mb-3">Popular Tools</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="/tools/paint-calculator.html" class="hover:text-orange-400">Paint Calculator</a></li>
            <li><a href="/tools/tile-calculator.html" class="hover:text-orange-400">Tile Calculator</a></li>
            <li><a href="/tools/diy-vs-hire.html" class="hover:text-orange-400">DIY vs Hire</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold text-white mb-3">Resources</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="/guides/" class="hover:text-orange-400">Repair Guides</a></li>
            <li><a href="/about.html" class="hover:text-orange-400">About Us</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold text-white mb-3">Legal</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="#" class="hover:text-orange-400">Privacy Policy</a></li>
            <li><a href="#" class="hover:text-orange-400">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      <div class="border-t border-gray-800 pt-8 text-sm text-center text-gray-500">
        <p>© 2026 GoFixr. All rights reserved.</p>
        <p class="mt-2 text-xs">⚠️ Always consult licensed professionals for electrical, gas, structural work, and when you're unsure.</p>
      </div>
    </div>
  </footer>
</body>
</html>`;
}

console.log('Generating guide pages...');
guides.forEach((guide, index) => {
  const html = generateGuide(guide);
  const filename = path.join(guidesDir, `${guide.id}.html`);
  fs.writeFileSync(filename, html);
  console.log(`✓ Generated ${index + 1}/5: ${guide.title}`);
});

console.log('\n✅ All guide pages generated successfully!');
