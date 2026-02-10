// Window Replacement Cost Estimator — per-window breakdown with frame, glass, and gas options
(function() {
    const windowTypes = {
        single:   { name: 'Single Hung', baseLow: 200, baseHigh: 450 },
        double:   { name: 'Double Hung', baseLow: 300, baseHigh: 600 },
        casement: { name: 'Casement', baseLow: 300, baseHigh: 700 },
        sliding:  { name: 'Sliding', baseLow: 250, baseHigh: 550 },
        bay:      { name: 'Bay/Bow', baseLow: 1200, baseHigh: 3500 },
        picture:  { name: 'Picture', baseLow: 250, baseHigh: 800 }
    };
    const frameMaterials = {
        vinyl:     { name: 'Vinyl (most popular)', mult: 1.0, lifespan: '20-30 yr', rValue: 'Good' },
        wood:      { name: 'Wood (classic)', mult: 1.4, lifespan: '30+ yr', rValue: 'Best' },
        fiberglass:{ name: 'Fiberglass (premium)', mult: 1.5, lifespan: '40+ yr', rValue: 'Excellent' },
        aluminum:  { name: 'Aluminum (modern)', mult: 1.1, lifespan: '25-35 yr', rValue: 'Poor' },
        composite: { name: 'Composite (low maint.)', mult: 1.3, lifespan: '30+ yr', rValue: 'Good' }
    };
    const glassOptions = {
        double: { name: 'Double-Pane', mult: 1.0 },
        triple: { name: 'Triple-Pane', mult: 1.3 },
        lowE:   { name: 'Double + Low-E Coating', mult: 1.1 },
        lowE3:  { name: 'Triple + Low-E', mult: 1.45 }
    };
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Window Replacement Cost Estimator</h2>
            <form id="costForm" class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div class="input-group"><label>Number of Windows</label><input type="number" id="numWin" min="1" value="10" required></div>
                    <div class="input-group"><label>Window Type</label>
                        <select id="winType"><option value="single">Single Hung</option><option value="double" selected>Double Hung</option><option value="casement">Casement</option><option value="sliding">Sliding</option><option value="bay">Bay/Bow</option><option value="picture">Picture</option></select>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="input-group"><label>Frame Material</label>
                        <select id="frame"><option value="vinyl" selected>Vinyl (most popular)</option><option value="wood">Wood</option><option value="fiberglass">Fiberglass</option><option value="aluminum">Aluminum</option><option value="composite">Composite</option></select>
                    </div>
                    <div class="input-group"><label>Glass Type</label>
                        <select id="glass"><option value="double">Double-Pane (standard)</option><option value="lowE" selected>Double + Low-E Coating</option><option value="triple">Triple-Pane</option><option value="lowE3">Triple + Low-E (best)</option></select>
                    </div>
                </div>
                <div class="input-group"><label>Installation Type</label>
                    <select id="installType"><option value="retrofit" selected>Retrofit/Insert (keeps frame, $150-300 labor)</option><option value="fullFrame">Full-Frame (replace everything, $300-600 labor)</option></select>
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <label class="flex items-center gap-2"><input type="checkbox" id="disposal" checked> Old window disposal ($25-50/ea)</label>
                    <label class="flex items-center gap-2"><input type="checkbox" id="screens"> New screens ($30-60/ea)</label>
                </div>
                <button type="submit" class="btn-primary w-full">Calculate Window Cost</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Window Replacement Guide</h2>
            <p class="mb-4">Replacing windows costs $400-$1,200 per window installed, or $4,000-$15,000+ for a whole house. The biggest factors are frame material, glass type, and whether you need retrofit or full-frame installation.</p>
            <div class="pro-tip mb-6"><h4 class="font-bold">💡 Energy Savings Reality Check</h4><p>New double-pane Low-E windows save about $125-$340/year on heating/cooling for an average home. With a $10,000 window project, payback is 30+ years on energy alone. The real ROI comes from comfort, noise reduction, and 70-80% cost recoup at resale. Don't let a salesman tell you windows "pay for themselves" in energy savings.</p></div>
            <h3 class="text-2xl font-bold mt-6 mb-3">Retrofit vs. Full-Frame</h3>
            <ul class="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Retrofit (insert):</strong> New window inserts into existing frame. Faster (30-60 min/window), cheaper, less mess. Best when existing frames are in good condition.</li>
                <li><strong>Full-frame:</strong> Everything removed to studs and replaced. Required when frames are rotted. Allows changing window size. Takes 2-4 hours per window. Requires exterior trim work.</li>
            </ul>
            <h3 class="text-2xl font-bold mt-6 mb-3">Frame Material Comparison</h3>
            <ul class="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Vinyl:</strong> 70% of replacements. Lowest cost, no painting, good insulation. Can warp in extreme heat.</li>
                <li><strong>Wood:</strong> Best insulator, classic look, paintable. Requires maintenance. Interior wood + exterior aluminum cladding is the premium choice.</li>
                <li><strong>Fiberglass:</strong> Strongest, most durable, paintable. 50% more than vinyl but lasts longer. Won't warp or crack.</li>
            </ul>
        `
    };
    function calculate(e) {
        e.preventDefault();
        const num = parseInt(document.getElementById('numWin').value);
        const wt = windowTypes[document.getElementById('winType').value];
        const fm = frameMaterials[document.getElementById('frame').value];
        const gl = glassOptions[document.getElementById('glass').value];
        const install = document.getElementById('installType').value;
        const disposal = document.getElementById('disposal').checked;
        const screens = document.getElementById('screens').checked;
        const winLow = wt.baseLow * fm.mult * gl.mult;
        const winHigh = wt.baseHigh * fm.mult * gl.mult;
        const laborPer = install === 'retrofit' ? [150, 300] : [300, 600];
        const disposalPer = disposal ? 35 : 0;
        const screenPer = screens ? 45 : 0;
        const perWinLow = winLow + laborPer[0] + disposalPer + screenPer;
        const perWinHigh = winHigh + laborPer[1] + disposalPer + screenPer;
        const totalLow = Math.round(perWinLow * num);
        const totalHigh = Math.round(perWinHigh * num);
        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-3xl font-bold mb-4">$${totalLow.toLocaleString()} – $${totalHigh.toLocaleString()}</h3>
            <div class="bg-white bg-opacity-20 rounded-lg p-4"><div class="space-y-2">
                <div class="flex justify-between"><span>Windows:</span><span>${num} × ${wt.name}</span></div>
                <div class="flex justify-between"><span>Window cost each:</span><span>$${Math.round(winLow)} – $${Math.round(winHigh)}</span></div>
                <div class="flex justify-between"><span>Install labor each:</span><span>$${laborPer[0]} – $${laborPer[1]}</span></div>
                <div class="flex justify-between"><span>Frame:</span><span>${fm.name} (${fm.lifespan})</span></div>
                <div class="flex justify-between"><span>Glass:</span><span>${gl.name}</span></div>
                ${disposal ? `<div class="flex justify-between"><span>Disposal:</span><span>$${disposalPer}/ea</span></div>` : ''}
                ${screens ? `<div class="flex justify-between"><span>Screens:</span><span>$${screenPer}/ea</span></div>` : ''}
                <hr class="border-white border-opacity-30 my-2">
                <div class="flex justify-between"><span>Per window:</span><span>$${Math.round(perWinLow)} – $${Math.round(perWinHigh)}</span></div>
                <div class="flex justify-between font-bold text-lg"><span>Total (${num} windows):</span><span>$${totalLow.toLocaleString()} – $${totalHigh.toLocaleString()}</span></div>
                <div class="text-sm mt-2 opacity-80">Est. annual energy savings: $${Math.round(num * 20)}-$${Math.round(num * 35)}/yr</div>
            </div></div>
        `;
    }
    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('costForm').addEventListener('submit', calculate);
    loadRelatedTools('cost');
})();