// Room Measurement Guide
(function() {
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Room Measurement Calculator</h2>
            <form id="utilityForm" class="space-y-4">
                <div class="input-group">
                    <label>Room Shape</label>
                    <select id="shape">
                        <option value="rect">Rectangular</option>
                        <option value="lshape">L-Shaped</option>
                        <option value="circle">Circular/Rounded</option>
                    </select>
                </div>
                <div id="rectInputs">
                    <div class="input-group">
                        <label>Room Length (feet)</label>
                        <input type="number" id="length" min="1" value="14" step="0.5">
                    </div>
                    <div class="input-group">
                        <label>Room Width (feet)</label>
                        <input type="number" id="width" min="1" value="12" step="0.5">
                    </div>
                </div>
                <div id="lInputs" class="hidden">
                    <p class="text-sm text-gray-500 mb-2">Measure the L as two rectangles:</p>
                    <div class="grid grid-cols-2 gap-2">
                        <div class="input-group"><label>Section A Length</label><input type="number" id="la" min="1" value="14" step="0.5"></div>
                        <div class="input-group"><label>Section A Width</label><input type="number" id="wa" min="1" value="10" step="0.5"></div>
                        <div class="input-group"><label>Section B Length</label><input type="number" id="lb" min="1" value="8" step="0.5"></div>
                        <div class="input-group"><label>Section B Width</label><input type="number" id="wb" min="1" value="6" step="0.5"></div>
                    </div>
                </div>
                <div id="circInputs" class="hidden">
                    <div class="input-group">
                        <label>Diameter (feet)</label>
                        <input type="number" id="diameter" min="1" value="12" step="0.5">
                    </div>
                </div>
                <div class="input-group">
                    <label>Ceiling Height (feet)</label>
                    <input type="number" id="ceilingH" min="6" value="8" step="0.5">
                </div>
                <div class="input-group">
                    <label>Number of Windows</label>
                    <input type="number" id="windows" min="0" value="2" step="1">
                </div>
                <div class="input-group">
                    <label>Number of Doors</label>
                    <input type="number" id="doors" min="0" value="1" step="1">
                </div>
                <button type="submit" class="btn-primary w-full">Calculate Measurements</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">How to Measure a Room Accurately</h2>
            <p class="mb-4">Accurate room measurements are the foundation of every home improvement project — from buying paint and flooring to planning furniture layouts and ordering materials. Getting it wrong means wasted money on extra materials or frustrating return trips to the store. This guide and calculator give you every measurement you need in one place: floor area, wall area, perimeter, and material quantities with waste factored in.</p>

            <div class="pro-tip mb-6">
                <h4 class="font-bold">💡 Pro Tip</h4>
                <p>Measure twice, cut once. Use a 25-foot tape measure for accuracy, and write down every measurement immediately. For rooms that aren't perfectly square (most aren't), measure at multiple points and use the largest dimension to avoid coming up short.</p>
            </div>

            <h3 class="text-2xl font-bold mt-6 mb-3">Step-by-Step Measuring Guide</h3>
            <ol class="list-decimal pl-6 space-y-2 mb-4">
                <li><strong>Clear the room</strong> — move furniture away from walls so you can reach corners</li>
                <li><strong>Measure length and width</strong> at floor level along the baseboards, not at eye level</li>
                <li><strong>Check for square</strong> — measure both diagonals. If they're equal, the room is square. Differences over 1" mean the room is out of square</li>
                <li><strong>Measure ceiling height</strong> in several spots — older homes may have slight variations</li>
                <li><strong>Note obstacles</strong> — closets, built-ins, fireplace hearths, and any floor irregularities</li>
                <li><strong>Sketch a floor plan</strong> with all measurements labeled before leaving the room</li>
            </ol>

            <h3 class="text-2xl font-bold mt-6 mb-3">Common Measurement Conversions</h3>
            <ul class="list-disc pl-6 space-y-2 mb-4">
                <li>1 square yard = 9 square feet (carpet is often priced per sq yd)</li>
                <li>1 square = 100 square feet (roofing measurement)</li>
                <li>12 inches = 1 foot (seems obvious but measure errors often come from mixing units)</li>
            </ul>

            <h3 class="text-2xl font-bold mt-6 mb-3">Waste Factors by Material</h3>
            <p class="mb-4">Always order more than the exact measurement to account for cuts, mistakes, and pattern matching. Standard waste factors: <strong>Flooring:</strong> add 10% for rectangular rooms, 15% for diagonal installation. <strong>Paint:</strong> calculated coverage minus window/door area. <strong>Tile:</strong> add 10-15%. <strong>Wallpaper:</strong> add 15-20% for pattern matching. This calculator includes these waste factors in its output.</p>
        `
    };

    const shapeSelect = () => {
        const v = document.getElementById('shape').value;
        document.getElementById('rectInputs').className = v === 'rect' ? '' : 'hidden';
        document.getElementById('lInputs').className = v === 'lshape' ? '' : 'hidden';
        document.getElementById('circInputs').className = v === 'circle' ? '' : 'hidden';
    };

    function calculate(e) {
        e.preventDefault();
        const shape = document.getElementById('shape').value;
        const cH = parseFloat(document.getElementById('ceilingH').value);
        const wins = parseInt(document.getElementById('windows').value);
        const drs = parseInt(document.getElementById('doors').value);
        const winArea = wins * 15; // avg window 3x5
        const doorArea = drs * 21; // avg door 3x7

        let floorArea, perimeter;
        if (shape === 'rect') {
            const l = parseFloat(document.getElementById('length').value);
            const w = parseFloat(document.getElementById('width').value);
            floorArea = l * w; perimeter = 2 * (l + w);
        } else if (shape === 'lshape') {
            const la = parseFloat(document.getElementById('la').value), wa = parseFloat(document.getElementById('wa').value);
            const lb = parseFloat(document.getElementById('lb').value), wb = parseFloat(document.getElementById('wb').value);
            floorArea = (la * wa) + (lb * wb); perimeter = 2 * (la + wa) + 2 * wb; // approximate
        } else {
            const d = parseFloat(document.getElementById('diameter').value);
            floorArea = Math.PI * (d/2) * (d/2); perimeter = Math.PI * d;
        }

        const grossWallArea = perimeter * cH;
        const netWallArea = grossWallArea - winArea - doorArea;
        const paintGallons = Math.ceil(netWallArea / 350); // 350 sqft/gallon
        const flooringWithWaste = floorArea * 1.10;
        const tileWithWaste = floorArea * 1.15;
        const sqYards = floorArea / 9;

        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-2xl font-bold mb-4">Room Measurements</h3>
            <div class="bg-white bg-opacity-20 rounded-lg p-4 mb-4">
                <h4 class="font-bold mb-2">📐 Dimensions</h4>
                <div class="space-y-1 text-sm">
                    <div class="flex justify-between"><span>Floor Area:</span><span class="font-bold">${floorArea.toFixed(0)} sq ft (${sqYards.toFixed(1)} sq yd)</span></div>
                    <div class="flex justify-between"><span>Room Perimeter:</span><span class="font-bold">${perimeter.toFixed(1)} linear ft</span></div>
                    <div class="flex justify-between"><span>Gross Wall Area:</span><span class="font-bold">${grossWallArea.toFixed(0)} sq ft</span></div>
                    <div class="flex justify-between"><span>Window/Door Area:</span><span class="font-bold">-${(winArea+doorArea)} sq ft</span></div>
                    <div class="flex justify-between"><span>Net Paintable Wall Area:</span><span class="font-bold">${netWallArea.toFixed(0)} sq ft</span></div>
                    <div class="flex justify-between"><span>Ceiling Area:</span><span class="font-bold">${floorArea.toFixed(0)} sq ft</span></div>
                    <div class="flex justify-between"><span>Total Room Volume:</span><span class="font-bold">${(floorArea*cH).toFixed(0)} cu ft</span></div>
                </div>
            </div>
            <div class="bg-white bg-opacity-20 rounded-lg p-4">
                <h4 class="font-bold mb-2">🛒 Material Estimates</h4>
                <div class="space-y-1 text-sm">
                    <div class="flex justify-between"><span>Paint (walls, 1 coat):</span><span class="font-bold">${paintGallons} gallon${paintGallons>1?'s':''}</span></div>
                    <div class="flex justify-between"><span>Paint (walls + ceiling):</span><span class="font-bold">${Math.ceil((netWallArea+floorArea)/350)} gallons</span></div>
                    <div class="flex justify-between"><span>Flooring (+ 10% waste):</span><span class="font-bold">${flooringWithWaste.toFixed(0)} sq ft</span></div>
                    <div class="flex justify-between"><span>Tile (+ 15% waste):</span><span class="font-bold">${tileWithWaste.toFixed(0)} sq ft</span></div>
                    <div class="flex justify-between"><span>Baseboard/Trim:</span><span class="font-bold">${(perimeter - drs*3).toFixed(0)} linear ft</span></div>
                    <div class="flex justify-between"><span>Carpet (sq yd):</span><span class="font-bold">${(sqYards*1.10).toFixed(1)} sq yd</span></div>
                </div>
            </div>
        `;
    }

    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('shape').addEventListener('change', shapeSelect);
    document.getElementById('utilityForm').addEventListener('submit', calculate);
    loadRelatedTools('utility');
})();
