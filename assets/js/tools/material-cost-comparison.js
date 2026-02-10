// Material Cost Comparison Tool
(function() {
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Material Cost Comparison</h2>
            <form id="utilityForm" class="space-y-4">
                <div class="input-group">
                    <label>Project Category</label>
                    <select id="category" onchange="updateMaterials()">
                        <option value="flooring">Flooring</option>
                        <option value="countertop">Countertops</option>
                        <option value="roofing">Roofing</option>
                        <option value="fencing">Fencing</option>
                        <option value="decking">Decking</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Area / Linear Feet Needed</label>
                    <input type="number" id="quantity" min="10" value="300" step="10" required>
                    <span class="text-sm text-gray-500" id="unitLabel">sq ft</span>
                </div>
                <div class="input-group">
                    <label>Compare Material 1</label>
                    <select id="mat1"></select>
                </div>
                <div class="input-group">
                    <label>Compare Material 2</label>
                    <select id="mat2"></select>
                </div>
                <div class="input-group">
                    <label>Include Installation Labor?</label>
                    <select id="labor">
                        <option value="yes" selected>Yes</option>
                        <option value="no">No (DIY)</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary w-full">Compare Costs</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Choosing the Right Materials for Your Project</h2>
            <p class="mb-4">The material you choose for any home improvement project affects not just the upfront cost, but also durability, maintenance requirements, appearance, and long-term value. The cheapest option isn't always the best value when you factor in lifespan and upkeep. This comparison tool helps you see the full picture — initial cost, annual maintenance, expected lifespan, and true cost per year of ownership.</p>

            <div class="pro-tip mb-6">
                <h4 class="font-bold">💡 Pro Tip</h4>
                <p>Calculate cost per year of lifespan, not just upfront cost. Composite decking at $12/sqft lasting 25 years ($0.48/yr) is often cheaper long-term than pressure-treated wood at $6/sqft lasting 10 years ($0.60/yr) — especially when you factor in annual staining and sealing costs.</p>
            </div>

            <h3 class="text-2xl font-bold mt-6 mb-3">Key Factors Beyond Price</h3>
            <ul class="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Lifespan:</strong> How many years before replacement? Tile lasts 50+ years; laminate lasts 10-15</li>
                <li><strong>Maintenance:</strong> Annual sealing, painting, cleaning requirements add hidden costs</li>
                <li><strong>Durability:</strong> Resistance to moisture, scratches, UV, and heavy use</li>
                <li><strong>Resale Value:</strong> Some materials (hardwood, granite) add more home value than others</li>
                <li><strong>DIY-Friendliness:</strong> Can you install it yourself? Labor is often 40-60% of total cost</li>
            </ul>

            <h3 class="text-2xl font-bold mt-6 mb-3">Flooring Comparison Highlights</h3>
            <p class="mb-4">Luxury vinyl plank (LVP) has become the most popular flooring choice thanks to its waterproof properties, durability, and realistic wood-look appearance at $3-7/sqft installed. Hardwood remains the gold standard for resale value at $8-15/sqft installed, lasting 50+ years with refinishing. Laminate offers budget appeal at $3-6/sqft but can't be refinished and is vulnerable to moisture.</p>

            <h3 class="text-2xl font-bold mt-6 mb-3">Getting the Best Price</h3>
            <p class="mb-4">Buy 10% extra material for cuts and waste. Shop during holiday sales (Memorial Day, Black Friday) for the biggest discounts. Compare big-box stores with local suppliers — specialty stores sometimes beat Home Depot on premium materials. Always get at least 3 installation quotes, and check that quotes include underlayment, trim, and waste removal.</p>
        `
    };

    const materials = {
        flooring: {
            unit: 'sq ft',
            options: {
                'laminate':       {name:'Laminate',           matCost:2.50, laborCost:2.00, lifespan:12, maintenance:0.10},
                'lvp':            {name:'Luxury Vinyl Plank', matCost:3.50, laborCost:2.50, lifespan:20, maintenance:0.05},
                'hardwood':       {name:'Hardwood (oak)',     matCost:6.00, laborCost:4.00, lifespan:50, maintenance:0.30},
                'tile':           {name:'Ceramic Tile',       matCost:3.00, laborCost:5.00, lifespan:50, maintenance:0.10},
                'carpet':         {name:'Carpet',             matCost:2.00, laborCost:1.50, lifespan:8,  maintenance:0.20},
                'engineered':     {name:'Engineered Hardwood',matCost:4.50, laborCost:3.50, lifespan:30, maintenance:0.20}
            }
        },
        countertop: {
            unit: 'sq ft',
            options: {
                'laminate':  {name:'Laminate',        matCost:15, laborCost:10, lifespan:15, maintenance:0.0},
                'granite':   {name:'Granite',         matCost:45, laborCost:25, lifespan:50, maintenance:0.50},
                'quartz':    {name:'Quartz',          matCost:55, laborCost:25, lifespan:50, maintenance:0.10},
                'butcher':   {name:'Butcher Block',   matCost:30, laborCost:15, lifespan:20, maintenance:1.00},
                'concrete':  {name:'Concrete',        matCost:40, laborCost:30, lifespan:50, maintenance:0.40},
                'marble':    {name:'Marble',          matCost:60, laborCost:30, lifespan:50, maintenance:1.00}
            }
        },
        roofing: {
            unit: 'sq ft',
            options: {
                'asphalt3':  {name:'3-Tab Asphalt Shingle', matCost:1.50, laborCost:2.50, lifespan:20, maintenance:0.05},
                'archit':    {name:'Architectural Shingle',  matCost:2.50, laborCost:3.00, lifespan:30, maintenance:0.05},
                'metal':     {name:'Standing Seam Metal',    matCost:5.00, laborCost:5.00, lifespan:50, maintenance:0.02},
                'tile':      {name:'Clay/Concrete Tile',     matCost:6.00, laborCost:6.00, lifespan:50, maintenance:0.10},
                'slate':     {name:'Slate',                  matCost:10.00,laborCost:8.00, lifespan:100,maintenance:0.05}
            }
        },
        fencing: {
            unit: 'linear ft',
            options: {
                'chainlink': {name:'Chain Link (4ft)',     matCost:7,  laborCost:8,  lifespan:20, maintenance:0.0},
                'wood':      {name:'Wood Privacy (6ft)',   matCost:12, laborCost:10, lifespan:15, maintenance:0.50},
                'vinyl':     {name:'Vinyl Privacy (6ft)',  matCost:20, laborCost:12, lifespan:30, maintenance:0.05},
                'aluminum':  {name:'Aluminum (4ft)',       matCost:22, laborCost:12, lifespan:40, maintenance:0.05},
                'wrought':   {name:'Wrought Iron (4ft)',   matCost:30, laborCost:15, lifespan:50, maintenance:0.30}
            }
        },
        decking: {
            unit: 'sq ft',
            options: {
                'pt-wood':    {name:'Pressure-Treated Wood', matCost:3.50, laborCost:4.00, lifespan:12, maintenance:0.60},
                'cedar':      {name:'Cedar',                 matCost:5.50, laborCost:4.50, lifespan:18, maintenance:0.50},
                'composite':  {name:'Composite',             matCost:8.00, laborCost:5.00, lifespan:25, maintenance:0.05},
                'pvc':        {name:'PVC Decking',           matCost:9.50, laborCost:5.00, lifespan:30, maintenance:0.02},
                'ipe':        {name:'Ipe Hardwood',          matCost:12.00,laborCost:6.00, lifespan:40, maintenance:0.30}
            }
        }
    };

    window.updateMaterials = function() {
        const cat = document.getElementById('category').value;
        const opts = materials[cat].options;
        const keys = Object.keys(opts);
        document.getElementById('unitLabel').textContent = materials[cat].unit;
        ['mat1','mat2'].forEach((id,i) => {
            const sel = document.getElementById(id);
            sel.innerHTML = keys.map((k,j) => `<option value="${k}" ${j===(i===0?0:Math.min(1,keys.length-1))?'selected':''}>${opts[k].name}</option>`).join('');
        });
    };

    function calculate(e) {
        e.preventDefault();
        const cat = document.getElementById('category').value;
        const qty = parseFloat(document.getElementById('quantity').value);
        const m1k = document.getElementById('mat1').value;
        const m2k = document.getElementById('mat2').value;
        const inclLabor = document.getElementById('labor').value === 'yes';
        const unit = materials[cat].unit;
        const m1 = materials[cat].options[m1k];
        const m2 = materials[cat].options[m2k];

        function calc(m) {
            const matTotal = qty * m.matCost;
            const labTotal = inclLabor ? qty * m.laborCost : 0;
            const total = matTotal + labTotal;
            const annualMaint = qty * m.maintenance;
            const lifetimeCost = total + annualMaint * m.lifespan;
            const costPerYear = lifetimeCost / m.lifespan;
            return {matTotal, labTotal, total, annualMaint, lifetimeCost, costPerYear, ...m};
        }

        const c1 = calc(m1), c2 = calc(m2);
        const winner = c1.costPerYear <= c2.costPerYear ? c1 : c2;
        const savings = Math.abs(c1.costPerYear - c2.costPerYear) * Math.max(c1.lifespan, c2.lifespan);

        function row(c) {
            return `<div class="bg-white bg-opacity-10 rounded-lg p-4">
                <h4 class="font-bold text-lg mb-2">${c.name}</h4>
                <div class="space-y-1 text-sm">
                    <div class="flex justify-between"><span>Material:</span><span>$${c.matTotal.toLocaleString()}</span></div>
                    ${inclLabor?`<div class="flex justify-between"><span>Labor:</span><span>$${c.labTotal.toLocaleString()}</span></div>`:''}
                    <div class="flex justify-between font-bold"><span>Upfront Total:</span><span>$${c.total.toLocaleString()}</span></div>
                    <div class="flex justify-between"><span>Annual Maintenance:</span><span>$${c.annualMaint.toFixed(0)}/yr</span></div>
                    <div class="flex justify-between"><span>Expected Lifespan:</span><span>${c.lifespan} years</span></div>
                    <hr class="border-white border-opacity-20 my-1">
                    <div class="flex justify-between font-bold"><span>Lifetime Cost:</span><span>$${Math.round(c.lifetimeCost).toLocaleString()}</span></div>
                    <div class="flex justify-between font-bold"><span>Cost per Year:</span><span>$${c.costPerYear.toFixed(0)}/yr</span></div>
                </div>
            </div>`;
        }

        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-2xl font-bold mb-4">Cost Comparison — ${qty} ${unit}</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">${row(c1)}${row(c2)}</div>
            <div class="bg-green-900 bg-opacity-40 rounded-lg p-3">
                <p class="font-bold">🏆 Best Long-Term Value: ${winner.name}</p>
                <p class="text-sm">At $${winner.costPerYear.toFixed(0)}/year over ${winner.lifespan} years, it saves ~$${Math.round(savings).toLocaleString()} in lifetime costs vs. the alternative.</p>
            </div>
        `;
    }

    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    updateMaterials();
    document.getElementById('utilityForm').addEventListener('submit', calculate);
    loadRelatedTools('utility');
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
