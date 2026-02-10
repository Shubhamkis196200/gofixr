// Painting Cost Estimator — per-room breakdown with paint quality, prep, and surface calculations
(function() {
    const projectTypes = {
        room:     { name: 'Single Room', areaLabel: 'Wall Area (sq ft)', paintCov: 350, defaultArea: 400 },
        interior: { name: 'Whole Interior', areaLabel: 'Total Wall Area (sq ft)', paintCov: 350, defaultArea: 2500 },
        exterior: { name: 'House Exterior', areaLabel: 'Exterior Wall Area (sq ft)', paintCov: 300, defaultArea: 2000 },
        trim:     { name: 'Trim & Doors', areaLabel: 'Linear Feet of Trim', paintCov: 150, defaultArea: 200 },
        cabinet:  { name: 'Kitchen Cabinets', areaLabel: 'Number of Cabinet Doors', paintCov: 1, defaultArea: 30 }
    };
    const paintQuality = {
        economy:  { name: 'Economy ($20-30/gal)', price: 25, coats: 3, durability: '3-5 years' },
        mid:      { name: 'Mid-Grade ($35-50/gal)', price: 42, coats: 2, durability: '7-10 years' },
        premium:  { name: 'Premium ($50-80/gal)', price: 65, coats: 2, durability: '10-15 years' }
    };
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Painting Cost Estimator</h2>
            <form id="costForm" class="space-y-4">
                <div class="input-group"><label>Project Type</label>
                    <select id="projType"><option value="room">Single Room</option><option value="interior" selected>Whole Interior</option><option value="exterior">House Exterior</option><option value="trim">Trim & Doors Only</option><option value="cabinet">Kitchen Cabinets</option></select>
                </div>
                <div class="input-group"><label id="areaLabel">Total Wall Area (sq ft)</label>
                    <input type="number" id="area" min="10" value="2500" step="50" required>
                    <p class="text-xs text-gray-500 mt-1">Room wall area ≈ perimeter (ft) × ceiling height (ft) minus doors/windows</p>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="input-group"><label>Paint Quality</label>
                        <select id="quality"><option value="economy">Economy ($20-30/gal)</option><option value="mid" selected>Mid-Grade ($35-50/gal)</option><option value="premium">Premium ($50-80/gal)</option></select>
                    </div>
                    <div class="input-group"><label>Surface Condition</label>
                        <select id="condition"><option value="1.0">Good (minimal prep)</option><option value="1.2" selected>Average (some patching)</option><option value="1.5">Poor (scraping, priming)</option><option value="1.8">Major prep (lead/peeling)</option></select>
                    </div>
                </div>
                <div class="input-group"><label>DIY or Professional?</label>
                    <select id="labor"><option value="diy">DIY (materials only)</option><option value="pro" selected>Professional ($1.50-4/sqft)</option></select>
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <label class="flex items-center gap-2"><input type="checkbox" id="primer" checked> Primer coat needed</label>
                    <label class="flex items-center gap-2"><input type="checkbox" id="caulk"> Caulking ($3-5/tube)</label>
                </div>
                <button type="submit" class="btn-primary w-full">Calculate Painting Cost</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Interior & Exterior Painting Guide</h2>
            <div class="pro-tip mb-6"><h4 class="font-bold">💡 Paint Coverage Formula</h4><p>One gallon covers ~350 sq ft on smooth walls (one coat). Textured surfaces, porous surfaces, and dark-to-light color changes need more paint. Always buy an extra gallon for touch-ups — paint lots vary in color, so you can't match later.</p></div>
            <h3 class="text-2xl font-bold mt-6 mb-3">Prep Makes the Paint Job</h3>
            <p class="mb-4">Professional painters spend 60-70% of their time on prep and only 30-40% actually painting. Good prep means: clean walls (TSP wash), fill holes with spackle, sand smooth, caulk gaps, and prime stains. Skipping prep leads to peeling and uneven coverage within 1-2 years.</p>
            <h3 class="text-2xl font-bold mt-6 mb-3">Paint Sheen Guide</h3>
            <ul class="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Flat/Matte:</strong> Hides imperfections. Best for ceilings and low-traffic rooms. Hard to clean.</li>
                <li><strong>Eggshell:</strong> Slight sheen, easy to clean. The #1 choice for living rooms, bedrooms, hallways.</li>
                <li><strong>Satin:</strong> More sheen and durability. Great for kitchens, bathrooms, kids' rooms, and trim.</li>
                <li><strong>Semi-Gloss:</strong> Very durable and washable. Best for trim, doors, cabinets, and bathrooms.</li>
                <li><strong>High-Gloss:</strong> Maximum durability, very shiny. Used for front doors, furniture, and accent pieces.</li>
            </ul>
            <h3 class="text-2xl font-bold mt-6 mb-3">DIY vs. Hiring a Painter</h3>
            <p class="mb-4">A single room DIY costs $100-$200 in materials and takes a weekend. A pro charges $300-$600 per room but finishes in a day with cleaner results. Whole interior: DIY saves $2,000-$5,000 but takes 1-2 weeks. Exterior painting almost always justifies hiring a pro due to height, safety, and prep complexity.</p>
        `
    };
    document.addEventListener('DOMContentLoaded', function() {
        const projSelect = document.getElementById('projType');
        if (projSelect) projSelect.addEventListener('change', function() {
            const p = projectTypes[this.value];
            document.getElementById('areaLabel').textContent = p.areaLabel;
            document.getElementById('area').value = p.defaultArea;
        });
    });
    function calculate(e) {
        e.preventDefault();
        const projType = document.getElementById('projType').value;
        const area = parseFloat(document.getElementById('area').value);
        const qual = document.getElementById('quality').value;
        const cond = parseFloat(document.getElementById('condition').value);
        const laborType = document.getElementById('labor').value;
        const primer = document.getElementById('primer').checked;
        const caulk = document.getElementById('caulk').checked;
        const p = projectTypes[projType];
        const q = paintQuality[qual];
        let paintableSqft = projType === 'cabinet' ? area * 6 : area; // ~6 sqft per cabinet door face (front + back)
        const coats = q.coats;
        const gallons = Math.ceil((paintableSqft * coats) / p.paintCov);
        const primerGal = primer ? Math.ceil(paintableSqft / 350) : 0;
        const paintCost = gallons * q.price;
        const primerCost = primerGal * 25;
        const suppliesCost = projType === 'cabinet' ? 80 : (paintableSqft > 1000 ? 120 : 60); // rollers, tape, drop cloths
        const caulkCost = caulk ? Math.ceil(paintableSqft / 100) * 4 : 0;
        const materialTotal = paintCost + primerCost + suppliesCost + caulkCost;
        const laborCost = laborType === 'pro' ? Math.round(paintableSqft * 2.5 * cond) : 0;
        const total = materialTotal + laborCost;
        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-3xl font-bold mb-4">$${total.toLocaleString()}</h3>
            <div class="bg-white bg-opacity-20 rounded-lg p-4"><div class="space-y-2">
                <div class="flex justify-between"><span>Paintable area:</span><span>${paintableSqft.toLocaleString()} sq ft</span></div>
                <div class="flex justify-between"><span>Paint (${gallons} gal × ${coats} coats):</span><span>$${paintCost}</span></div>
                ${primerGal > 0 ? `<div class="flex justify-between"><span>Primer (${primerGal} gal):</span><span>$${primerCost}</span></div>` : ''}
                <div class="flex justify-between"><span>Supplies:</span><span>$${suppliesCost}</span></div>
                ${caulkCost > 0 ? `<div class="flex justify-between"><span>Caulk:</span><span>$${caulkCost}</span></div>` : ''}
                ${laborCost > 0 ? `<div class="flex justify-between"><span>Professional labor:</span><span>$${laborCost.toLocaleString()}</span></div>` : ''}
                <hr class="border-white border-opacity-30 my-2">
                <div class="flex justify-between font-bold text-lg"><span>Total:</span><span>$${total.toLocaleString()}</span></div>
                <div class="text-sm mt-2 opacity-80">Paint durability: ${q.durability} | Coats needed: ${coats}</div>
            </div></div>
        `;
    }
    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('costForm').addEventListener('submit', calculate);
    loadRelatedTools('cost');
})();