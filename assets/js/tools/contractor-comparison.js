// Contractor Comparison Tool
(function() {
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Contractor Comparison Tool</h2>
            <p class="text-gray-600 mb-4">Compare up to 3 contractors side-by-side. Rate each on key factors to find the best fit for your project.</p>
            <form id="planningForm" class="space-y-6">
                <div class="input-group">
                    <label>What weights matter most to you?</label>
                    <div class="grid grid-cols-2 gap-2 text-sm mt-2">
                        <div class="flex items-center gap-2"><label>Price:</label><select id="wPrice" class="flex-1"><option value="3">High</option><option value="2" selected>Medium</option><option value="1">Low</option></select></div>
                        <div class="flex items-center gap-2"><label>Reviews:</label><select id="wReviews" class="flex-1"><option value="3">High</option><option value="2" selected>Medium</option><option value="1">Low</option></select></div>
                        <div class="flex items-center gap-2"><label>Experience:</label><select id="wExp" class="flex-1"><option value="3">High</option><option value="2" selected>Medium</option><option value="1">Low</option></select></div>
                        <div class="flex items-center gap-2"><label>Credentials:</label><select id="wCred" class="flex-1"><option value="3">High</option><option value="2" selected>Medium</option><option value="1">Low</option></select></div>
                    </div>
                </div>
                ${[1,2,3].map(i => `
                <div class="bg-gray-50 rounded-lg p-4">
                    <h3 class="font-bold mb-3">Contractor ${i}</h3>
                    <div class="space-y-2">
                        <div class="input-group"><label>Name</label><input type="text" id="name${i}" placeholder="Company name" value="${i===1?'Example Builders':''}"></div>
                        <div class="grid grid-cols-2 gap-2">
                            <div class="input-group"><label>Quote ($)</label><input type="number" id="price${i}" min="0" placeholder="Total bid"></div>
                            <div class="input-group"><label>Reviews (1-5 stars)</label><input type="number" id="reviews${i}" min="1" max="5" step="0.1" placeholder="4.5"></div>
                        </div>
                        <div class="grid grid-cols-2 gap-2">
                            <div class="input-group"><label>Years Experience</label><input type="number" id="exp${i}" min="0" placeholder="10"></div>
                            <div class="input-group">
                                <label>Licensed & Insured?</label>
                                <select id="cred${i}"><option value="3">Licensed + Insured + Bonded</option><option value="2">Licensed + Insured</option><option value="1">Licensed only</option><option value="0">Neither / Unknown</option></select>
                            </div>
                        </div>
                        <div class="input-group"><label>Warranty</label>
                            <select id="warranty${i}"><option value="0">None stated</option><option value="1">1 year</option><option value="2">2-5 years</option><option value="3">5+ years or lifetime</option></select>
                        </div>
                    </div>
                </div>
                `).join('')}
                <button type="submit" class="btn-primary w-full">Compare Contractors</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">How to Choose a Contractor</h2>
            <div class="pro-tip mb-6">
                <h4 class="font-bold mb-2">💡 Pro Tip</h4>
                <p>The cheapest bid is rarely the best. A low price often means corners cut, unlicensed workers, or change orders later.</p>
            </div>
            <h3 class="text-2xl font-bold mt-6 mb-3">Key Questions to Ask</h3>
            <ul class="list-disc pl-6 space-y-2">
                <li>Can I see your contractor's license number?</li>
                <li>Do you carry general liability and workers' comp insurance?</li>
                <li>Can you provide 3 references from similar projects?</li>
                <li>What's included in the warranty?</li>
                <li>What's the payment schedule? (Never pay more than 10% upfront)</li>
                <li>Who will be the on-site supervisor?</li>
            </ul>
            <h3 class="text-2xl font-bold mt-6 mb-3">Red Flags</h3>
            <ul class="list-disc pl-6 space-y-2">
                <li>Demands full payment upfront</li>
                <li>No written contract or vague scope</li>
                <li>Can't provide license or insurance proof</li>
                <li>Pressures you to decide immediately</li>
                <li>Only accepts cash</li>
            </ul>
        `
    };

    function calculate(e) {
        e.preventDefault();
        const wPrice = parseInt(document.getElementById('wPrice').value);
        const wReviews = parseInt(document.getElementById('wReviews').value);
        const wExp = parseInt(document.getElementById('wExp').value);
        const wCred = parseInt(document.getElementById('wCred').value);
        const totalW = wPrice + wReviews + wExp + wCred;

        const contractors = [];
        const prices = [];
        for (let i = 1; i <= 3; i++) {
            const name = document.getElementById('name' + i).value.trim();
            const price = parseFloat(document.getElementById('price' + i).value);
            if (name && !isNaN(price)) {
                prices.push(price);
                contractors.push({
                    name, price,
                    reviews: parseFloat(document.getElementById('reviews' + i).value) || 0,
                    exp: parseFloat(document.getElementById('exp' + i).value) || 0,
                    cred: parseInt(document.getElementById('cred' + i).value),
                    warranty: parseInt(document.getElementById('warranty' + i).value)
                });
            }
        }
        if (contractors.length < 2) {
            document.getElementById('result').className = 'result-box mt-6';
            document.getElementById('result').innerHTML = '<p class="font-bold">Please fill in at least 2 contractors to compare.</p>';
            return;
        }

        const maxPrice = Math.max(...prices);
        const minPrice = Math.min(...prices);
        const priceRange = maxPrice - minPrice || 1;

        contractors.forEach(c => {
            // Normalize each to 0-10 scale
            const priceScore = ((maxPrice - c.price) / priceRange) * 10; // lower price = higher score
            const reviewScore = (c.reviews / 5) * 10;
            const expScore = Math.min(c.exp / 20, 1) * 10; // caps at 20 yrs
            const credScore = (c.cred / 3) * 10;
            const bonusWarranty = c.warranty; // 0-3 bonus points

            c.weighted = ((priceScore * wPrice + reviewScore * wReviews + expScore * wExp + credScore * wCred) / totalW) + bonusWarranty;
            c.details = { priceScore: priceScore.toFixed(1), reviewScore: reviewScore.toFixed(1), expScore: expScore.toFixed(1), credScore: credScore.toFixed(1) };
        });

        contractors.sort((a, b) => b.weighted - a.weighted);

        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-3xl font-bold mb-4">🏆 Best Match: ${contractors[0].name}</h3>
            <p class="mb-4 opacity-80">Weighted score: ${contractors[0].weighted.toFixed(1)} / 13</p>
            <div class="space-y-3">
                ${contractors.map((c, idx) => `
                <div class="bg-white bg-opacity-20 rounded-lg p-4 ${idx === 0 ? 'ring-2 ring-yellow-300' : ''}">
                    <div class="flex justify-between items-center mb-2">
                        <span class="font-bold text-lg">${idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'} ${c.name}</span>
                        <span class="font-bold">${c.weighted.toFixed(1)} pts</span>
                    </div>
                    <div class="text-sm space-y-1">
                        <div class="flex justify-between"><span>Price: $${c.price.toLocaleString()}</span><span>Score: ${c.details.priceScore}/10</span></div>
                        <div class="flex justify-between"><span>Reviews: ${c.reviews}★</span><span>Score: ${c.details.reviewScore}/10</span></div>
                        <div class="flex justify-between"><span>Experience: ${c.exp} yrs</span><span>Score: ${c.details.expScore}/10</span></div>
                        <div class="flex justify-between"><span>Credentials</span><span>Score: ${c.details.credScore}/10</span></div>
                        <div class="flex justify-between"><span>Warranty bonus</span><span>+${c.warranty} pts</span></div>
                    </div>
                </div>
                `).join('')}
            </div>
        `;
    }

    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('planningForm').addEventListener('submit', calculate);
    loadRelatedTools('planning');
})();
