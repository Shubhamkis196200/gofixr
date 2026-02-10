// Painting Cost Estimator
(function() {
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Painting Cost Estimator</h2>
            <form id="costForm" class="space-y-4">
                <div class="input-group">
                    <label>Project Type</label>
                    <select id="projectType">
                        <option value="room">Single Room</option>
                        <option value="interior" selected>Whole Interior</option>
                        <option value="exterior">Exterior</option>
                        <option value="trim">Trim & Doors Only</option>
                        <option value="deck">Deck/Fence Staining</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Area (sq ft of walls or linear ft)</label>
                    <input type="number" id="area" min="50" value="800" step="50" required>
                </div>
                <div class="input-group">
                    <label>Paint Quality</label>
                    <select id="quality">
                        <option value="basic">Basic ($25-35/gal)</option>
                        <option value="mid" selected>Mid-Grade ($40-55/gal)</option>
                        <option value="premium">Premium ($60-80/gal)</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Coats of Paint</label>
                    <select id="coats">
                        <option value="1">1 Coat</option>
                        <option value="2" selected>2 Coats (recommended)</option>
                        <option value="3">3 Coats (dark to light)</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Surface Condition</label>
                    <select id="condition">
                        <option value="good" selected>Good (minor prep)</option>
                        <option value="fair">Fair (patching, priming)</option>
                        <option value="poor">Poor (extensive prep)</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary w-full">Calculate Paint Cost</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Professional Painting Cost Guide</h2>
            <p class="mb-4">Professional interior painting costs $2-6 per sq ft ($1,500-$4,500 for a typical room), exterior $1.50-$4/sqft ($3,000-$8,000 for a 2,000 sqft home). Labor accounts for 70-85% of total cost, so DIY painting offers massive savings if you have the time and skill.</p>
            <div class="pro-tip mb-6"><h4 class="font-bold">💡 Pro Tip</h4><p>Prep work determines paint longevity. Clean, sand, patch, prime — the paint will only look as good as the surface underneath. Professionals spend 2-3 hours prepping for every 1 hour painting. Skip prep, and your fresh paint will show every flaw.</p></div>
            <h3 class="text-2xl font-bold mt-6 mb-3">Cost Factors</h3>
            <ul class="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Ceiling Height:</strong> 10+ ft ceilings cost 20-40% more due to scaffolding/ladders</li>
                <li><strong>Trim/Doors:</strong> Detail work costs $50-100 per door/window to paint properly</li>
                <li><strong>Color Changes:</strong> Dark to light requires extra coats and primer</li>
                <li><strong>Wallpaper Removal:</strong> Add $1-3/sqft if removing wallpaper first</li>
            </ul>
            <h3 class="text-2xl font-bold mt-6 mb-3">Paint Coverage Guide</h3>
            <p class="mb-4">One gallon covers 350-400 sqft per coat on smooth surfaces, 250-300 sqft on textured. Always buy 10% extra. Quality paint costs more per gallon but covers better, hides better, and lasts longer — often saving money over cheap paint that needs 3 coats.</p>
        `
    };
    const projectRates = {room:{laborPerSqft:2.5,coverageMult:1.0},interior:{laborPerSqft:2.0,coverageMult:1.0},exterior:{laborPerSqft:3.0,coverageMult:0.8},trim:{laborPerSqft:4.0,coverageMult:1.2},deck:{laborPerSqft:1.8,coverageMult:0.7}};
    const paintCosts = {basic:30,mid:48,premium:70};
    const condMult = {good:1.0,fair:1.3,poor:1.7};
    function calculate(e) {
        e.preventDefault();
        const proj = document.getElementById('projectType').value;
        const area = parseFloat(document.getElementById('area').value);
        const qual = document.getElementById('quality').value;
        const coats = parseInt(document.getElementById('coats').value);
        const cond = document.getElementById('condition').value;
        const pr = projectRates[proj];
        const coverage = 350 * pr.coverageMult;
        const gallonsNeeded = Math.ceil((area * coats) / coverage);
        const paintCost = gallonsNeeded * paintCosts[qual];
        const suppliesCost = Math.max(50, area * 0.25);
        const laborBase = area * pr.laborPerSqft * condMult[cond];
        const laborTotal = laborBase * (coats === 1 ? 0.7 : coats === 3 ? 1.4 : 1.0);
        const total = paintCost + suppliesCost + laborTotal;
        const diyMaterial = paintCost + suppliesCost * 1.5;
        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-2xl font-bold mb-4">Painting Estimate: $${Math.round(total).toLocaleString()}</h3>
            <div class="bg-white bg-opacity-20 rounded-lg p-4 mb-4"><div class="space-y-2 text-sm">
                <div class="flex justify-between"><span>Paint (${gallonsNeeded} gallons):</span><span>$${Math.round(paintCost).toLocaleString()}</span></div>
                <div class="flex justify-between"><span>Supplies (tape, brushes, etc):</span><span>$${Math.round(suppliesCost)}</span></div>
                <div class="flex justify-between"><span>Labor (${area} sqft, ${coats} coat${coats>1?'s':''}):</span><span>$${Math.round(laborTotal).toLocaleString()}</span></div>
                <hr class="border-white border-opacity-30 my-2">
                <div class="flex justify-between font-bold text-lg"><span>Total Professional:</span><span>$${Math.round(total).toLocaleString()}</span></div>
            </div></div>
            <div class="bg-green-900 bg-opacity-30 rounded-lg p-3">
                <h4 class="font-bold mb-1">🎨 DIY Option</h4>
                <p class="text-sm">DIY Material Cost: <strong>$${Math.round(diyMaterial)}</strong> — Save ~$${Math.round(total-diyMaterial).toLocaleString()} in labor</p>
                <p class="text-sm opacity-80">Expect 3-5x longer than a pro. Worth it if you enjoy painting!</p>
            </div>
        `;
    }
    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('costForm').addEventListener('submit', calculate);
    loadRelatedTools('cost');
})();
