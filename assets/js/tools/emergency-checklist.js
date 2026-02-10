// Emergency Repair Checklist Generator
(function() {
    const emergencies = {
        'water-damage': {
            name: 'Water Damage / Flooding',
            icon: '💧',
            immediate: [
                'Shut off main water supply valve',
                'Turn off electricity to affected areas at breaker panel',
                'Document damage with photos/video for insurance',
                'Remove standing water with wet/dry vacuum or pump',
                'Move furniture and valuables to dry area',
                'Open windows and doors for ventilation'
            ],
            within24hrs: [
                'Contact insurance company to file claim',
                'Set up fans and dehumidifiers',
                'Remove wet carpet padding (carpet may be salvageable)',
                'Wipe down wood furniture with dry cloths',
                'Check for sagging ceilings (stay clear if found)',
                'Photograph serial numbers on damaged electronics'
            ],
            within72hrs: [
                'Inspect for mold growth on walls and baseboards',
                'Remove drywall up to 2 feet above water line',
                'Treat exposed studs with antimicrobial spray',
                'Get 3 estimates from water restoration companies',
                'Check if sump pump is working (install one if not)',
                'Test HVAC system before running'
            ]
        },
        'gas-leak': {
            name: 'Gas Leak',
            icon: '⛽',
            immediate: [
                '⚠️ DO NOT turn on/off any lights or electrical switches',
                '⚠️ DO NOT use phone inside the house',
                'Open all windows and doors immediately',
                'Turn off gas meter valve (use wrench, turn ¼ turn)',
                'Evacuate all people and pets',
                'Call 911 or gas company from outside the home'
            ],
            within24hrs: [
                'Wait for gas company all-clear before re-entering',
                'Have gas company inspect all appliances and lines',
                'Check pilot lights on furnace, water heater, stove',
                'Inspect visible gas lines for corrosion or damage',
                'Install natural gas detector alarms if not present',
                'Document everything for landlord/insurance'
            ],
            within72hrs: [
                'Get licensed plumber to inspect underground gas lines',
                'Replace old flexible gas connectors (pre-1980)',
                'Consider adding an automatic gas shutoff valve',
                'Review gas appliance maintenance schedule',
                'Check dryer gas connection for leaks (soap bubble test)',
                'Update emergency contact list'
            ]
        },
        'electrical': {
            name: 'Electrical Emergency',
            icon: '⚡',
            immediate: [
                '⚠️ DO NOT touch any wet electrical equipment',
                'Turn off main breaker if safe to access',
                'If someone is shocked, call 911 — do NOT touch them if still in contact',
                'If sparks/fire: use Class C fire extinguisher (NOT water)',
                'Evacuate if you smell burning from walls/outlets',
                'Call electrician or 911 as appropriate'
            ],
            within24hrs: [
                'Have licensed electrician inspect affected circuits',
                'Check all GFCI outlets — press test/reset buttons',
                'Inspect outlets for scorch marks or melting',
                'Test smoke detectors on all floors',
                'Check breaker panel for tripped breakers or burn marks',
                'Document damage for insurance'
            ],
            within72hrs: [
                'Replace any damaged outlets or switches',
                'Have electrician check wiring in affected walls',
                'Install arc-fault circuit interrupters (AFCIs) if missing',
                'Update electrical panel if >30 years old',
                'Install surge protectors on major appliances',
                'Review home electrical load capacity'
            ]
        },
        'storm-damage': {
            name: 'Storm / Wind / Hail Damage',
            icon: '🌪️',
            immediate: [
                'Stay inside until storm passes completely',
                'Watch for downed power lines — stay 30+ feet away',
                'Turn off electricity if water is entering home',
                'Cover broken windows with plywood or heavy plastic',
                'Tarp any roof damage to prevent further water intrusion',
                'Document all damage with photos before cleanup'
            ],
            within24hrs: [
                'Contact insurance company — most require 24hr notice',
                'Get emergency tarp service for roof if needed',
                'Remove fallen tree limbs from structures carefully',
                'Check attic for water intrusion',
                'Board up broken windows securely',
                'Save all receipts for emergency repairs'
            ],
            within72hrs: [
                'Get 3 estimates from licensed roofers',
                'Have arborist assess damaged trees',
                'Check foundation for new cracks',
                'Inspect siding, gutters, and downspouts',
                'File detailed insurance claim with photos',
                'Check fence, deck, and outbuildings for damage'
            ]
        },
        'fire-damage': {
            name: 'Fire / Smoke Damage',
            icon: '🔥',
            immediate: [
                'Evacuate immediately — do NOT go back for belongings',
                'Call 911',
                'Account for all family members and pets',
                'Do NOT re-enter until fire department gives all-clear',
                'Contact Red Cross if you need temporary shelter',
                'Call insurance company emergency line'
            ],
            within24hrs: [
                'Board up openings to secure the property',
                'Contact insurance adjuster for inspection',
                'Document everything with photos/video',
                'Do NOT clean or remove anything until adjuster visits',
                'Retrieve important documents if structure is safe',
                'Arrange temporary housing if needed'
            ],
            within72hrs: [
                'Get fire restoration company estimates',
                'Have electrical system inspected before restoring power',
                'Begin inventory of damaged/destroyed items',
                'Contact mortgage company about the damage',
                'Check for smoke damage in HVAC ducts',
                'Review and update insurance policy'
            ]
        }
    };

    const content = {
        interface: `
            <h2 class="text-2xl font-bold mb-6">Emergency Repair Checklist</h2>
            <p class="text-gray-600 mb-4">Select an emergency type to get an immediate action checklist. Print or save for reference.</p>
            <form id="emergencyForm" class="space-y-4">
                <div class="input-group">
                    <label>Emergency Type</label>
                    <select id="emergencyType" required>
                        <option value="">-- Select Emergency --</option>
                        ${Object.entries(emergencies).map(([k,v]) => `<option value="${k}">${v.icon} ${v.name}</option>`).join('')}
                    </select>
                </div>
                <button type="submit" class="btn-primary w-full">Generate Checklist</button>
            </form>
            <div id="result" class="hidden"></div>
        `,
        education: `
            <h2 class="text-3xl font-bold mb-4">Emergency Preparedness Guide</h2>
            <div class="pro-tip mb-6">
                <h4 class="font-bold mb-2">💡 Pro Tip</h4>
                <p>Print these checklists and keep them with your emergency kit. In a real emergency, you won't have time to search online.</p>
            </div>
            <h3 class="text-2xl font-bold mt-6 mb-3">Emergency Kit Essentials</h3>
            <ul class="list-disc pl-6 space-y-2">
                <li>Flashlights and extra batteries</li>
                <li>First aid kit</li>
                <li>Main water shutoff wrench</li>
                <li>Fire extinguisher (ABC rated)</li>
                <li>Important documents in waterproof bag</li>
                <li>Insurance company phone numbers</li>
                <li>List of licensed contractors</li>
            </ul>
            <h3 class="text-2xl font-bold mt-6 mb-3">Know Your Shutoffs</h3>
            <ul class="list-disc pl-6 space-y-2">
                <li><strong>Water main:</strong> Usually near the street or where the water line enters your home</li>
                <li><strong>Gas meter:</strong> Requires a wrench — keep one nearby</li>
                <li><strong>Electrical panel:</strong> Know which breakers control which areas</li>
            </ul>
        `
    };

    function generateChecklist(e) {
        e.preventDefault();
        const type = document.getElementById('emergencyType').value;
        if (!type) return;
        const em = emergencies[type];

        function renderSection(title, items, color) {
            return `
                <div class="mb-4">
                    <h4 class="font-bold text-lg mb-2" style="color:${color}">${title}</h4>
                    <div class="space-y-1">
                        ${items.map((item, i) => `
                            <label class="flex items-start gap-2 cursor-pointer">
                                <input type="checkbox" class="mt-1 checklist-cb" data-section="${title}" data-idx="${i}">
                                <span>${item}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        document.getElementById('result').className = 'result-box mt-6';
        document.getElementById('result').innerHTML = `
            <h3 class="text-2xl font-bold mb-2">${em.icon} ${em.name} Checklist</h3>
            <p class="text-sm mb-4 opacity-80">Check off items as you complete them</p>
            ${renderSection('🔴 Immediate Actions', em.immediate, '#ef4444')}
            ${renderSection('🟠 Within 24 Hours', em.within24hrs, '#f97316')}
            ${renderSection('🟡 Within 72 Hours', em.within72hrs, '#eab308')}
            <div class="mt-4 pt-4 border-t border-white border-opacity-30">
                <button onclick="window.print()" class="bg-white text-gray-800 px-4 py-2 rounded font-bold hover:bg-gray-100">🖨️ Print Checklist</button>
            </div>
        `;
    }

    document.getElementById('toolInterface').innerHTML = content.interface;
    document.getElementById('educationalContent').innerHTML = content.education;
    document.getElementById('emergencyForm').addEventListener('submit', generateChecklist);
    if (typeof loadRelatedTools === 'function') loadRelatedTools('planning');
})();
