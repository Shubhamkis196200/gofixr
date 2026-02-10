// Grout Calculator — real grout volume formula using tile dimensions, joint width, tile thickness
(function() {
    const groutTypes = {
        sanded:   { name: 'Sanded (joints > 1/8")', lbsPerCuIn: 0.065, pricePerBag: 12, bagLbs: 25 },
        unsanded: { name: 'Unsanded (joints ≤ 1/8")', lbsPerCuIn: 0.060, pricePerBag: 14, bagLbs: 10 },
        epoxy:    { name: 'Epoxy (wet areas, stain-proof)', lbsPerCuIn: 0.070, pricePerBag: 45, bagLbs: 9 }
    };
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Grout Calculator</h2>
            <p class="text-gray-600 mb-4">Uses the industry formula: Volume = (Area × JointWidth × TileThickness × JointLength) / TileArea</p>
            <form id="groutForm" class="space-y-4">
                <div class="input-group"><label>Area to Grout (sq ft)</label><input type="number" id="area" min="1" value="100" step="5" required></div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="input-group"><label>Tile Length (inches)</label><input type="number" id="tileL" min="1" value="12" step="1" required></div>
                    <div class="input-group"><label>Tile Width (inches)</label><input type="number" id="tileW" min="1" value="12" step="1" required></div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="input-group"><label>Tile Thickness (inches)</label>
                        <select id="tileThick"><option value="0.25">1/4" (wall tile)</option><option value="0.375" selected>3/8" (standard)</option><option value="0.5">1/2" (porcelain/stone)</option></select>
                    </div>
                    <div class="input-group"><label>Joint Width (inches)</label>
                        <select id="jointW"><option value="0.0625">1/16" (rectified tile)</option><option value="0.125">1/8" (standard wall)</option><option value="0.1875" selected>3/16" (standard floor)</option><option value="0.25">1/4" (rustic look)</option><option value="0.375">3/8" (wide joint)</option></select>
                    </div>
                </div>
                <div class="input-group"><label>Grout Type</label>
                    <select id="groutType"><option value="sanded" selected>Sanded (joints > 1/8")</option><option value="unsanded">Unsanded (joints ≤ 1/8")</option><option value="epoxy">Epoxy (wet areas)</option></select>
                </div>
                <button type="submit" class="btn-primary w-full">Calculate Grout</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Grout Selection & Application Guide</h2>
            <div class="pro-tip mb-6"><h4 class="font-bold">💡 The Formula</h4>
                <p>Grout volume per sq ft = ((L+W) × JointWidth × Thickness × 144) / (L × W). This accounts for the total linear inches of grout joint per square foot of tile. We add 10% waste factor automatically.</p>
            </div>
            <h3 class="text-2xl font-bold mt-6 mb-3">Sanded vs. Unsanded vs. Epoxy</h3>
            <ul class="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Sanded grout:</strong> Use for joints wider than 1/8". The sand prevents shrinkage and cracking in wider joints. Best for floors. $0.50-$0.75/lb.</li>
                <li><strong>Unsanded grout:</strong> Use for joints 1/8" or narrower. Smoother texture, won't scratch polished stone or glass tile. Best for walls and delicate tile. $0.80-$1.40/lb.</li>
                <li><strong>Epoxy grout:</strong> Waterproof, stain-proof, no sealing needed. Ideal for showers, kitchen backsplashes, and commercial areas. Harder to work with — sets fast. $4-$6/lb.</li>
            </ul>
            <h3 class="text-2xl font-bold mt-6 mb-3">Application Tips</h3>
            <ul class="list-disc pl-6 space-y-2">
                <li>Mix grout to peanut-butter consistency — too wet causes color inconsistency and weakness</li>
                <li>Work in 10-15 sq ft sections — grout starts setting in 15-30 minutes</li>
                <li>Hold the float at 45° and push grout diagonally across joints</li>
                <li>Wipe haze with a damp sponge after 15-20 min, not sooner</li>
                <li>Seal cement-based grout after 72 hours with a penetrating sealer</li>
            </ul>
        `
    };
    function calculate(e) {
        e.preventDefault();
        const area = parseFloat(document.getElementById('area').value);
        const tileL = parseFloat(document.getElementById('tileL').value);
        const tileW = parseFloat(document.getElementById('tileW').value);
        const thick = parseFloat(document.getElementById('tileThick').value);
        const joint = parseFloat(document.getElementById('jointW').value);
        const gType = document.getElementById('groutType').value;
        const g = groutTypes[gType];
        // Industry formula: joint volume per tile = ((L+W) * joint * thick) * 2 sides / tile area ... simplified:
        // cubic inches of grout per sq ft of tile = ((tileL + tileW) / (tileL * tileW)) * joint * thick * 144
        const cuInPerSqft = ((tileL + tileW) / (tileL * tileW)) * joint * thick * 144;
        const totalCuIn = cuInPerSqft * area * 1.1; // 10% waste
        const lbsNeeded = totalCuIn * g.lbsPerCuIn;
        const bagsNeeded = Math.ceil(lbsNeeded / g.bagLbs);
        const cost = bagsNeeded * g.pricePerBag;
        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-3xl font-bold mb-4">${bagsNeeded} Bag${bagsNeeded>1?'s':''} of Grout</h3>
            <div class="bg-white bg-opacity-20 rounded-lg p-4"><div class="space-y-2">
                <div class="flex justify-between"><span>Tile area:</span><span>${area} sq ft</span></div>
                <div class="flex justify-between"><span>Joint volume:</span><span>${totalCuIn.toFixed(1)} cu in (incl. 10% waste)</span></div>
                <div class="flex justify-between"><span>Grout weight:</span><span>${lbsNeeded.toFixed(1)} lbs</span></div>
                <div class="flex justify-between"><span>Type:</span><span>${g.name}</span></div>
                <div class="flex justify-between"><span>Bags (${g.bagLbs} lb):</span><span>${bagsNeeded}</span></div>
                <hr class="border-white border-opacity-30 my-2">
                <div class="flex justify-between font-bold"><span>Est. cost:</span><span>$${cost}</span></div>
            </div></div>
        `;
    }
    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('groutForm').addEventListener('submit', calculate);
    loadRelatedTools('planning');
})();