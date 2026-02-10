// Home Value Impact Calculator — real ROI data for renovation projects
(function() {
    const projects = {
        minorKitchen:    { name: 'Minor Kitchen Remodel', cost: [15000, 25000], roi: 0.80, appreciation: 8000 },
        majorKitchen:    { name: 'Major Kitchen Remodel', cost: [40000, 70000], roi: 0.60, appreciation: 12000 },
        minorBath:       { name: 'Minor Bathroom Remodel', cost: [8000, 15000], roi: 0.75, appreciation: 5000 },
        majorBath:       { name: 'Major Bathroom Remodel', cost: [25000, 45000], roi: 0.60, appreciation: 8000 },
        garageDoor:      { name: 'Garage Door Replacement', cost: [1500, 3500], roi: 0.94, appreciation: 2500 },
        entryDoor:       { name: 'Entry Door Replacement', cost: [1500, 3000], roi: 0.75, appreciation: 1800 },
        siding:          { name: 'Siding Replacement', cost: [10000, 20000], roi: 0.77, appreciation: 10000 },
        windows:         { name: 'Window Replacement', cost: [8000, 18000], roi: 0.72, appreciation: 8500 },
        roofing:         { name: 'Roof Replacement', cost: [7000, 15000], roi: 0.68, appreciation: 7000 },
        deck:            { name: 'Wood Deck Addition', cost: [8000, 15000], roi: 0.72, appreciation: 8000 },
        landscape:       { name: 'Landscaping', cost: [3000, 8000], roi: 1.00, appreciation: 5000 },
        basement:        { name: 'Basement Finishing', cost: [20000, 40000], roi: 0.70, appreciation: 15000 },
        atticBedroom:    { name: 'Attic Bedroom Addition', cost: [40000, 75000], roi: 0.53, appreciation: 30000 },
        painting:        { name: 'Interior Painting (whole house)', cost: [3000, 8000], roi: 1.07, appreciation: 4000 },
        flooring:        { name: 'Hardwood Flooring', cost: [8000, 15000], roi: 0.80, appreciation: 8000 }
    };
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Home Value Impact Calculator</h2>
            <p class="text-gray-600 mb-4">Calculate how much a renovation will increase your home's value based on national average ROI data.</p>
            <form id="impactForm" class="space-y-4">
                <div class="input-group"><label>Renovation Project</label>
                    <select id="project"><option value="garageDoor" selected>Garage Door Replacement (94% ROI)</option><option value="painting">Interior Painting (107% ROI)</option><option value="minorKitchen">Minor Kitchen Remodel (80% ROI)</option><option value="siding">Siding Replacement (77% ROI)</option><option value="minorBath">Minor Bathroom Remodel (75% ROI)</option><option value="entryDoor">Entry Door Replacement (75% ROI)</option><option value="windows">Window Replacement (72% ROI)</option><option value="deck">Wood Deck Addition (72% ROI)</option><option value="basement">Basement Finishing (70% ROI)</option><option value="roofing">Roof Replacement (68% ROI)</option><option value="majorKitchen">Major Kitchen Remodel (60% ROI)</option><option value="majorBath">Major Bathroom Remodel (60% ROI)</option><option value="atticBedroom">Attic Bedroom Addition (53% ROI)</option><option value="flooring">Hardwood Flooring (80% ROI)</option><option value="landscape">Landscaping (100% ROI)</option></select>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="input-group"><label>Current Home Value ($)</label><input type="number" id="homeValue" min="50000" value="300000" step="10000" required></div>
                    <div class="input-group"><label>Market Condition</label>
                        <select id="market"><option value="0.8">Buyer's Market (slow)</option><option value="1.0" selected>Balanced Market</option><option value="1.15">Seller's Market (hot)</option></select>
                    </div>
                </div>
                <div class="input-group"><label>Time Until Sale</label>
                    <select id="timeToSale"><option value="immediate" selected>Selling immediately</option><option value="1yr">Selling in 1 year</option><option value="5yr">Keeping 5+ years</option><option value="forever">Not selling (enjoyment value)</option></select>
                </div>
                <button type="submit" class="btn-primary w-full">Calculate Value Impact</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Home Improvement ROI Guide</h2>
            <p class="mb-4">Not all home improvements pay back equally. Some projects recoup over 90% of their cost at resale, while others return only 50-60%. Data from Remodeling Magazine's Cost vs. Value Report.</p>
            <div class="pro-tip mb-6"><h4 class="font-bold">💡 The ROI Reality</h4><p>VERY few renovations pay for themselves 100% at resale. The exception: painting, landscaping, and minor cosmetic updates. Major remodels typically return 55-75%. Don't renovate solely for resale ROI — factor in the enjoyment value while you live there. A kitchen you love for 10 years has intangible value beyond the resale number.</p></div>
            <h3 class="text-2xl font-bold mt-6 mb-3">Top ROI Projects (2024-2025 Data)</h3>
            <table class="w-full text-sm mb-6"><thead><tr class="border-b"><th class="text-left py-2">Project</th><th>Avg Cost</th><th>Value Added</th><th>ROI %</th></tr></thead><tbody>
                <tr class="border-b"><td class="py-2">Painting (interior)</td><td>$5,000</td><td>$5,350</td><td>107%</td></tr>
                <tr class="border-b"><td class="py-2">Landscaping</td><td>$5,000</td><td>$5,000</td><td>100%</td></tr>
                <tr class="border-b"><td class="py-2">Garage Door</td><td>$2,500</td><td>$2,350</td><td>94%</td></tr>
                <tr class="border-b"><td class="py-2">Minor Kitchen</td><td>$20,000</td><td>$16,000</td><td>80%</td></tr>
                <tr class="border-b"><td class="py-2">Siding Replacement</td><td>$15,000</td><td>$11,550</td><td>77%</td></tr>
                <tr class="border-b"><td class="py-2">Window Replacement</td><td>$13,000</td><td>$9,360</td><td>72%</td></tr>
                <tr><td class="py-2">Major Kitchen</td><td>$55,000</td><td>$33,000</td><td>60%</td></tr>
            </tbody></table>
            <h3 class="text-2xl font-bold mt-6 mb-3">Remodel Smart for Resale</h3>
            <ul class="list-disc pl-6 space-y-2">
                <li>Stay within your neighborhood's average — don't over-improve</li>
                <li>Focus on curb appeal — buyers decide in the first 30 seconds</li>
                <li>Update kitchens and bathrooms first — they sell homes</li>
                <li>Avoid ultra-personal choices (purple walls, themed rooms)</li>
            </ul>
        `
    };
    function calculate(e) {
        e.preventDefault();
        const projKey = document.getElementById('project').value;
        const p = projects[projKey];
        const homeValue = parseFloat(document.getElementById('homeValue').value);
        const market = parseFloat(document.getElementById('market').value);
        const timeToSale = document.getElementById('timeToSale').value;
        const avgCost = (p.cost[0] + p.cost[1]) / 2;
        const baseValueAdded = avgCost * p.roi * market;
        const appreciationFactor = timeToSale === '5yr' ? 1.2 : timeToSale === '1yr' ? 1.05 : 1.0;
        const valueAdded = Math.round(baseValueAdded * appreciationFactor);
        const netGainLoss = valueAdded - avgCost;
        const newHomeValue = homeValue + valueAdded;
        const enjoymentNote = timeToSale === 'forever' ? '<div class="text-sm mt-3 opacity-90">💡 Since you\'re not selling, focus on enjoyment value and functional improvements, not just resale ROI.</div>' : '';
        const roiPercent = Math.round((valueAdded / avgCost) * 100);
        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-3xl font-bold mb-4">+$${valueAdded.toLocaleString()} Value Added</h3>
            <div class="bg-white bg-opacity-20 rounded-lg p-4"><div class="space-y-2">
                <div class="flex justify-between"><span>Project:</span><span>${p.name}</span></div>
                <div class="flex justify-between"><span>Estimated cost:</span><span>$${Math.round(avgCost).toLocaleString()}</span></div>
                <div class="flex justify-between"><span>Value added:</span><span class="font-bold">$${valueAdded.toLocaleString()}</span></div>
                <div class="flex justify-between"><span>ROI:</span><span class="font-bold">${roiPercent}%</span></div>
                <hr class="border-white border-opacity-30 my-2">
                <div class="flex justify-between ${netGainLoss >= 0 ? 'text-green-300' : 'text-red-300'}"><span>Net gain/loss:</span><span class="font-bold">${netGainLoss >= 0 ? '+' : ''}$${netGainLoss.toLocaleString()}</span></div>
                <hr class="border-white border-opacity-30 my-2">
                <div class="flex justify-between"><span>Current home value:</span><span>$${homeValue.toLocaleString()}</span></div>
                <div class="flex justify-between font-bold text-lg"><span>After renovation:</span><span>$${newHomeValue.toLocaleString()}</span></div>
                ${enjoymentNote}
            </div></div>
        `;
    }
    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('impactForm').addEventListener('submit', calculate);
    loadRelatedTools('planning');
})();