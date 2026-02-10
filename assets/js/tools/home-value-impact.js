// Home Value Impact Calculator
(function() {
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Home Value Impact Calculator</h2>
            <form id="utilityForm" class="space-y-4">
                <div class="input-group">
                    <label>Current Home Value ($)</label>
                    <input type="number" id="homeValue" min="50000" value="350000" step="10000" required>
                </div>
                <div class="input-group">
                    <label>Renovation Project</label>
                    <select id="project">
                        <option value="kitchen">Kitchen Remodel</option>
                        <option value="bathroom">Bathroom Remodel</option>
                        <option value="deck">Deck Addition</option>
                        <option value="roof">New Roof</option>
                        <option value="siding">Siding Replacement</option>
                        <option value="windows">Window Replacement</option>
                        <option value="garage">Garage Door Replacement</option>
                        <option value="entry">Entry Door Replacement</option>
                        <option value="landscape">Landscaping</option>
                        <option value="basement">Basement Finishing</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Project Budget ($)</label>
                    <input type="number" id="budget" min="500" value="25000" step="500" required>
                </div>
                <div class="input-group">
                    <label>Scope of Work</label>
                    <select id="scope">
                        <option value="minor">Minor Update (cosmetic refresh)</option>
                        <option value="mid" selected>Mid-Range (functional upgrade)</option>
                        <option value="major">Major Renovation (structural/high-end)</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary w-full">Calculate ROI</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Understanding Home Renovation ROI</h2>
            <p class="mb-4">Not every home improvement adds equal value. Understanding which projects deliver the best return on investment (ROI) can help you prioritize renovations, especially if you're planning to sell within a few years. This calculator uses data from national remodeling cost vs. value studies to estimate your potential return.</p>
            
            <div class="pro-tip mb-6">
                <h4 class="font-bold">💡 Pro Tip</h4>
                <p>Exterior projects typically deliver higher ROI than interior ones. Garage door replacement, manufactured stone veneer, and entry door replacement consistently rank as top ROI projects nationally, often recouping 90%+ of their cost at resale.</p>
            </div>
            
            <h3 class="text-2xl font-bold mt-6 mb-3">Average ROI by Project Type</h3>
            <ul class="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Garage Door Replacement:</strong> 93-97% ROI — best bang for your buck</li>
                <li><strong>Manufactured Stone Veneer:</strong> 91-96% ROI</li>
                <li><strong>Minor Kitchen Remodel:</strong> 72-81% ROI</li>
                <li><strong>Siding Replacement:</strong> 68-76% ROI</li>
                <li><strong>Window Replacement:</strong> 67-73% ROI</li>
                <li><strong>Deck Addition:</strong> 63-72% ROI</li>
                <li><strong>Bathroom Remodel:</strong> 58-70% ROI</li>
                <li><strong>Major Kitchen Remodel:</strong> 54-62% ROI — beware of over-improving</li>
                <li><strong>Basement Finishing:</strong> 50-65% ROI</li>
            </ul>
            
            <h3 class="text-2xl font-bold mt-6 mb-3">Factors That Affect Your Return</h3>
            <p class="mb-4">Your actual ROI depends heavily on your local real estate market, the quality of work, and whether the improvement fits the neighborhood. Over-improving beyond what's typical for your area (e.g., installing a $100K kitchen in a $200K neighborhood) will reduce your percentage return. Conversely, fixing clear deficiencies (a failing roof, outdated kitchen) removes buyer objections and can help sell faster, even if the dollar-for-dollar return is modest.</p>
            
            <h3 class="text-2xl font-bold mt-6 mb-3">When ROI Shouldn't Be Your Only Metric</h3>
            <p class="mb-4">If you plan to stay in your home for 10+ years, personal enjoyment matters more than resale value. A kitchen you love using every day has value beyond what shows up in an appraisal. Balance financial returns with quality of life when making renovation decisions.</p>
        `
    };

    const roiData = {
        kitchen:   {minor:0.78, mid:0.72, major:0.57},
        bathroom:  {minor:0.70, mid:0.64, major:0.56},
        deck:      {minor:0.72, mid:0.68, major:0.60},
        roof:      {minor:0.65, mid:0.61, major:0.58},
        siding:    {minor:0.76, mid:0.72, major:0.65},
        windows:   {minor:0.73, mid:0.69, major:0.62},
        garage:    {minor:0.97, mid:0.94, major:0.88},
        entry:     {minor:0.91, mid:0.85, major:0.78},
        landscape: {minor:0.80, mid:0.70, major:0.55},
        basement:  {minor:0.65, mid:0.58, major:0.50}
    };

    function calculate(e) {
        e.preventDefault();
        const homeValue = parseFloat(document.getElementById('homeValue').value);
        const project = document.getElementById('project').value;
        const budget = parseFloat(document.getElementById('budget').value);
        const scope = document.getElementById('scope').value;
        
        const roi = roiData[project][scope];
        const valueAdded = budget * roi;
        const netReturn = valueAdded - budget;
        const newValue = homeValue + valueAdded;
        const percentIncrease = (valueAdded / homeValue * 100);
        
        const projectNames = {kitchen:'Kitchen Remodel',bathroom:'Bathroom Remodel',deck:'Deck Addition',roof:'New Roof',siding:'Siding Replacement',windows:'Window Replacement',garage:'Garage Door',entry:'Entry Door',landscape:'Landscaping',basement:'Basement Finishing'};
        const verdict = roi >= 0.80 ? '🟢 Excellent ROI — highly recommended' : roi >= 0.65 ? '🟡 Good ROI — solid investment' : roi >= 0.55 ? '🟠 Moderate ROI — consider carefully' : '🔴 Low ROI — prioritize personal enjoyment';
        
        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-2xl font-bold mb-4">${projectNames[project]} — Value Impact</h3>
            <div class="bg-white bg-opacity-20 rounded-lg p-4 mb-4">
                <div class="space-y-2">
                    <div class="flex justify-between"><span>Project Cost:</span><span class="font-bold">$${budget.toLocaleString()}</span></div>
                    <div class="flex justify-between"><span>Estimated Value Added:</span><span class="font-bold text-green-300">$${Math.round(valueAdded).toLocaleString()}</span></div>
                    <div class="flex justify-between"><span>Net Return:</span><span class="font-bold ${netReturn>=0?'text-green-300':'text-red-300'}">$${Math.round(netReturn).toLocaleString()}</span></div>
                    <div class="flex justify-between"><span>ROI:</span><span class="font-bold">${(roi*100).toFixed(0)}%</span></div>
                    <hr class="border-white border-opacity-30 my-2">
                    <div class="flex justify-between"><span>New Est. Home Value:</span><span class="font-bold">$${Math.round(newValue).toLocaleString()}</span></div>
                    <div class="flex justify-between"><span>Value Increase:</span><span class="font-bold">${percentIncrease.toFixed(1)}%</span></div>
                </div>
            </div>
            <p class="text-lg font-bold">${verdict}</p>
            <p class="text-sm mt-2 opacity-80">Based on national Cost vs. Value data. Actual returns vary by market, contractor quality, and neighborhood comps.</p>
        `;
    }

    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('utilityForm').addEventListener('submit', calculate);
    loadRelatedTools('utility');
})();
