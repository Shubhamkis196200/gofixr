// Structural Load Calculator
(function() {
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Structural Load Calculator</h2>
            <form id="utilityForm" class="space-y-4">
                <div class="input-group">
                    <label>What are you loading?</label>
                    <select id="loadType">
                        <option value="shelf">Wall Shelf / Floating Shelf</option>
                        <option value="cabinet">Wall-Mounted Cabinet</option>
                        <option value="tv">TV Wall Mount</option>
                        <option value="ceiling">Ceiling Fan / Heavy Fixture</option>
                        <option value="deck">Deck / Balcony Floor</option>
                        <option value="floor">Interior Floor (storage/aquarium)</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Total Weight to Support (lbs)</label>
                    <input type="number" id="weight" min="5" value="50" step="5" required>
                </div>
                <div class="input-group">
                    <label>Wall/Surface Material</label>
                    <select id="material">
                        <option value="stud">Wood Stud (behind drywall)</option>
                        <option value="drywall">Drywall Only (no stud)</option>
                        <option value="concrete">Concrete / Masonry</option>
                        <option value="brick">Brick</option>
                        <option value="plaster">Plaster & Lath</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Number of Mounting Points</label>
                    <select id="mountPoints">
                        <option value="1">1 point</option>
                        <option value="2" selected>2 points</option>
                        <option value="3">3 points</option>
                        <option value="4">4 points</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary w-full">Check Load Safety</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Understanding Structural Loads for Home Projects</h2>
            <p class="mb-4">Whether you're hanging a heavy mirror, mounting a 65-inch TV, building shelves for book collections, or installing a ceiling fan, understanding how much weight your walls and ceilings can safely hold is critical. Overloading a mounting point can cause costly damage — or worse, injury. This calculator helps you determine the right hardware and assess whether your planned installation is safe.</p>

            <div class="pro-tip mb-6">
                <h4 class="font-bold">💡 Pro Tip</h4>
                <p>Always anchor into studs for heavy items. A single wood screw in a stud can hold 80-100 lbs in shear (downward force). The same screw in drywall alone holds only 5-10 lbs before pulling out. For items over 20 lbs, finding studs is not optional — it's essential.</p>
            </div>

            <h3 class="text-2xl font-bold mt-6 mb-3">Fastener Capacities by Wall Type</h3>
            <ul class="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Wood Stud (3" screw):</strong> 80-100 lbs per screw in shear</li>
                <li><strong>Drywall Toggle Bolt:</strong> 30-50 lbs per bolt (best drywall-only option)</li>
                <li><strong>Drywall Anchor (plastic):</strong> 10-25 lbs per anchor</li>
                <li><strong>Concrete Anchor (3/8" wedge):</strong> 200-500 lbs per anchor</li>
                <li><strong>Brick (sleeve anchor):</strong> 150-300 lbs per anchor</li>
                <li><strong>Plaster & Lath:</strong> Similar to drywall — find the studs behind it</li>
            </ul>

            <h3 class="text-2xl font-bold mt-6 mb-3">Common Household Item Weights</h3>
            <ul class="list-disc pl-6 space-y-2 mb-4">
                <li><strong>55" TV:</strong> 30-45 lbs + mount bracket (5-15 lbs)</li>
                <li><strong>Full bookshelf (per linear foot):</strong> 20-25 lbs of books</li>
                <li><strong>Kitchen wall cabinet (full):</strong> 50-100 lbs</li>
                <li><strong>Ceiling fan:</strong> 15-50 lbs (must use fan-rated box)</li>
                <li><strong>Large mirror:</strong> 30-80 lbs</li>
                <li><strong>Full aquarium:</strong> 8.3 lbs per gallon of water + tank weight</li>
            </ul>

            <h3 class="text-2xl font-bold mt-6 mb-3">Finding Studs</h3>
            <p class="mb-4">Studs are typically spaced 16 inches on center (some homes use 24 inches). Use an electronic stud finder, or tap the wall and listen for the change from hollow to solid. You can also look for nail pops in the drywall or measure 16" from a corner. Once found, verify by driving a small nail — it should meet resistance if you've found the stud. Magnetic stud finders detect the drywall screws/nails along the stud line.</p>
        `
    };

    const capacities = {
        stud:     {perPoint: 90, fastener: '3" wood screw or lag bolt into stud', icon: '🪵'},
        drywall:  {perPoint: 15, fastener: 'toggle bolt or heavy-duty drywall anchor', icon: '📋'},
        concrete: {perPoint: 350, fastener: '3/8" wedge anchor or concrete screw', icon: '🧱'},
        brick:    {perPoint: 200, fastener: 'sleeve anchor into mortar joint', icon: '🏠'},
        plaster:  {perPoint: 20, fastener: 'toggle bolt (find studs if possible)', icon: '🔩'}
    };

    function calculate(e) {
        e.preventDefault();
        const loadType = document.getElementById('loadType').value;
        const weight = parseFloat(document.getElementById('weight').value);
        const material = document.getElementById('material').value;
        const points = parseInt(document.getElementById('mountPoints').value);

        const cap = capacities[material];
        const totalCapacity = cap.perPoint * points;
        const loadPerPoint = weight / points;
        const safetyFactor = totalCapacity / weight;
        const isSafe = safetyFactor >= 2.0;
        const isMargin = safetyFactor >= 1.5 && safetyFactor < 2.0;

        let status, statusColor, recommendation;
        if (isSafe) { status = '✅ SAFE'; statusColor = 'text-green-300'; recommendation = 'Your mounting plan has adequate safety margin.'; }
        else if (isMargin) { status = '⚠️ MARGINAL'; statusColor = 'text-yellow-300'; recommendation = 'This will probably hold but has minimal safety margin. Add mounting points or upgrade fasteners.'; }
        else { status = '❌ UNSAFE'; statusColor = 'text-red-300'; recommendation = 'This configuration cannot safely support the weight. You need stronger fasteners, more mounting points, or a different wall material.'; }

        let tips = [];
        if (material === 'drywall' && weight > 30) tips.push('For this weight, you should find and anchor into wall studs instead of drywall only.');
        if (loadType === 'tv' && material === 'drywall') tips.push('TV mounts should ALWAYS be anchored into studs. Use a full-motion mount with a stud-spanning plate if studs don\'t align.');
        if (loadType === 'ceiling') tips.push('Ceiling fans and heavy fixtures require a fan-rated electrical box secured to a joist or brace. Standard outlet boxes are NOT rated for hanging loads.');
        if (loadType === 'deck') tips.push('Deck loads must meet local building codes (typically 40 psf live load + 10 psf dead load). Consult a structural engineer for any concerns.');
        if (loadType === 'floor' && weight > 300) tips.push('Heavy concentrated loads (aquariums, safes) may exceed floor joist capacity. Place near load-bearing walls or add support from below.');

        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-2xl font-bold mb-4 ${statusColor}">${status} — Load Assessment</h3>
            <div class="bg-white bg-opacity-20 rounded-lg p-4 mb-4">
                <div class="space-y-2">
                    <div class="flex justify-between"><span>Total Weight:</span><span class="font-bold">${weight} lbs</span></div>
                    <div class="flex justify-between"><span>Load per Mount Point:</span><span class="font-bold">${loadPerPoint.toFixed(0)} lbs</span></div>
                    <div class="flex justify-between"><span>Capacity per Point (${material}):</span><span class="font-bold">${cap.perPoint} lbs</span></div>
                    <div class="flex justify-between"><span>Total Capacity (${points} points):</span><span class="font-bold">${totalCapacity} lbs</span></div>
                    <div class="flex justify-between"><span>Safety Factor:</span><span class="font-bold ${statusColor}">${safetyFactor.toFixed(1)}x</span></div>
                </div>
            </div>
            <p class="mb-3"><strong>Recommended Fastener:</strong> ${cap.fastener}</p>
            <p class="mb-3">${recommendation}</p>
            ${tips.length > 0 ? `<div class="bg-blue-900 bg-opacity-40 rounded-lg p-3 mt-3"><h4 class="font-bold mb-1">Important Notes</h4>${tips.map(t=>`<p class="text-sm mb-1">• ${t}</p>`).join('')}</div>` : ''}
        `;
    }

    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('utilityForm').addEventListener('submit', calculate);
    loadRelatedTools('utility');
})();
