// Electrical Problem Diagnoser
(function() {
    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Diagnose Your Problem</h2>
            <form id="diagForm" class="space-y-4">
                <div class="input-group">
                    <label>What's the symptom?</label>
                    <select id="symptom" required>
                        <option value="">Select...</option>
                        <option value="no-function">Not working</option>
                        <option value="noise">Making noise</option>
                        <option value="leak">Leaking</option>
                        <option value="smell">Strange smell</option>
                        <option value="performance">Poor performance</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>When did it start?</label>
                    <select id="timing">
                        <option value="sudden">Suddenly</option>
                        <option value="gradual">Gradually</option>
                        <option value="always">Always</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary w-full">Diagnose</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Troubleshooting Guide</h2>
            <div class="danger-box mb-6">
                <h4 class="font-bold">⚠️ Safety First</h4>
                <p>Turn off power/water before repairs. Call professionals for complex issues.</p>
            </div>
            <h3 class="text-2xl font-bold mb-3">Common Causes</h3>
            <ul class="list-disc pl-6 space-y-2">
                <li>Wear and tear</li>
                <li>Clogs or blockages</li>
                <li>Loose connections</li>
                <li>Failed components</li>
            </ul>
        `
    };

    const solutions = {
        'no-function': { title: 'Not Working', checks: ['Check power supply', 'Test circuit breaker', 'Verify switches'] },
        'noise': { title: 'Making Noise', checks: ['Check for loose parts', 'Inspect bearings', 'Look for debris'] },
        'leak': { title: 'Leaking', checks: ['Find leak source', 'Check connections', 'Inspect seals'] },
        'smell': { title: 'Strange Smell', checks: ['Check for burning', 'Inspect for mold', 'Clean drains'] },
        'performance': { title: 'Poor Performance', checks: ['Clean filters', 'Check for clogs', 'Verify settings'] }
    };

    function diagnose(e) {
        e.preventDefault();
        const symptom = document.getElementById('symptom').value;
        if (!symptom) return;
        
        const solution = solutions[symptom];
        document.getElementById('result').className = 'tool-card mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-2xl font-bold mb-4">${solution.title}</h3>
            <h4 class="font-bold mb-3">Diagnostic Checklist:</h4>
            <div class="space-y-2">
                ${solution.checks.map((check, i) => `
                    <label class="flex gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input type="checkbox">
                        <span>${i + 1}. ${check}</span>
                    </label>
                `).join('')}
            </div>
        `;
    }

    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('diagForm').addEventListener('submit', diagnose);
    loadRelatedTools('diagnostic');
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
