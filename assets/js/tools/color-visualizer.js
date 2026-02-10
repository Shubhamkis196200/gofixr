// Paint Color Visualizer
(function() {
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Paint Color Visualizer</h2>
            <form id="utilityForm" class="space-y-4">
                <div class="input-group">
                    <label>Select Your Base Color</label>
                    <input type="color" id="baseColor" value="#4A90D9" class="w-full h-12 cursor-pointer rounded">
                </div>
                <div class="input-group">
                    <label>Room Type</label>
                    <select id="roomType">
                        <option value="living">Living Room</option>
                        <option value="bedroom">Bedroom</option>
                        <option value="kitchen">Kitchen</option>
                        <option value="bathroom">Bathroom</option>
                        <option value="exterior">Exterior</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Lighting Condition</label>
                    <select id="lighting">
                        <option value="bright">Bright / South-facing</option>
                        <option value="moderate">Moderate / East-West</option>
                        <option value="dim">Dim / North-facing</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Color Scheme</label>
                    <select id="scheme">
                        <option value="complementary">Complementary</option>
                        <option value="analogous">Analogous</option>
                        <option value="triadic">Triadic</option>
                        <option value="monochromatic">Monochromatic</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary w-full">Generate Color Palette</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">How to Choose Paint Colors for Your Home</h2>
            <p class="mb-4">Choosing paint colors is one of the most impactful and affordable ways to transform a room. The right color can make a small room feel larger, a dark room feel brighter, and completely change the mood of your living space. This tool helps you explore color harmonies and find the perfect palette for any room in your home.</p>
            
            <h3 class="text-2xl font-bold mt-6 mb-3">Understanding Color Theory</h3>
            <p class="mb-4"><strong>Complementary colors</strong> sit opposite each other on the color wheel (like blue and orange) and create vibrant, high-contrast looks perfect for accent walls. <strong>Analogous colors</strong> are neighbors on the wheel (like blue, blue-green, and green) and create harmonious, calming spaces. <strong>Triadic schemes</strong> use three equally spaced colors for balanced variety, while <strong>monochromatic</strong> palettes use different shades of one color for a sophisticated, cohesive look.</p>
            
            <div class="pro-tip mb-6">
                <h4 class="font-bold">💡 Pro Tip</h4>
                <p>Always test paint colors on your actual wall before committing. Buy sample pots and paint 2×2 foot swatches. View them at different times of day — colors look dramatically different under morning vs. evening light, and natural vs. artificial lighting.</p>
            </div>
            
            <h3 class="text-2xl font-bold mt-6 mb-3">Room-by-Room Color Guidelines</h3>
            <ul class="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Living Room:</strong> Warm neutrals, soft blues, or sage greens create welcoming spaces</li>
                <li><strong>Bedroom:</strong> Cool blues, lavenders, and muted tones promote restful sleep</li>
                <li><strong>Kitchen:</strong> Whites, light grays, and warm yellows keep the space feeling clean and energetic</li>
                <li><strong>Bathroom:</strong> Light colors make small bathrooms feel larger; consider moisture-resistant finishes</li>
                <li><strong>Exterior:</strong> Consider your roof color, landscaping, and neighborhood aesthetic</li>
            </ul>
            
            <h3 class="text-2xl font-bold mt-6 mb-3">How Lighting Affects Color</h3>
            <p class="mb-4">North-facing rooms receive cool, indirect light that can make warm colors appear muted — choose warmer shades to compensate. South-facing rooms get warm, direct light that enhances warm tones and can wash out cool colors. East-facing rooms are warm in the morning and cool in the afternoon, while west-facing rooms do the opposite. Always consider your room's primary light source when selecting colors.</p>
        `
    };

    function hexToHSL(hex) {
        let r = parseInt(hex.slice(1,3),16)/255, g = parseInt(hex.slice(3,5),16)/255, b = parseInt(hex.slice(5,7),16)/255;
        let max = Math.max(r,g,b), min = Math.min(r,g,b), h, s, l = (max+min)/2;
        if(max===min){h=s=0;}else{let d=max-min;s=l>0.5?d/(2-max-min):d/(max+min);switch(max){case r:h=((g-b)/d+(g<b?6:0))/6;break;case g:h=((b-r)/d+2)/6;break;case b:h=((r-g)/d+4)/6;break;}}
        return [h*360,s*100,l*100];
    }

    function hslToHex(h,s,l) {
        h=((h%360)+360)%360; s/=100; l/=100;
        let a=s*Math.min(l,1-l), f=n=>{let k=(n+h/30)%12;return Math.round(255*(l-a*Math.max(Math.min(k-3,9-k,1),-1)));};
        return '#'+[f(0),f(8),f(4)].map(x=>x.toString(16).padStart(2,'0')).join('');
    }

    function getSchemeColors(h,s,l,scheme) {
        switch(scheme) {
            case 'complementary': return [{h:(h+180)%360,s,l},{h,s:s*0.7,l:Math.min(l+20,95)},{h:(h+180)%360,s:s*0.7,l:Math.min(l+20,95)}];
            case 'analogous': return [{h:(h+30)%360,s,l},{h:(h-30+360)%360,s,l},{h:(h+60)%360,s:s*0.8,l}];
            case 'triadic': return [{h:(h+120)%360,s,l},{h:(h+240)%360,s,l},{h,s:s*0.5,l:Math.min(l+15,90)}];
            case 'monochromatic': return [{h,s,l:Math.min(l+20,90)},{h,s,l:Math.max(l-20,10)},{h,s:s*0.6,l}];
        }
    }

    function calculate(e) {
        e.preventDefault();
        const hex = document.getElementById('baseColor').value;
        const room = document.getElementById('roomType').value;
        const lighting = document.getElementById('lighting').value;
        const scheme = document.getElementById('scheme').value;
        const [h,s,l] = hexToHSL(hex);
        
        // Adjust for lighting
        let adjL = l;
        if(lighting==='dim') adjL = Math.min(l+10,90);
        if(lighting==='bright') adjL = Math.max(l-5,15);
        
        const adjusted = hslToHex(h,s,adjL);
        const colors = getSchemeColors(h,s,adjL,scheme);
        const roomNames = {living:'Living Room',bedroom:'Bedroom',kitchen:'Kitchen',bathroom:'Bathroom',exterior:'Exterior'};
        const lightingTips = {bright:'Your bright room will intensify warm tones.',moderate:'Moderate lighting provides true color representation.',dim:'Dim lighting will mute colors — we\'ve brightened your palette slightly.'};
        
        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-2xl font-bold mb-4">Your ${roomNames[room]} Color Palette</h3>
            <p class="mb-4 text-sm">${lightingTips[lighting]}</p>
            <div class="grid grid-cols-4 gap-3 mb-4">
                <div class="text-center">
                    <div style="background:${adjusted};height:80px;border-radius:8px;border:2px solid rgba(0,0,0,0.1)"></div>
                    <p class="text-xs mt-1 font-bold">Main Wall</p>
                    <p class="text-xs">${adjusted}</p>
                </div>
                ${colors.map((c,i)=>{const cx=hslToHex(c.h,c.s,c.l);const labels=['Accent','Trim','Ceiling'];return `
                <div class="text-center">
                    <div style="background:${cx};height:80px;border-radius:8px;border:2px solid rgba(0,0,0,0.1)"></div>
                    <p class="text-xs mt-1 font-bold">${labels[i]}</p>
                    <p class="text-xs">${cx}</p>
                </div>`;}).join('')}
            </div>
            <div class="bg-white bg-opacity-20 rounded-lg p-4 mt-4">
                <h4 class="font-bold mb-2">💡 Tips for ${roomNames[room]}</h4>
                <ul class="text-sm space-y-1">
                    <li>• Use the <strong>Main Wall</strong> color on your largest wall or all walls</li>
                    <li>• Apply <strong>Accent</strong> on a feature wall or in accessories</li>
                    <li>• <strong>Trim</strong> works great for baseboards, door frames, and crown molding</li>
                    <li>• Use the <strong>Ceiling</strong> color to create visual height or coziness</li>
                </ul>
            </div>
        `;
    }

    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
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
