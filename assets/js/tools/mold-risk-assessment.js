// Mold Risk Assessment
(function() {
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Mold Risk Assessment</h2>
            <form id="diagForm" class="space-y-4">
                <div class="input-group">
                    <label>Where is the issue?</label>
                    <select id="symptom" required>
                        <option value="">Select location...</option>
                        <option value="bathroom">Bathroom (shower, ceiling)</option>
                        <option value="basement">Basement or crawl space</option>
                        <option value="attic">Attic</option>
                        <option value="kitchen">Kitchen</option>
                        <option value="windows">Around windows</option>
                        <option value="after-leak">After a water leak or flood</option>
                        <option value="hvac">HVAC ducts or vents</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>What do you see/smell?</label>
                    <select id="timing">
                        <option value="visible">Visible mold growth</option>
                        <option value="smell">Musty smell, no visible mold</option>
                        <option value="stains">Water stains or discoloration</option>
                        <option value="condensation">Frequent condensation</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary w-full">Assess Risk</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Mold Prevention & Remediation Guide</h2>
            <div class="danger-box mb-6">
                <h4 class="font-bold">⚠️ Health Warning</h4>
                <p>Mold exposure can cause respiratory issues, allergies, and health problems. If you have extensive mold (over 10 sq ft), underlying health conditions, or black mold, hire a professional remediation company.</p>
            </div>
            <h3 class="text-2xl font-bold mb-3">What Mold Needs to Grow</h3>
            <ul class="list-disc pl-6 space-y-2 mb-6">
                <li><strong>Moisture:</strong> The #1 factor. Mold needs humidity above 60% or persistent dampness</li>
                <li><strong>Organic material:</strong> Wood, drywall, paper, fabric, dust</li>
                <li><strong>Time:</strong> Mold can start growing within 24–48 hours of water exposure</li>
                <li><strong>Warmth:</strong> 60–80°F is ideal for mold (unfortunately, this is also comfortable for humans)</li>
            </ul>
            <h3 class="text-2xl font-bold mb-3">Prevention Is Key</h3>
            <ul class="list-disc pl-6 space-y-2">
                <li>Keep indoor humidity below 50% (use a dehumidifier if needed)</li>
                <li>Fix leaks immediately — roof, plumbing, windows</li>
                <li>Ventilate bathrooms and kitchens (exhaust fans, open windows)</li>
                <li>Clean and dry any water damage within 24–48 hours</li>
            </ul>
        `
    };

    const solutions = {
        'bathroom': {
            title: 'Bathroom Mold',
            risk: 'COMMON & MANAGEABLE',
            checks: [
                'Bathroom mold thrives on moisture from showers and poor ventilation',
                'Surface mold on tile grout, caulk, and walls can be cleaned with a bleach solution (1 cup bleach per gallon water)',
                'Scrub with a brush, rinse, and dry thoroughly. Wear gloves and eye protection; ventilate well',
                'Run the exhaust fan during and for 20–30 minutes after every shower',
                'If you don\'t have an exhaust fan, install one (or at minimum, crack a window)',
                'Replace moldy caulk — old caulk is porous and can\'t be cleaned effectively. Re-caulk with mold-resistant caulk',
                'Keep humidity below 50% — a small dehumidifier or better ventilation helps',
                'Squeegee shower walls after use to remove standing water'
            ]
        },
        'basement': {
            title: 'Basement/Crawl Space Mold',
            risk: 'MODERATE TO HIGH RISK',
            checks: [
                'Basements are prone to mold due to high humidity, poor ventilation, and water intrusion',
                'Measure humidity with a hygrometer — if over 60%, use a dehumidifier (set to 50% or lower)',
                'Check for water entry: inspect walls after heavy rain, look for efflorescence (white mineral deposits)',
                'Improve exterior drainage: gutters clean, downspouts extended 4+ feet from foundation, soil graded away',
                'Seal basement walls with waterproof paint or membrane if moisture persists',
                'For crawl spaces: install a vapor barrier (6-mil plastic sheeting), ensure proper ventilation, consider encapsulation',
                'Remove moldy materials: porous items like cardboard, fabric, drywall often can\'t be salvaged',
                'If mold covers more than 10 sq ft, hire a professional remediation company ($500–$6,000 depending on extent)'
            ]
        },
        'attic': {
            title: 'Attic Mold',
            risk: 'MODERATE RISK — Often Structural',
            checks: [
                'Attic mold usually results from roof leaks or condensation due to poor ventilation',
                'Check for roof leaks: water stains, daylight showing through, damaged shingles',
                'Ensure proper attic ventilation: soffit vents + ridge vent or gable vents. Rule of thumb: 1 sq ft of ventilation per 150 sq ft of attic',
                'Check that bathroom and kitchen exhaust fans vent OUTSIDE, not into the attic',
                'Seal air leaks from the house into the attic (around light fixtures, plumbing penetrations) — these add moisture',
                'Improve insulation to prevent warm air from contacting cold roof sheathing and condensing',
                'For mold on wood sheathing or rafters, scrub with a borax solution (safer than bleach on wood)',
                'If mold is extensive (black patches on sheathing), hire a professional — may indicate chronic moisture problem'
            ]
        },
        'kitchen': {
            title: 'Kitchen Mold',
            risk: 'MODERATE RISK',
            checks: [
                'Kitchen mold is often near sinks, dishwashers, or under-sink cabinets from leaks',
                'Check under the sink for active leaks or past water damage — repair any plumbing issues',
                'Inspect the dishwasher door gasket and drain area — clean and dry regularly',
                'Run the range hood or open a window when cooking to vent moisture',
                'Clean refrigerator drip pans regularly — these can grow mold if neglected',
                'Fix any plumbing leaks immediately — even a slow drip can cause mold within days',
                'Discard moldy food and clean the refrigerator/pantry with vinegar solution',
                'For persistent under-cabinet mold, the cabinet floor may need to be replaced if the wood has absorbed water'
            ]
        },
        'windows': {
            title: 'Mold Around Windows',
            risk: 'LOW TO MODERATE RISK',
            checks: [
                'Window mold is usually caused by condensation on cold glass in winter',
                'Lower indoor humidity to below 50% — use a dehumidifier or improve ventilation',
                'Increase air circulation near windows — don\'t block with heavy curtains in winter',
                'Upgrade to double-pane windows if you have single-pane — this reduces condensation significantly',
                'Clean mold off window frames and sills with a vinegar or bleach solution',
                'Check the window flashing and caulking outside — leaks can cause mold in walls',
                'Use a space heater or fan to keep air moving near problem windows',
                'Consider a window insulation kit (shrink film) for winter months to reduce condensation'
            ]
        },
        'after-leak': {
            title: 'After Water Leak/Flood',
            risk: 'HIGH RISK — Act Fast!',
            checks: [
                'Time is critical — mold can begin growing within 24–48 hours of water exposure',
                'Remove standing water immediately with a wet/dry vacuum or pump',
                'Dry the area thoroughly with fans, dehumidifiers, and open windows (if weather permits)',
                'Remove and discard porous materials that stayed wet for over 48 hours: drywall, insulation, carpet padding, upholstered furniture',
                'Hard surfaces (tile, hardwood, metal) can usually be cleaned and salvaged if dried quickly',
                'Use HEPA air scrubbers if you suspect mold has already started (rent from equipment rental stores)',
                'Monitor humidity — keep below 50% during drying and for weeks after',
                'If the leak was sewage or the area is large (over 10 sq ft), hire a professional water damage restoration company immediately'
            ]
        },
        'hvac': {
            title: 'Mold in HVAC Ducts or Vents',
            risk: 'MODERATE TO HIGH — Can Spread',
            checks: [
                'HVAC mold spreads spores throughout the house whenever the system runs',
                'Inspect visible ductwork and supply vents for visible mold or musty smell',
                'Change the HVAC filter immediately — use a MERV 11+ filter to capture mold spores',
                'Check the drip pan under the AC evaporator coil — standing water here grows mold. Clean and ensure it drains properly',
                'Have ducts professionally cleaned if mold is visible inside ($300–$500 for whole house)',
                'Consider installing a UV light near the evaporator coil — this kills mold and bacteria ($300–600 installed)',
                'Ensure the AC condensate drain line is clear — a clogged drain causes overflow and mold',
                'Fix any duct leaks — they allow humid air from unconditioned spaces into the ducts'
            ]
        }
    };

    function diagnose(e) {
        e.preventDefault();
        const symptom = document.getElementById('symptom').value;
        if (!symptom) return;
        
        const solution = solutions[symptom];
        document.getElementById('result').className = 'tool-card mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-2xl font-bold mb-4">🔬 ${solution.title}</h3>
            <div class="bg-orange-50 p-3 rounded-lg mb-4">
                <strong>Risk Level:</strong> ${solution.risk}
            </div>
            <h4 class="font-bold mb-3">Assessment & Action Steps:</h4>
            <div class="space-y-2">
                ${solution.checks.map((check, i) => `
                    <label class="flex gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input type="checkbox">
                        <span>${i + 1}. ${check}</span>
                    </label>
                `).join('')}
            </div>
            <div class="mt-4 p-3 bg-red-50 rounded-lg text-sm">
                <strong>⚠️ When to Call a Professional:</strong> Mold covering over 10 sq ft, black mold (Stachybotrys), mold in HVAC system, after sewage backup, or if you have health concerns.
            </div>
        `;
    }

    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('diagForm').addEventListener('submit', diagnose);
    loadRelatedTools('diagnostic');
})();
