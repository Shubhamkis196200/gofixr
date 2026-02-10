// Ladder Height Calculator
(function() {
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Ladder Height & Safety Calculator</h2>
            <form id="utilityForm" class="space-y-4">
                <div class="input-group">
                    <label>What are you reaching? Height from ground (feet)</label>
                    <input type="number" id="reachHeight" min="4" max="60" value="20" step="0.5" required>
                </div>
                <div class="input-group">
                    <label>Task Type</label>
                    <select id="taskType">
                        <option value="gutter">Gutter Cleaning/Repair</option>
                        <option value="roof">Roof Access</option>
                        <option value="paint">Exterior Painting</option>
                        <option value="window">Window Cleaning</option>
                        <option value="tree">Tree Trimming</option>
                        <option value="lights">Holiday Lights/Fixtures</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Surface Leaning Against</label>
                    <select id="surface">
                        <option value="wall">Flat Wall (siding/brick)</option>
                        <option value="gutter">Gutter Edge</option>
                        <option value="none">Freestanding (A-frame)</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Ground Surface</label>
                    <select id="ground">
                        <option value="concrete">Concrete/Paved</option>
                        <option value="grass">Grass/Soft Ground</option>
                        <option value="gravel">Gravel</option>
                        <option value="slope">Sloped Surface</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary w-full">Calculate Ladder Needs</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Ladder Safety: The Complete Guide</h2>
            <p class="mb-4">Falls from ladders cause over 500,000 injuries and 300 deaths annually in the United States, making ladder safety one of the most critical topics for any DIYer or homeowner. Choosing the right ladder size, setting it up at the correct angle, and following basic safety rules can prevent the vast majority of these accidents.</p>

            <div class="pro-tip mb-6">
                <h4 class="font-bold">💡 The 4-to-1 Rule</h4>
                <p>For every 4 feet of ladder height to the upper support point, place the base 1 foot away from the wall. A ladder reaching 20 feet should have its base 5 feet from the wall. This creates the optimal 75.5° angle for stability and safety.</p>
            </div>

            <h3 class="text-2xl font-bold mt-6 mb-3">Ladder Types & Maximum Heights</h3>
            <ul class="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Step Ladder (A-frame):</strong> 4-14 ft. Best for indoor work, ceilings, painting. Never stand on top 2 rungs</li>
                <li><strong>Extension Ladder:</strong> 16-40 ft. For exterior work — gutters, roofing, siding. Must extend 3 ft above landing point</li>
                <li><strong>Multi-Position Ladder:</strong> Configurable as step, extension, or scaffold. Versatile for homeowners</li>
                <li><strong>Telescoping Ladder:</strong> Compact storage, extends to 12-26 ft. Good for occasional use</li>
            </ul>

            <h3 class="text-2xl font-bold mt-6 mb-3">Weight Ratings</h3>
            <ul class="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Type III (200 lbs):</strong> Light household use only</li>
                <li><strong>Type II (225 lbs):</strong> Medium-duty DIY — most homeowners</li>
                <li><strong>Type I (250 lbs):</strong> Heavy-duty — recommended if you carry tools</li>
                <li><strong>Type IA (300 lbs):</strong> Extra heavy-duty — professional use</li>
            </ul>
            <p class="mb-4">Remember: the weight rating must cover your body weight PLUS all tools and materials you carry. A 180 lb person carrying 30 lbs of tools needs at least a Type I (250 lb) ladder.</p>

            <h3 class="text-2xl font-bold mt-6 mb-3">Critical Safety Rules</h3>
            <ul class="list-disc pl-6 space-y-2 mb-4">
                <li>Inspect the ladder before every use — check for bent rails, loose rungs, worn feet</li>
                <li>Maintain 3 points of contact at all times (two hands + one foot, or two feet + one hand)</li>
                <li>Never lean sideways — keep your belt buckle between the side rails</li>
                <li>Set up on firm, level ground. Use leg levelers on slopes, never stack on blocks</li>
                <li>Keep metal ladders away from power lines — maintain at least 10 feet clearance</li>
            </ul>
        `
    };

    function calculate(e) {
        e.preventDefault();
        const reach = parseFloat(document.getElementById('reachHeight').value);
        const task = document.getElementById('taskType').value;
        const surface = document.getElementById('surface').value;
        const ground = document.getElementById('ground').value;

        let ladderType, minLadder, baseDistance, warnings = [], tips = [];

        if (surface === 'none' || reach <= 12) {
            ladderType = 'Step Ladder (A-frame)';
            minLadder = Math.ceil(reach + 4); // can't stand on top 2 rungs, so need 4ft extra
            baseDistance = 0;
            if (reach > 14) { warnings.push('⚠️ Step ladders max out at ~14 ft reach. You need an extension ladder.'); ladderType = 'Extension Ladder'; minLadder = Math.ceil(reach + 3); baseDistance = Math.round(reach / 4); }
        } else {
            ladderType = 'Extension Ladder';
            minLadder = Math.ceil(reach + 3); // must extend 3ft above contact point
            baseDistance = Math.round(reach / 4); // 4:1 rule
        }

        // Round up to standard sizes
        const stdSizes = [6,8,10,12,14,16,20,24,28,32,36,40];
        const recLadder = stdSizes.find(s => s >= minLadder) || stdSizes[stdSizes.length-1];

        if (reach > 32) warnings.push('⚠️ Heights above 32 feet are dangerous for DIY. Consider hiring a professional with proper equipment.');
        if (ground === 'slope') warnings.push('⚠️ Sloped surfaces are high-risk. Use ladder levelers or consider scaffolding.');
        if (ground === 'grass') tips.push('Use a wide board under the ladder feet to prevent sinking into soft ground.');
        if (ground === 'gravel') tips.push('Clear a flat area down to firm ground before placing the ladder on gravel.');
        if (task === 'roof') { tips.push('Extension ladder must extend at least 3 feet above the roof edge for safe roof access.'); tips.push('Consider roof brackets for extended roof work.'); }
        if (task === 'gutter') tips.push('Use a ladder standoff/stabilizer to avoid crushing gutters and improve stability.');
        if (task === 'tree') warnings.push('⚠️ Never lean a ladder against a tree branch. Use a freestanding orchard ladder or hire an arborist.');
        if (task === 'paint') tips.push('Use a paint hook to hang your bucket from the ladder instead of holding it.');

        const weightRec = task === 'tree' || task === 'roof' ? 'Type I (250 lbs) — you\'ll carry tools' : 'Type II (225 lbs) minimum';

        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-2xl font-bold mb-4">Ladder Recommendation</h3>
            <div class="bg-white bg-opacity-20 rounded-lg p-4 mb-4">
                <div class="space-y-2">
                    <div class="flex justify-between"><span>Target Height:</span><span class="font-bold">${reach} feet</span></div>
                    <div class="flex justify-between"><span>Ladder Type:</span><span class="font-bold">${ladderType}</span></div>
                    <div class="flex justify-between"><span>Minimum Ladder Size:</span><span class="font-bold">${recLadder} feet</span></div>
                    ${baseDistance > 0 ? `<div class="flex justify-between"><span>Base Distance from Wall:</span><span class="font-bold">${baseDistance} feet</span></div>` : ''}
                    <div class="flex justify-between"><span>Weight Rating:</span><span class="font-bold">${weightRec}</span></div>
                </div>
            </div>
            ${warnings.length > 0 ? `<div class="bg-red-900 bg-opacity-40 rounded-lg p-3 mb-3">${warnings.map(w=>`<p class="text-sm mb-1">${w}</p>`).join('')}</div>` : ''}
            ${tips.length > 0 ? `<div class="bg-blue-900 bg-opacity-40 rounded-lg p-3"><h4 class="font-bold mb-1">Tips for Your Task</h4>${tips.map(t=>`<p class="text-sm mb-1">• ${t}</p>`).join('')}</div>` : ''}
        `;
    }

    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('utilityForm').addEventListener('submit', calculate);
    loadRelatedTools('utility');
})();
