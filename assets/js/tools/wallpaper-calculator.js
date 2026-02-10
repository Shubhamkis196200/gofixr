// Wallpaper Calculator - Real wallpaper estimation with pattern repeat
(function() {
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Wallpaper Calculator</h2>
            <p class="text-gray-600 mb-4">Calculate how many rolls you need based on room dimensions, openings, and pattern repeat.</p>
            <form id="planningForm" class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div class="input-group">
                        <label>Room Length (ft)</label>
                        <input type="number" id="roomLength" min="1" value="14" step="0.5" required>
                    </div>
                    <div class="input-group">
                        <label>Room Width (ft)</label>
                        <input type="number" id="roomWidth" min="1" value="12" step="0.5" required>
                    </div>
                </div>
                <div class="input-group">
                    <label>Ceiling Height (ft)</label>
                    <input type="number" id="ceilingHeight" min="6" value="8" step="0.5" required>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="input-group">
                        <label>Number of Doors</label>
                        <input type="number" id="doors" min="0" value="1" step="1">
                    </div>
                    <div class="input-group">
                        <label>Number of Windows</label>
                        <input type="number" id="windows" min="0" value="2" step="1">
                    </div>
                </div>
                <div class="input-group">
                    <label>Roll Size</label>
                    <select id="rollSize">
                        <option value="us">US Standard (27" × 27 ft = ~60 sq ft)</option>
                        <option value="euro">Euro Double (20.5" × 33 ft = ~56 sq ft)</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Pattern Repeat</label>
                    <select id="patternRepeat">
                        <option value="0">None (solid / random match)</option>
                        <option value="6">Small (6")</option>
                        <option value="12">Medium (12")</option>
                        <option value="21">Large (21"+)</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary w-full">Calculate Rolls Needed</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Wallpaper Buying Guide</h2>
            <div class="pro-tip mb-6">
                <h4 class="font-bold mb-2">💡 Pro Tip</h4>
                <p>Always order 1-2 extra rolls from the same dye lot. Pattern batches vary — you can't easily match later.</p>
            </div>
            <h3 class="text-2xl font-bold mt-6 mb-3">Understanding Pattern Repeat</h3>
            <p class="mb-3">Pattern repeat is the vertical distance before the design repeats. Larger repeats mean more waste per strip because you must align the pattern across strips.</p>
            <ul class="list-disc pl-6 space-y-2">
                <li><strong>Straight match:</strong> Same pattern at the same height on each strip</li>
                <li><strong>Drop match:</strong> Every other strip is offset by half the repeat — uses even more wallpaper</li>
                <li><strong>Random match:</strong> No matching needed (grasscloth, solids) — least waste</li>
            </ul>
            <h3 class="text-2xl font-bold mt-6 mb-3">Standard Deductions</h3>
            <ul class="list-disc pl-6 space-y-2">
                <li>Standard door: ~21 sq ft (3' × 7')</li>
                <li>Standard window: ~12 sq ft (3' × 4')</li>
                <li>Don't deduct for partial openings — you'll need the strip anyway</li>
            </ul>
        `
    };

    function calculate(e) {
        e.preventDefault();
        const length = parseFloat(document.getElementById('roomLength').value);
        const width = parseFloat(document.getElementById('roomWidth').value);
        const height = parseFloat(document.getElementById('ceilingHeight').value);
        const doors = parseInt(document.getElementById('doors').value) || 0;
        const windows = parseInt(document.getElementById('windows').value) || 0;
        const rollType = document.getElementById('rollSize').value;
        const patternRepeat = parseFloat(document.getElementById('patternRepeat').value);

        const perimeter = 2 * (length + width);
        const grossWallArea = perimeter * height;
        const doorArea = doors * 21; // 3x7 ft
        const windowArea = windows * 12; // 3x4 ft
        const netWallArea = grossWallArea - doorArea - windowArea;

        // Roll specs
        let rollWidth, rollLength, rollCoverage, rollLabel;
        if (rollType === 'euro') {
            rollWidth = 20.5 / 12; // ft
            rollLength = 33; // ft
            rollCoverage = 56;
            rollLabel = 'Euro Double (20.5" × 33 ft)';
        } else {
            rollWidth = 27 / 12; // ft
            rollLength = 27; // ft
            rollCoverage = 60;
            rollLabel = 'US Standard (27" × 27 ft)';
        }

        // Usable strip height accounting for pattern repeat
        let usableStripHeight = height;
        if (patternRepeat > 0) {
            const repeatFt = patternRepeat / 12;
            usableStripHeight = Math.ceil(height / repeatFt) * repeatFt;
        }
        // Add 4 inches for trimming top/bottom
        const cutLength = usableStripHeight + (4/12);

        const stripsPerRoll = Math.floor(rollLength / cutLength);
        const stripsNeeded = Math.ceil(perimeter / rollWidth);
        const rollsNeeded = Math.ceil(stripsNeeded / stripsPerRoll);
        const recommended = rollsNeeded + 1; // +1 safety

        const wastePercent = ((recommended * rollCoverage - netWallArea) / (recommended * rollCoverage) * 100).toFixed(0);

        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-3xl font-bold mb-4">You Need: ${recommended} Rolls</h3>
            <p class="text-sm mb-4 opacity-80">(${rollsNeeded} calculated + 1 extra for safety)</p>
            <div class="bg-white bg-opacity-20 rounded-lg p-4">
                <div class="space-y-2">
                    <div class="flex justify-between"><span>Wall perimeter:</span><span>${perimeter.toFixed(1)} ft</span></div>
                    <div class="flex justify-between"><span>Gross wall area:</span><span>${grossWallArea.toFixed(0)} sq ft</span></div>
                    <div class="flex justify-between"><span>Deductions (${doors}D + ${windows}W):</span><span>−${(doorArea + windowArea)} sq ft</span></div>
                    <div class="flex justify-between"><span>Net wall area:</span><span>${netWallArea.toFixed(0)} sq ft</span></div>
                    <div class="border-t border-white border-opacity-30 my-2 pt-2"></div>
                    <div class="flex justify-between"><span>Roll type:</span><span>${rollLabel}</span></div>
                    <div class="flex justify-between"><span>Cut length per strip:</span><span>${cutLength.toFixed(1)} ft${patternRepeat > 0 ? ' (incl. pattern repeat)' : ''}</span></div>
                    <div class="flex justify-between"><span>Strips per roll:</span><span>${stripsPerRoll}</span></div>
                    <div class="flex justify-between"><span>Total strips needed:</span><span>${stripsNeeded}</span></div>
                    <div class="flex justify-between"><span>Waste factor:</span><span>~${wastePercent}%</span></div>
                </div>
            </div>
        `;
    }

    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('planningForm').addEventListener('submit', calculate);
    loadRelatedTools('planning');
})();
