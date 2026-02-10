// Plumbing Repair Cost Estimator — detailed breakdown by fixture type with parts vs labor
(function() {
    const repairs = {
        faucet:       { name: 'Faucet Repair/Replace', labor: [100, 250], parts: [50, 300], time: '1-2 hrs', difficulty: 'Easy' },
        toilet:       { name: 'Toilet Repair', labor: [100, 200], parts: [15, 100], time: '1 hr', difficulty: 'Easy' },
        toiletReplace:{ name: 'Toilet Replacement', labor: [150, 350], parts: [150, 600], time: '2-3 hrs', difficulty: 'Medium' },
        drain:        { name: 'Drain Clog/Cleaning', labor: [100, 300], parts: [0, 50], time: '1-2 hrs', difficulty: 'Easy' },
        leak:         { name: 'Pipe Leak Repair', labor: [150, 400], parts: [20, 150], time: '1-3 hrs', difficulty: 'Medium' },
        waterHeater:  { name: 'Water Heater Repair', labor: [200, 500], parts: [50, 400], time: '2-4 hrs', difficulty: 'Medium' },
        sewer:        { name: 'Main Sewer Line Issue', labor: [500, 3000], parts: [100, 1000], time: '4-8 hrs', difficulty: 'Hard' },
        repipe:       { name: 'Pipe Replacement (section)', labor: [300, 800], parts: [100, 500], time: '3-6 hrs', difficulty: 'Hard' },
        fixture:      { name: 'Install New Fixture', labor: [150, 400], parts: [100, 800], time: '2-4 hrs', difficulty: 'Medium' },
        disposal:     { name: 'Garbage Disposal Replace', labor: [150, 350], parts: [100, 400], time: '1-2 hrs', difficulty: 'Medium' },
        shower:       { name: 'Shower Valve Repair', labor: [200, 600], parts: [100, 400], time: '2-4 hrs', difficulty: 'Hard' }
    };
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Plumbing Repair Cost Estimator</h2>
            <form id="costForm" class="space-y-4">
                <div class="input-group"><label>Type of Repair</label>
                    <select id="repair"><option value="faucet">Faucet Repair/Replace</option><option value="toilet" selected>Toilet Repair</option><option value="toiletReplace">Toilet Replacement</option><option value="drain">Drain Clog/Cleaning</option><option value="leak">Pipe Leak Repair</option><option value="waterHeater">Water Heater Repair</option><option value="sewer">Main Sewer Line Issue</option><option value="repipe">Pipe Replacement (section)</option><option value="fixture">Install New Fixture</option><option value="disposal">Garbage Disposal Replace</option><option value="shower">Shower Valve Repair</option></select>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="input-group"><label>Time of Day</label>
                        <select id="timeOfDay"><option value="1.0" selected>Normal Hours (8am-5pm)</option><option value="1.5">After Hours (5pm-10pm)</option><option value="2.0">Emergency (nights/weekends)</option></select>
                    </div>
                    <div class="input-group"><label>Your Location</label>
                        <select id="location"><option value="0.85">Rural / Low COL</option><option value="1.0" selected>Suburban</option><option value="1.25">Urban</option><option value="1.5">Major Metro (NYC, SF, LA)</option></select>
                    </div>
                </div>
                <div class="input-group"><label><input type="checkbox" id="emergency"> Emergency/Same-Day Service</label></div>
                <button type="submit" class="btn-primary w-full">Calculate Repair Cost</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Plumbing Repair Cost Guide</h2>
            <p class="mb-4">Most plumbing repairs cost $150-$500. Service call fees ($50-$150) are common and often waived if you hire them for the repair. Emergency/after-hours service costs 1.5-2× the normal rate. Always get a written estimate before work begins.</p>
            <div class="pro-tip mb-6"><h4 class="font-bold">💡 Pro Tip</h4><p>A slow drip wastes 15-20 gallons/day and costs ~$50/year. A running toilet wastes 200 gallons/day ($200+/year). Most leaks are DIY-fixable in 30 minutes with a $5-20 part from the hardware store. Try the DIY fix first — if you can't solve it in an hour, call a plumber.</p></div>
            <h3 class="text-2xl font-bold mt-6 mb-3">When to Call a Plumber Immediately</h3>
            <ul class="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Gas line issues:</strong> If you smell gas, evacuate and call the gas company + a licensed plumber</li>
                <li><strong>Main line backups:</strong> Sewage backing up into multiple drains = main sewer line issue</li>
                <li><strong>No hot water (winter):</strong> A water heater failure in winter is an emergency</li>
                <li><strong>Burst pipe:</strong> Turn off main water valve immediately, call emergency plumber</li>
                <li><strong>Major leak:</strong> If you can't stop the water flow, it's an emergency</li>
            </ul>
            <h3 class="text-2xl font-bold mt-6 mb-3">Common DIY Fixes</h3>
            <ul class="list-disc pl-6 space-y-2">
                <li><strong>Running toilet:</strong> 90% of the time it's a $5 flapper. 5-minute fix.</li>
                <li><strong>Dripping faucet:</strong> Replace cartridge or O-ring. $10-30 part, 30-min job.</li>
                <li><strong>Clogged drain:</strong> Try a plunger first, then a $15 drain snake before calling a pro.</li>
                <li><strong>Low water pressure:</strong> Clean aerator screens on faucets (unscrew, rinse, reassemble).</li>
            </ul>
        `
    };
    function calculate(e) {
        e.preventDefault();
        const repairKey = document.getElementById('repair').value;
        const r = repairs[repairKey];
        const timeOfDay = parseFloat(document.getElementById('timeOfDay').value);
        const location = parseFloat(document.getElementById('location').value);
        const emergency = document.getElementById('emergency').checked ? 1.25 : 1.0;
        const laborLow = Math.round(r.labor[0] * timeOfDay * location * emergency);
        const laborHigh = Math.round(r.labor[1] * timeOfDay * location * emergency);
        const partsLow = r.parts[0];
        const partsHigh = r.parts[1];
        const totalLow = laborLow + partsLow;
        const totalHigh = laborHigh + partsHigh;
        const tripCharge = timeOfDay > 1.0 || emergency > 1.0 ? 100 : 75;
        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-3xl font-bold mb-4">$${totalLow.toLocaleString()} – $${totalHigh.toLocaleString()}</h3>
            <div class="bg-white bg-opacity-20 rounded-lg p-4"><div class="space-y-2">
                <div class="flex justify-between"><span>Repair type:</span><span>${r.name}</span></div>
                <div class="flex justify-between"><span>Labor:</span><span>$${laborLow.toLocaleString()} – $${laborHigh.toLocaleString()}</span></div>
                <div class="flex justify-between"><span>Parts/Materials:</span><span>$${partsLow} – $${partsHigh}</span></div>
                <div class="flex justify-between"><span>Service call fee:</span><span>~$${tripCharge} (often waived)</span></div>
                <hr class="border-white border-opacity-30 my-2">
                <div class="flex justify-between font-bold text-lg"><span>Total estimate:</span><span>$${totalLow.toLocaleString()} – $${totalHigh.toLocaleString()}</span></div>
                <div class="text-sm mt-2 opacity-80">Time: ${r.time} | DIY Difficulty: ${r.difficulty}</div>
            </div></div>
        `;
    }
    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('costForm').addEventListener('submit', calculate);
    loadRelatedTools('cost');
})();