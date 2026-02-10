// Window Replacement Cost Estimator
(function() {
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Window Replacement Cost Estimator</h2>
            <form id="costForm" class="space-y-4">
                <div class="input-group">
                    <label>Number of Windows</label>
                    <input type="number" id="numWindows" min="1" value="10" step="1" required>
                </div>
                <div class="input-group">
                    <label>Window Type</label>
                    <select id="windowType">
                        <option value="single">Single Hung</option>
                        <option value="double" selected>Double Hung</option>
                        <option value="casement">Casement</option>
                        <option value="sliding">Sliding</option>
                        <option value="bay">Bay/Bow</option>
                        <option value="picture">Picture Window</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Frame Material</label>
                    <select id="frame">
                        <option value="vinyl" selected>Vinyl</option>
                        <option value="fiberglass">Fiberglass</option>
                        <option value="wood">Wood</option>
                        <option value="aluminum">Aluminum</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Glass Type</label>
                    <select id="glass">
                        <option value="double">Double Pane (standard)</option>
                        <option value="lowE" selected>Low-E Coating</option>
                        <option value="triple">Triple Pane</option>
                        <option value="argon">Argon Gas Filled</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Installation Type</label>
                    <select id="installType">
                        <option value="insert" selected>Insert (retrofit)</option>
                        <option value="fullframe">Full Frame Replacement</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary w-full">Calculate Window Cost</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Window Replacement Cost Guide</h2>
            <p class="mb-4">Window replacement costs $300-1,000 per window installed, averaging $500-700. A typical home with 10-15 windows costs $5,000-12,000 for vinyl double-hung, $12,000-20,000+ for wood or fiberglass. Energy-efficient windows recoup 68-73% at resale and save $200-400/year on energy bills.</p>
            <div class="pro-tip mb-6"><h4 class="font-bold">💡 Pro Tip</h4><p>Insert replacement (installing new window within existing frame) is 30-40% cheaper than full-frame but reduces glass area slightly. Full-frame is necessary if frames are rotted or you're changing window size. Get quotes for both methods.</p></div>
            <h3 class="text-2xl font-bold mt-6 mb-3">Window Material Comparison</h3>
            <ul class="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Vinyl:</strong> Most popular. Low-maintenance, affordable. Good insulation. Can't be painted. 20-30 year lifespan</li>
                <li><strong>Fiberglass:</strong> Strongest, best insulation, paintable. 30-50+ years. Expensive but excellent long-term value</li>
                <li><strong>Wood:</strong> Classic beauty, best for historic homes. Requires paint/stain maintenance every 5-10 years. 30+ years with care</li>
                <li><strong>Aluminum:</strong> Lightweight, durable, modern look. Poor insulation. Best for warm climates. 20-30 years</li>
            </ul>
            <h3 class="text-2xl font-bold mt-6 mb-3">Energy Efficiency Features</h3>
            <p class="mb-4">Low-E (low emissivity) coating blocks UV rays and reflects heat, saving 20-30% on energy bills for $50-100 more per window. Argon gas between panes improves insulation for $30-50 more. Triple-pane windows are overkill in most climates — double-pane Low-E offers the best cost/benefit ratio.</p>
        `
    };
    const windowBase = {single:280,double:350,casement:450,sliding:320,bay:1800,picture:400};
    const frameMult = {vinyl:1.0,fiberglass:1.6,wood:1.5,aluminum:0.85};
    const glassAdder = {double:0,lowE:60,triple:150,argon:80};
    const installMult = {insert:1.0,fullframe:1.4};
    function calculate(e) {
        e.preventDefault();
        const num = parseInt(document.getElementById('numWindows').value);
        const winType = document.getElementById('windowType').value;
        const frame = document.getElementById('frame').value;
        const glass = document.getElementById('glass').value;
        const inst = document.getElementById('installType').value;
        const baseWin = windowBase[winType];
        const windowCost = baseWin * frameMult[frame];
        const glassCost = glassAdder[glass];
        const perWindowTotal = (windowCost + glassCost) * installMult[inst];
        const laborPerWin = 150 * installMult[inst];
        const totalPerWin = perWindowTotal + laborPerWin;
        const total = totalPerWin * num;
        const energySavings = (glass === 'lowE' || glass === 'triple' || glass === 'argon') ? 250 : 100;
        const payback = total / energySavings;
        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-2xl font-bold mb-4">Window Estimate: $${Math.round(total).toLocaleString()}</h3>
            <div class="bg-white bg-opacity-20 rounded-lg p-4 mb-4"><div class="space-y-2 text-sm">
                <div class="flex justify-between"><span>Windows (${num} @ $${Math.round(perWindowTotal)}):</span><span>$${Math.round(num*perWindowTotal).toLocaleString()}</span></div>
                <div class="flex justify-between"><span>Installation Labor:</span><span>$${Math.round(num*laborPerWin).toLocaleString()}</span></div>
                <hr class="border-white border-opacity-30 my-2">
                <div class="flex justify-between font-bold text-lg"><span>Total:</span><span>$${Math.round(total).toLocaleString()}</span></div>
                <div class="flex justify-between opacity-80"><span>Per window:</span><span>$${Math.round(totalPerWin).toLocaleString()}</span></div>
            </div></div>
            <div class="bg-green-900 bg-opacity-30 rounded-lg p-3">
                <h4 class="font-bold mb-1">💰 Energy Savings</h4>
                <p class="text-sm">Est. annual energy savings: <strong>$${energySavings}/year</strong></p>
                <p class="text-sm">Payback period: <strong>${payback.toFixed(1)} years</strong></p>
            </div>
        `;
    }
    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('costForm').addEventListener('submit', calculate);
    loadRelatedTools('cost');
})();
