// BTU Calculator - Real HVAC sizing
(function() {
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">BTU Calculator</h2>
            <form id="btuForm" class="space-y-4">
                <div class="input-group">
                    <label>Room Area (sq ft)</label>
                    <input type="number" id="sqft" min="50" value="500" step="10" required>
                </div>
                <div class="input-group">
                    <label>Ceiling Height</label>
                    <select id="ceilingH">
                        <option value="1.0" selected>Standard (8 ft)</option>
                        <option value="1.1">9 ft (+10%)</option>
                        <option value="1.25">10 ft (+25%)</option>
                        <option value="1.5">Cathedral/Vaulted (+50%)</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Climate Zone</label>
                    <select id="climate">
                        <option value="0.8">Cool (Pacific NW, New England)</option>
                        <option value="1.0" selected>Moderate (Mid-Atlantic, Midwest)</option>
                        <option value="1.15">Warm (Southeast, Southern CA)</option>
                        <option value="1.3">Hot (TX, AZ, FL, Deep South)</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Insulation Quality</label>
                    <select id="insulation">
                        <option value="1.2">Poor (old home, no upgrades)</option>
                        <option value="1.0" selected>Average</option>
                        <option value="0.85">Good (newer construction)</option>
                        <option value="0.7">Excellent (energy-efficient)</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Sun Exposure</label>
                    <select id="sun">
                        <option value="0.9">Heavily shaded</option>
                        <option value="1.0" selected>Average</option>
                        <option value="1.1">Very sunny</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Number of Occupants</label>
                    <input type="number" id="people" min="1" max="20" value="2" required>
                </div>
                <button type="submit" class="btn-primary w-full">Calculate BTU</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">What is BTU?</h2>
            <div class="pro-tip mb-6">
                <h4 class="font-bold mb-2">💡 Pro Tip</h4>
                <p>Base rule: 20 BTU per sq ft for cooling. 1 ton AC = 12,000 BTU.</p>
            </div>
            <h3 class="text-2xl font-bold mt-6 mb-3">Common AC Sizes</h3>
            <ul class="list-disc pl-6 space-y-2">
                <li><strong>Window AC:</strong> 5,000 – 25,000 BTU</li>
                <li><strong>Portable AC:</strong> 8,000 – 14,000 BTU</li>
                <li><strong>Mini-split:</strong> 9,000 – 36,000 BTU</li>
                <li><strong>Central AC:</strong> 24,000 – 60,000 BTU (2-5 tons)</li>
            </ul>
        `
    };

    function calculate(e) {
        e.preventDefault();
        const sqft = parseFloat(document.getElementById('sqft').value);
        const ceiling = parseFloat(document.getElementById('ceilingH').value);
        const climate = parseFloat(document.getElementById('climate').value);
        const insulation = parseFloat(document.getElementById('insulation').value);
        const sun = parseFloat(document.getElementById('sun').value);
        const people = parseInt(document.getElementById('people').value);

        let btu = sqft * 20 * ceiling * climate * insulation * sun;
        if (people > 2) btu += (people - 2) * 600;
        btu = Math.ceil(btu / 1000) * 1000;
        const tons = (btu / 12000).toFixed(1);

        let unit = '';
        if (btu <= 8000) unit = 'Small window AC';
        else if (btu <= 14000) unit = 'Large window or portable AC';
        else if (btu <= 24000) unit = 'Mini-split or 2-ton central';
        else if (btu <= 36000) unit = '3-ton central AC';
        else if (btu <= 48000) unit = '4-ton central AC';
        else unit = '5+ ton central AC';

        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-3xl font-bold mb-4">${btu.toLocaleString()} BTU Needed</h3>
            <div class="bg-white bg-opacity-20 rounded-lg p-4">
                <div class="space-y-2">
                    <div class="flex justify-between"><span>Room size:</span><span>${sqft} sq ft</span></div>
                    <div class="flex justify-between"><span>Tonnage:</span><span>${tons} tons</span></div>
                    <div class="border-t border-white pt-2 font-bold"><span>💡 Recommended: ${unit}</span></div>
                </div>
            </div>
        `;
    }

    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('btuForm').addEventListener('submit', calculate);
    loadRelatedTools('utility');
})();
