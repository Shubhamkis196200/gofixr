// Concrete Calculator - Slabs, footings, columns
(function() {
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Concrete Calculator</h2>
            <form id="concreteForm" class="space-y-4">
                <div class="input-group">
                    <label>Project Type</label>
                    <select id="projectType" onchange="toggleFields()">
                        <option value="slab" selected>Slab / Patio / Driveway</option>
                        <option value="footing">Footing / Wall</option>
                        <option value="column">Column / Post Hole</option>
                    </select>
                </div>
                <div id="slabFields">
                    <div class="grid grid-cols-2 gap-4">
                        <div class="input-group"><label>Length (ft)</label><input type="number" id="sL" min="1" value="10" step="0.5"></div>
                        <div class="input-group"><label>Width (ft)</label><input type="number" id="sW" min="1" value="10" step="0.5"></div>
                    </div>
                    <div class="input-group mt-4"><label>Thickness (inches)</label><input type="number" id="sT" min="1" value="4" step="0.5"></div>
                </div>
                <div id="footingFields" class="hidden">
                    <div class="grid grid-cols-3 gap-4">
                        <div class="input-group"><label>Length (ft)</label><input type="number" id="fL" min="1" value="20" step="0.5"></div>
                        <div class="input-group"><label>Width (in)</label><input type="number" id="fW" min="4" value="12" step="1"></div>
                        <div class="input-group"><label>Depth (in)</label><input type="number" id="fD" min="4" value="12" step="1"></div>
                    </div>
                </div>
                <div id="columnFields" class="hidden">
                    <div class="grid grid-cols-2 gap-4">
                        <div class="input-group"><label>Diameter (in)</label><input type="number" id="cDia" min="4" value="12" step="1"></div>
                        <div class="input-group"><label>Depth (in)</label><input type="number" id="cDep" min="6" value="36" step="1"></div>
                    </div>
                    <div class="input-group mt-4"><label>Number of Holes</label><input type="number" id="cNum" min="1" value="4" step="1"></div>
                </div>
                <div class="input-group">
                    <label>Waste Factor</label>
                    <select id="waste">
                        <option value="5">5% (simple pour)</option>
                        <option value="10" selected>10% (standard)</option>
                        <option value="15">15% (irregular shape)</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary w-full">Calculate Concrete</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Concrete Ordering Guide</h2>
            <div class="pro-tip mb-6">
                <h4 class="font-bold mb-2">💡 Pro Tip</h4>
                <p>Concrete is sold by the cubic yard. One cubic yard = 27 cubic feet. A standard 80-lb bag makes ~0.6 cubic feet.</p>
            </div>
            <h3 class="text-2xl font-bold mt-6 mb-3">Standard Thicknesses</h3>
            <ul class="list-disc pl-6 space-y-2">
                <li><strong>Sidewalks:</strong> 4 inches</li>
                <li><strong>Driveways:</strong> 4-6 inches</li>
                <li><strong>Garage floors:</strong> 6 inches</li>
                <li><strong>Footings:</strong> 8-12 inches deep, below frost line</li>
            </ul>
            <h3 class="text-2xl font-bold mt-6 mb-3">Cost Estimates</h3>
            <ul class="list-disc pl-6 space-y-2">
                <li>Ready-mix delivery: $120-150/yard</li>
                <li>80-lb bags: ~$5-7 each (0.6 cu ft per bag)</li>
                <li>Under 1 yard → bags may be cheaper; over 1 yard → order truck</li>
            </ul>
        `
    };

    window.toggleFields = function() {
        const t = document.getElementById('projectType').value;
        document.getElementById('slabFields').className = t === 'slab' ? '' : 'hidden';
        document.getElementById('footingFields').className = t === 'footing' ? '' : 'hidden';
        document.getElementById('columnFields').className = t === 'column' ? '' : 'hidden';
    };

    function calculate(e) {
        e.preventDefault();
        const type = document.getElementById('projectType').value;
        const waste = parseFloat(document.getElementById('waste').value) / 100;
        let cubicFt = 0;
        let desc = '';

        if (type === 'slab') {
            const l = parseFloat(document.getElementById('sL').value);
            const w = parseFloat(document.getElementById('sW').value);
            const t = parseFloat(document.getElementById('sT').value) / 12;
            cubicFt = l * w * t;
            desc = `${l}' × ${w}' × ${(t*12).toFixed(1)}" slab`;
        } else if (type === 'footing') {
            const l = parseFloat(document.getElementById('fL').value);
            const w = parseFloat(document.getElementById('fW').value) / 12;
            const d = parseFloat(document.getElementById('fD').value) / 12;
            cubicFt = l * w * d;
            desc = `${l}' footing`;
        } else {
            const dia = parseFloat(document.getElementById('cDia').value) / 12;
            const dep = parseFloat(document.getElementById('cDep').value) / 12;
            const num = parseInt(document.getElementById('cNum').value);
            cubicFt = Math.PI * Math.pow(dia/2, 2) * dep * num;
            desc = `${num} column hole(s)`;
        }

        const cubicYards = cubicFt / 27;
        const withWaste = cubicYards * (1 + waste);
        const bags80 = Math.ceil(cubicFt * (1 + waste) / 0.6);
        const costTruck = (withWaste * 135).toFixed(0);
        const costBags = (bags80 * 6).toFixed(0);

        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-3xl font-bold mb-4">${withWaste.toFixed(2)} Cubic Yards</h3>
            <div class="bg-white bg-opacity-20 rounded-lg p-4">
                <div class="space-y-2">
                    <div class="flex justify-between"><span>Project:</span><span>${desc}</span></div>
                    <div class="flex justify-between"><span>Volume:</span><span>${cubicFt.toFixed(1)} cu ft (${cubicYards.toFixed(2)} cu yd)</span></div>
                    <div class="flex justify-between"><span>+ Waste:</span><span>${withWaste.toFixed(2)} cu yd</span></div>
                    <div class="border-t border-white pt-2"></div>
                    <div class="flex justify-between"><span>80-lb bags needed:</span><span>${bags80} bags (~$${costBags})</span></div>
                    <div class="flex justify-between"><span>Ready-mix truck:</span><span>~$${costTruck}</span></div>
                    <div class="text-sm mt-2 opacity-80">${withWaste < 1 ? '💡 Under 1 yard — bags may be more practical' : '💡 Over 1 yard — ready-mix delivery recommended'}</div>
                </div>
            </div>
        `;
    }

    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('concreteForm').addEventListener('submit', calculate);
    loadRelatedTools('planning');
})();
