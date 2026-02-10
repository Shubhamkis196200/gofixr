// Mulch Calculator
(function() {
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Mulch Calculator</h2>
            <form id="mulchForm" class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div class="input-group"><label>Bed Length (ft)</label><input type="number" id="bedL" min="1" value="20" step="0.5" required></div>
                    <div class="input-group"><label>Bed Width (ft)</label><input type="number" id="bedW" min="1" value="4" step="0.5" required></div>
                </div>
                <div class="input-group">
                    <label>Desired Depth</label>
                    <select id="depth">
                        <option value="2">2 inches (top-up existing)</option>
                        <option value="3" selected>3 inches (standard)</option>
                        <option value="4">4 inches (weed suppression)</option>
                        <option value="6">6 inches (paths/play areas)</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Mulch Type</label>
                    <select id="mulchType">
                        <option value="30" selected>Hardwood ($30-40/yd)</option>
                        <option value="35">Cedar ($35-50/yd)</option>
                        <option value="25">Pine bark ($25-35/yd)</option>
                        <option value="45">Rubber ($45-150/yd)</option>
                        <option value="20">Free/municipal compost</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary w-full">Calculate Mulch</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Mulch Guide</h2>
            <div class="pro-tip mb-6">
                <h4 class="font-bold mb-2">💡 Pro Tip</h4>
                <p>1 cubic yard covers about 108 sq ft at 3" deep. Most bagged mulch is 2 cu ft — you need 13.5 bags per cubic yard.</p>
            </div>
            <h3 class="text-2xl font-bold mt-6 mb-3">When to Mulch</h3>
            <ul class="list-disc pl-6 space-y-2">
                <li><strong>Spring:</strong> After soil warms to retain moisture</li>
                <li><strong>Fall:</strong> To insulate roots for winter</li>
                <li>Keep 2-3" away from plant stems and tree trunks</li>
                <li>Refresh annually — organic mulch decomposes</li>
            </ul>
        `
    };

    function calculate(e) {
        e.preventDefault();
        const l = parseFloat(document.getElementById('bedL').value);
        const w = parseFloat(document.getElementById('bedW').value);
        const depth = parseFloat(document.getElementById('depth').value);
        const price = parseFloat(document.getElementById('mulchType').value);
        const area = l * w;
        const cubicFt = area * (depth / 12);
        const cubicYards = cubicFt / 27;
        const bags = Math.ceil(cubicFt / 2);
        const cost = (cubicYards * price).toFixed(0);

        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-3xl font-bold mb-4">${cubicYards.toFixed(1)} Cubic Yards</h3>
            <div class="bg-white bg-opacity-20 rounded-lg p-4">
                <div class="space-y-2">
                    <div class="flex justify-between"><span>Bed area:</span><span>${area.toFixed(0)} sq ft</span></div>
                    <div class="flex justify-between"><span>Depth:</span><span>${depth} inches</span></div>
                    <div class="flex justify-between"><span>Volume:</span><span>${cubicFt.toFixed(1)} cu ft (${cubicYards.toFixed(1)} cu yd)</span></div>
                    <div class="flex justify-between"><span>Bags (2 cu ft):</span><span>${bags} bags</span></div>
                    <div class="border-t border-white pt-2 flex justify-between font-bold"><span>Est. cost (bulk):</span><span>~$${cost}</span></div>
                </div>
            </div>
        `;
    }

    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('mulchForm').addEventListener('submit', calculate);
    loadRelatedTools('planning');
})();

function loadRelatedTools(category) {
    fetch('../tools-data.json').then(r => r.json()).then(tools => {
        const related = tools.filter(t => t.category === category).slice(0, 3);
        document.getElementById('relatedTools').innerHTML = related.map(t => `
            <a href="${t.slug}.html" class="tool-card block">
                <div class="text-3xl mb-2">${t.icon}</div>
                <h4 class="font-bold">${t.name}</h4>
                <p class="text-sm text-gray-600">${t.desc}</p>
            </a>
        `).join('');
    });
}
