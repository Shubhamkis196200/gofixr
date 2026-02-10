const fs = require('fs');
const path = require('path');

// Define all 50 tools with their specifications
const tools = [
  // Cost Estimators (15)
  {
    id: 'bathroom-remodel-cost-calculator',
    name: 'Bathroom Remodel Cost Calculator',
    description: 'Estimate the cost to remodel your bathroom based on size, finishes, and scope of work.',
    icon: '🚿',
    category: 'Cost Estimators',
    categorySlug: 'cost-estimators',
    inputs: [
      {id: 'bathSize', label: 'Bathroom Size (sq ft)', type: 'number', default: 50, min: 20, max: 200},
      {id: 'finishLevel', label: 'Finish Level', type: 'select', options: ['Budget', 'Mid-Range', 'High-End'], default: 'Mid-Range'},
      {id: 'fixtures', label: 'New Fixtures', type: 'checkbox', checked: true},
      {id: 'tile', label: 'New Tile', type: 'checkbox', checked: true}
    ],
    calculate: `
      const sizeMultiplier = parseFloat(document.getElementById('bathSize').value) || 50;
      const finishLevel = document.getElementById('finishLevel').value;
      const fixtures = document.getElementById('fixtures').checked;
      const tile = document.getElementById('tile').checked;
      
      let costPerSqFt = finishLevel === 'Budget' ? 100 : finishLevel === 'High-End' ? 300 : 180;
      let baseCost = sizeMultiplier * costPerSqFt;
      if (fixtures) baseCost += 2000;
      if (tile) baseCost += 1500;
      
      document.getElementById('result-total').textContent = '$' + baseCost.toLocaleString();
      document.getElementById('result-range').textContent = '$' + (baseCost * 0.85).toLocaleString() + ' - $' + (baseCost * 1.15).toLocaleString();
    `
  },
  {
    id: 'kitchen-remodel-cost-calculator',
    name: 'Kitchen Remodel Cost Estimator',
    description: 'Calculate the cost of a kitchen remodel including cabinets, countertops, and appliances.',
    icon: '🍳',
    category: 'Cost Estimators',
    categorySlug: 'cost-estimators',
    inputs: [
      {id: 'kitchenSize', label: 'Kitchen Size (sq ft)', type: 'number', default: 150, min: 50, max: 500},
      {id: 'cabinets', label: 'Cabinet Quality', type: 'select', options: ['Stock', 'Semi-Custom', 'Custom'], default: 'Semi-Custom'},
      {id: 'countertops', label: 'Countertop Material', type: 'select', options: ['Laminate', 'Granite', 'Quartz', 'Marble'], default: 'Granite'},
      {id: 'appliances', label: 'New Appliances', type: 'checkbox', checked: true}
    ],
    calculate: `
      const size = parseFloat(document.getElementById('kitchenSize').value) || 150;
      const cabinets = document.getElementById('cabinets').value;
      const countertops = document.getElementById('countertops').value;
      const appliances = document.getElementById('appliances').checked;
      
      let cabinetCost = cabinets === 'Stock' ? 4000 : cabinets === 'Custom' ? 20000 : 10000;
      let counterCost = countertops === 'Laminate' ? 1500 : countertops === 'Granite' ? 3500 : countertops === 'Quartz' ? 4500 : 6000;
      let baseCost = size * 75 + cabinetCost + counterCost;
      if (appliances) baseCost += 5000;
      
      document.getElementById('result-total').textContent = '$' + baseCost.toLocaleString();
      document.getElementById('result-cabinets').textContent = '$' + cabinetCost.toLocaleString();
      document.getElementById('result-counters').textContent = '$' + counterCost.toLocaleString();
    `
  },
  {
    id: 'roof-replacement-cost-calculator',
    name: 'Roof Replacement Cost Calculator',
    description: 'Estimate roof replacement costs based on square footage, material type, and roof complexity.',
    icon: '🏠',
    category: 'Cost Estimators',
    categorySlug: 'cost-estimators',
    inputs: [
      {id: 'roofSize', label: 'Roof Size (sq ft)', type: 'number', default: 1500, min: 500, max: 5000},
      {id: 'material', label: 'Roofing Material', type: 'select', options: ['Asphalt Shingles', 'Metal', 'Tile', 'Slate'], default: 'Asphalt Shingles'},
      {id: 'pitch', label: 'Roof Pitch', type: 'select', options: ['Low (< 4/12)', 'Medium (4-6/12)', 'Steep (> 6/12)'], default: 'Medium (4-6/12)'},
      {id: 'layers', label: 'Remove Existing Layers', type: 'number', default: 1, min: 1, max: 3}
    ],
    calculate: `
      const size = parseFloat(document.getElementById('roofSize').value) || 1500;
      const material = document.getElementById('material').value;
      const pitch = document.getElementById('pitch').value;
      const layers = parseInt(document.getElementById('layers').value) || 1;
      
      let pricePerSqFt = material === 'Asphalt Shingles' ? 4.5 : material === 'Metal' ? 9 : material === 'Tile' ? 12 : 18;
      let pitchMultiplier = pitch.includes('Low') ? 1 : pitch.includes('Steep') ? 1.3 : 1.15;
      let baseCost = size * pricePerSqFt * pitchMultiplier + (layers - 1) * size * 1.5;
      
      document.getElementById('result-total').textContent = '$' + baseCost.toLocaleString();
      document.getElementById('result-perSqFt').textContent = '$' + (baseCost / size).toFixed(2);
    `
  },
  {
    id: 'fence-installation-cost-calculator',
    name: 'Fence Installation Cost Calculator',
    description: 'Calculate the cost to install a new fence based on length, height, and material.',
    icon: '🏡',
    category: 'Cost Estimators',
    categorySlug: 'cost-estimators',
    inputs: [
      {id: 'length', label: 'Fence Length (ft)', type: 'number', default: 100, min: 10, max: 500},
      {id: 'height', label: 'Fence Height (ft)', type: 'number', default: 6, min: 3, max: 8},
      {id: 'material', label: 'Material', type: 'select', options: ['Chain Link', 'Wood', 'Vinyl', 'Aluminum'], default: 'Wood'},
      {id: 'gates', label: 'Number of Gates', type: 'number', default: 1, min: 0, max: 5}
    ],
    calculate: `
      const length = parseFloat(document.getElementById('length').value) || 100;
      const height = parseFloat(document.getElementById('height').value) || 6;
      const material = document.getElementById('material').value;
      const gates = parseInt(document.getElementById('gates').value) || 0;
      
      let pricePerFt = material === 'Chain Link' ? 8 : material === 'Wood' ? 15 : material === 'Vinyl' ? 25 : 22;
      pricePerFt *= (height / 6);
      let baseCost = length * pricePerFt + gates * 300;
      
      document.getElementById('result-total').textContent = '$' + baseCost.toLocaleString();
      document.getElementById('result-perFoot').textContent = '$' + (baseCost / length).toFixed(2);
    `
  },
  {
    id: 'deck-building-cost-calculator',
    name: 'Deck Building Cost Estimator',
    description: 'Estimate deck construction costs based on size, material, and features.',
    icon: '🪵',
    category: 'Cost Estimators',
    categorySlug: 'cost-estimators',
    inputs: [
      {id: 'deckSize', label: 'Deck Size (sq ft)', type: 'number', default: 300, min: 50, max: 1000},
      {id: 'material', label: 'Decking Material', type: 'select', options: ['Pressure Treated', 'Cedar', 'Composite', 'PVC'], default: 'Composite'},
      {id: 'railing', label: 'Railing Type', type: 'select', options: ['Wood', 'Composite', 'Metal'], default: 'Composite'},
      {id: 'stairs', label: 'Include Stairs', type: 'checkbox', checked: true}
    ],
    calculate: `
      const size = parseFloat(document.getElementById('deckSize').value) || 300;
      const material = document.getElementById('material').value;
      const railing = document.getElementById('railing').value;
      const stairs = document.getElementById('stairs').checked;
      
      let deckPrice = material === 'Pressure Treated' ? 15 : material === 'Cedar' ? 25 : material === 'Composite' ? 35 : 45;
      let railingPrice = railing === 'Wood' ? 20 : railing === 'Composite' ? 35 : 50;
      let perimeter = Math.sqrt(size) * 4;
      let baseCost = size * deckPrice + perimeter * railingPrice;
      if (stairs) baseCost += 500;
      
      document.getElementById('result-total').textContent = '$' + baseCost.toLocaleString();
      document.getElementById('result-perSqFt').textContent = '$' + (baseCost / size).toFixed(2);
    `
  },
  {
    id: 'painting-cost-calculator',
    name: 'Painting Cost Calculator',
    description: 'Calculate interior or exterior painting costs including labor and materials.',
    icon: '🎨',
    category: 'Cost Estimators',
    categorySlug: 'cost-estimators',
    inputs: [
      {id: 'area', label: 'Area to Paint (sq ft)', type: 'number', default: 400, min: 50, max: 5000},
      {id: 'type', label: 'Project Type', type: 'select', options: ['Interior', 'Exterior'], default: 'Interior'},
      {id: 'coats', label: 'Number of Coats', type: 'number', default: 2, min: 1, max: 3},
      {id: 'paintQuality', label: 'Paint Quality', type: 'select', options: ['Basic', 'Premium'], default: 'Basic'}
    ],
    calculate: `
      const area = parseFloat(document.getElementById('area').value) || 400;
      const type = document.getElementById('type').value;
      const coats = parseInt(document.getElementById('coats').value) || 2;
      const quality = document.getElementById('paintQuality').value;
      
      let laborPerSqFt = type === 'Interior' ? 2 : 3;
      let paintPrice = quality === 'Basic' ? 0.5 : 1;
      let baseCost = area * laborPerSqFt + area * paintPrice * coats;
      
      document.getElementById('result-total').textContent = '$' + baseCost.toLocaleString();
      document.getElementById('result-labor').textContent = '$' + (area * laborPerSqFt).toLocaleString();
      document.getElementById('result-materials').textContent = '$' + (area * paintPrice * coats).toLocaleString();
    `
  },
  {
    id: 'flooring-cost-calculator',
    name: 'Flooring Cost Calculator',
    description: 'Estimate flooring installation costs for various materials and room sizes.',
    icon: '🏢',
    category: 'Cost Estimators',
    categorySlug: 'cost-estimators',
    inputs: [
      {id: 'roomSize', label: 'Room Size (sq ft)', type: 'number', default: 200, min: 50, max: 1000},
      {id: 'floorType', label: 'Flooring Type', type: 'select', options: ['Carpet', 'Vinyl', 'Laminate', 'Hardwood', 'Tile'], default: 'Laminate'},
      {id: 'removal', label: 'Remove Existing Floor', type: 'checkbox', checked: true},
      {id: 'subfloor', label: 'Subfloor Repair Needed', type: 'checkbox', checked: false}
    ],
    calculate: `
      const size = parseFloat(document.getElementById('roomSize').value) || 200;
      const floorType = document.getElementById('floorType').value;
      const removal = document.getElementById('removal').checked;
      const subfloor = document.getElementById('subfloor').checked;
      
      let materialPrice = floorType === 'Carpet' ? 3 : floorType === 'Vinyl' ? 4 : floorType === 'Laminate' ? 5 : floorType === 'Hardwood' ? 10 : 8;
      let laborPrice = 3;
      let baseCost = size * (materialPrice + laborPrice);
      if (removal) baseCost += size * 2;
      if (subfloor) baseCost += size * 1.5;
      
      document.getElementById('result-total').textContent = '$' + baseCost.toLocaleString();
      document.getElementById('result-perSqFt').textContent = '$' + (baseCost / size).toFixed(2);
    `
  },
  {
    id: 'plumbing-repair-cost-calculator',
    name: 'Plumbing Repair Cost Estimator',
    description: 'Estimate costs for common plumbing repairs and installations.',
    icon: '🔧',
    category: 'Cost Estimators',
    categorySlug: 'cost-estimators',
    inputs: [
      {id: 'repairType', label: 'Repair Type', type: 'select', options: ['Faucet Repair', 'Toilet Repair', 'Drain Cleaning', 'Pipe Repair', 'Water Heater'], default: 'Faucet Repair'},
      {id: 'difficulty', label: 'Difficulty', type: 'select', options: ['Simple', 'Moderate', 'Complex'], default: 'Moderate'},
      {id: 'emergency', label: 'Emergency Service', type: 'checkbox', checked: false}
    ],
    calculate: `
      const repairType = document.getElementById('repairType').value;
      const difficulty = document.getElementById('difficulty').value;
      const emergency = document.getElementById('emergency').checked;
      
      let baseCosts = {
        'Faucet Repair': 150,
        'Toilet Repair': 180,
        'Drain Cleaning': 200,
        'Pipe Repair': 350,
        'Water Heater': 800
      };
      let diffMultiplier = difficulty === 'Simple' ? 0.7 : difficulty === 'Complex' ? 1.5 : 1;
      let baseCost = baseCosts[repairType] * diffMultiplier;
      if (emergency) baseCost *= 1.5;
      
      document.getElementById('result-total').textContent = '$' + baseCost.toLocaleString();
      document.getElementById('result-hourly').textContent = '$' + Math.round(baseCost / 2) + ' - $' + Math.round(baseCost / 1.5);
    `
  },
  {
    id: 'electrical-work-cost-calculator',
    name: 'Electrical Work Cost Calculator',
    description: 'Calculate costs for electrical repairs, installations, and upgrades.',
    icon: '⚡',
    category: 'Cost Estimators',
    categorySlug: 'cost-estimators',
    inputs: [
      {id: 'workType', label: 'Work Type', type: 'select', options: ['Outlet Installation', 'Light Fixture', 'Ceiling Fan', 'Circuit Breaker', 'Panel Upgrade'], default: 'Outlet Installation'},
      {id: 'quantity', label: 'Quantity', type: 'number', default: 1, min: 1, max: 20},
      {id: 'permit', label: 'Permit Required', type: 'checkbox', checked: false}
    ],
    calculate: `
      const workType = document.getElementById('workType').value;
      const quantity = parseInt(document.getElementById('quantity').value) || 1;
      const permit = document.getElementById('permit').checked;
      
      let unitCosts = {
        'Outlet Installation': 150,
        'Light Fixture': 200,
        'Ceiling Fan': 300,
        'Circuit Breaker': 250,
        'Panel Upgrade': 1500
      };
      let baseCost = unitCosts[workType] * quantity;
      if (permit) baseCost += 200;
      
      document.getElementById('result-total').textContent = '$' + baseCost.toLocaleString();
      document.getElementById('result-perUnit').textContent = '$' + unitCosts[workType].toLocaleString();
    `
  },
  {
    id: 'hvac-replacement-cost-calculator',
    name: 'HVAC Replacement Cost Estimator',
    description: 'Estimate HVAC system replacement costs based on home size and system type.',
    icon: '❄️',
    category: 'Cost Estimators',
    categorySlug: 'cost-estimators',
    inputs: [
      {id: 'homeSize', label: 'Home Size (sq ft)', type: 'number', default: 2000, min: 500, max: 5000},
      {id: 'systemType', label: 'System Type', type: 'select', options: ['Central AC', 'Heat Pump', 'Gas Furnace', 'Complete System'], default: 'Central AC'},
      {id: 'efficiency', label: 'Efficiency Rating', type: 'select', options: ['Standard', 'High Efficiency'], default: 'Standard'},
      {id: 'ductwork', label: 'New Ductwork Needed', type: 'checkbox', checked: false}
    ],
    calculate: `
      const size = parseFloat(document.getElementById('homeSize').value) || 2000;
      const systemType = document.getElementById('systemType').value;
      const efficiency = document.getElementById('efficiency').value;
      const ductwork = document.getElementById('ductwork').checked;
      
      let tons = Math.ceil(size / 600);
      let baseCosts = {
        'Central AC': 3500,
        'Heat Pump': 5500,
        'Gas Furnace': 3000,
        'Complete System': 7000
      };
      let baseCost = baseCosts[systemType] + tons * 500;
      if (efficiency === 'High Efficiency') baseCost *= 1.3;
      if (ductwork) baseCost += size * 5;
      
      document.getElementById('result-total').textContent = '$' + baseCost.toLocaleString();
      document.getElementById('result-tonnage').textContent = tons + ' tons';
    `
  },
  {
    id: 'window-replacement-cost-calculator',
    name: 'Window Replacement Cost Calculator',
    description: 'Calculate window replacement costs by quantity, type, and material.',
    icon: '🪟',
    category: 'Cost Estimators',
    categorySlug: 'cost-estimators',
    inputs: [
      {id: 'numWindows', label: 'Number of Windows', type: 'number', default: 5, min: 1, max: 30},
      {id: 'windowType', label: 'Window Type', type: 'select', options: ['Single Hung', 'Double Hung', 'Casement', 'Bay/Bow'], default: 'Double Hung'},
      {id: 'frame', label: 'Frame Material', type: 'select', options: ['Vinyl', 'Wood', 'Fiberglass', 'Aluminum'], default: 'Vinyl'},
      {id: 'glass', label: 'Glass Type', type: 'select', options: ['Single Pane', 'Double Pane', 'Triple Pane'], default: 'Double Pane'}
    ],
    calculate: `
      const num = parseInt(document.getElementById('numWindows').value) || 5;
      const windowType = document.getElementById('windowType').value;
      const frame = document.getElementById('frame').value;
      const glass = document.getElementById('glass').value;
      
      let basePrice = windowType === 'Single Hung' ? 300 : windowType === 'Double Hung' ? 400 : windowType === 'Casement' ? 500 : 1200;
      let frameMultiplier = frame === 'Vinyl' ? 1 : frame === 'Aluminum' ? 0.9 : frame === 'Fiberglass' ? 1.3 : 1.5;
      let glassMultiplier = glass === 'Single Pane' ? 0.7 : glass === 'Triple Pane' ? 1.4 : 1;
      let costPerWindow = basePrice * frameMultiplier * glassMultiplier;
      let totalCost = costPerWindow * num;
      
      document.getElementById('result-total').textContent = '$' + totalCost.toLocaleString();
      document.getElementById('result-perWindow').textContent = '$' + Math.round(costPerWindow).toLocaleString();
    `
  },
  {
    id: 'drywall-repair-cost-calculator',
    name: 'Drywall Repair Cost Calculator',
    description: 'Estimate drywall repair costs based on damage size and complexity.',
    icon: '🏗️',
    category: 'Cost Estimators',
    categorySlug: 'cost-estimators',
    inputs: [
      {id: 'damageSize', label: 'Damage Size', type: 'select', options: ['Small Hole (< 6")', 'Medium Hole (6-12")', 'Large Hole (> 12")', 'Full Sheet'], default: 'Medium Hole (6-12")'},
      {id: 'numAreas', label: 'Number of Areas', type: 'number', default: 1, min: 1, max: 20},
      {id: 'texture', label: 'Texture Match Needed', type: 'checkbox', checked: true},
      {id: 'paint', label: 'Paint Match Needed', type: 'checkbox', checked: true}
    ],
    calculate: `
      const damageSize = document.getElementById('damageSize').value;
      const num = parseInt(document.getElementById('numAreas').value) || 1;
      const texture = document.getElementById('texture').checked;
      const paint = document.getElementById('paint').checked;
      
      let repairCosts = {
        'Small Hole (< 6")': 75,
        'Medium Hole (6-12")': 150,
        'Large Hole (> 12")': 250,
        'Full Sheet': 400
      };
      let baseCost = repairCosts[damageSize] * num;
      if (texture) baseCost += num * 50;
      if (paint) baseCost += num * 75;
      
      document.getElementById('result-total').textContent = '$' + baseCost.toLocaleString();
      document.getElementById('result-perArea').textContent = '$' + Math.round(baseCost / num).toLocaleString();
    `
  },
  {
    id: 'concrete-patio-cost-calculator',
    name: 'Concrete/Patio Cost Estimator',
    description: 'Calculate costs for concrete patios, driveways, and slabs.',
    icon: '🧱',
    category: 'Cost Estimators',
    categorySlug: 'cost-estimators',
    inputs: [
      {id: 'length', label: 'Length (ft)', type: 'number', default: 15, min: 5, max: 100},
      {id: 'width', label: 'Width (ft)', type: 'number', default: 12, min: 5, max: 100},
      {id: 'thickness', label: 'Thickness (inches)', type: 'number', default: 4, min: 3, max: 8},
      {id: 'finish', label: 'Finish Type', type: 'select', options: ['Basic', 'Broom Finish', 'Stamped', 'Stained'], default: 'Broom Finish'}
    ],
    calculate: `
      const length = parseFloat(document.getElementById('length').value) || 15;
      const width = parseFloat(document.getElementById('width').value) || 12;
      const thickness = parseFloat(document.getElementById('thickness').value) || 4;
      const finish = document.getElementById('finish').value;
      
      let sqFt = length * width;
      let cubicYards = (sqFt * (thickness / 12)) / 27;
      let finishPrices = {'Basic': 4, 'Broom Finish': 6, 'Stamped': 12, 'Stained': 10};
      let baseCost = sqFt * finishPrices[finish] + cubicYards * 100;
      
      document.getElementById('result-total').textContent = '$' + baseCost.toLocaleString();
      document.getElementById('result-yards').textContent = cubicYards.toFixed(2) + ' cubic yards';
      document.getElementById('result-sqft').textContent = sqFt + ' sq ft';
    `
  },
  {
    id: 'garage-door-replacement-cost-calculator',
    name: 'Garage Door Replacement Cost Calculator',
    description: 'Estimate garage door replacement costs including installation.',
    icon: '🚪',
    category: 'Cost Estimators',
    categorySlug: 'cost-estimators',
    inputs: [
      {id: 'doorSize', label: 'Door Size', type: 'select', options: ['Single (8x7)', 'Single (9x7)', 'Double (16x7)'], default: 'Double (16x7)'},
      {id: 'material', label: 'Material', type: 'select', options: ['Steel', 'Aluminum', 'Wood', 'Composite'], default: 'Steel'},
      {id: 'insulation', label: 'Insulation', type: 'select', options: ['None', 'Basic', 'Premium'], default: 'Basic'},
      {id: 'opener', label: 'Include New Opener', type: 'checkbox', checked: true}
    ],
    calculate: `
      const doorSize = document.getElementById('doorSize').value;
      const material = document.getElementById('material').value;
      const insulation = document.getElementById('insulation').value;
      const opener = document.getElementById('opener').checked;
      
      let sizePrice = doorSize.includes('Single') ? 500 : 800;
      let materialMultiplier = material === 'Steel' ? 1 : material === 'Aluminum' ? 0.9 : material === 'Wood' ? 1.8 : 1.4;
      let insulationAdd = insulation === 'None' ? 0 : insulation === 'Basic' ? 200 : 400;
      let baseCost = sizePrice * materialMultiplier + insulationAdd;
      if (opener) baseCost += 300;
      
      document.getElementById('result-total').textContent = '$' + baseCost.toLocaleString();
    `
  },
  {
    id: 'siding-installation-cost-calculator',
    name: 'Siding Installation Cost Estimator',
    description: 'Calculate siding installation costs by home size and material type.',
    icon: '🏘️',
    category: 'Cost Estimators',
    categorySlug: 'cost-estimators',
    inputs: [
      {id: 'homeArea', label: 'Exterior Wall Area (sq ft)', type: 'number', default: 1500, min: 500, max: 5000},
      {id: 'sidingType', label: 'Siding Type', type: 'select', options: ['Vinyl', 'Fiber Cement', 'Wood', 'Metal'], default: 'Vinyl'},
      {id: 'removal', label: 'Remove Old Siding', type: 'checkbox', checked: true},
      {id: 'trim', label: 'Include Trim/Soffit', type: 'checkbox', checked: true}
    ],
    calculate: `
      const area = parseFloat(document.getElementById('homeArea').value) || 1500;
      const sidingType = document.getElementById('sidingType').value;
      const removal = document.getElementById('removal').checked;
      const trim = document.getElementById('trim').checked;
      
      let pricePerSqFt = sidingType === 'Vinyl' ? 5 : sidingType === 'Fiber Cement' ? 8 : sidingType === 'Wood' ? 10 : 12;
      let baseCost = area * pricePerSqFt;
      if (removal) baseCost += area * 1.5;
      if (trim) baseCost += area * 0.5;
      
      document.getElementById('result-total').textContent = '$' + baseCost.toLocaleString();
      document.getElementById('result-perSqFt').textContent = '$' + (baseCost / area).toFixed(2);
    `
  },

  // DIY Planning & Decision Tools (15)
  {
    id: 'diy-vs-hire-calculator',
    name: 'DIY vs Hire a Pro Calculator',
    description: 'Compare costs and effort to decide whether to DIY or hire a professional.',
    icon: '⚖️',
    category: 'Planning Tools',
    categorySlug: 'planning-tools',
    inputs: [
      {id: 'project', label: 'Project Type', type: 'select', options: ['Painting', 'Flooring', 'Plumbing', 'Electrical', 'Deck Building'], default: 'Painting'},
      {id: 'projectSize', label: 'Project Size (1-10)', type: 'number', default: 5, min: 1, max: 10},
      {id: 'skillLevel', label: 'Your Skill Level', type: 'select', options: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate'},
      {id: 'timeValue', label: 'Your Hourly Value ($)', type: 'number', default: 30, min: 10, max: 200}
    ],
    calculate: `
      const project = document.getElementById('project').value;
      const size = parseInt(document.getElementById('projectSize').value) || 5;
      const skill = document.getElementById('skillLevel').value;
      const hourlyValue = parseFloat(document.getElementById('timeValue').value) || 30;
      
      let projectHours = {
        'Painting': 15, 'Flooring': 25, 'Plumbing': 10, 'Electrical': 8, 'Deck Building': 40
      };
      let hours = projectHours[project] * (size / 5);
      let skillMultiplier = skill === 'Beginner' ? 2 : skill === 'Advanced' ? 0.7 : 1;
      let diyTime = hours * skillMultiplier;
      let diyMaterials = size * 100;
      let diyTotal = diyMaterials + (diyTime * hourlyValue);
      let proTotal = size * 500;
      
      document.getElementById('result-diy').textContent = '$' + Math.round(diyTotal).toLocaleString();
      document.getElementById('result-pro').textContent = '$' + Math.round(proTotal).toLocaleString();
      document.getElementById('result-savings').textContent = '$' + Math.round(Math.abs(proTotal - diyTotal)).toLocaleString();
      document.getElementById('result-recommendation').textContent = diyTotal < proTotal ? 'DIY Recommended' : 'Hire a Pro';
    `
  },
  {
    id: 'paint-calculator',
    name: 'Paint Calculator',
    description: 'Calculate how much paint you need for interior or exterior projects.',
    icon: '🎨',
    category: 'Planning Tools',
    categorySlug: 'planning-tools',
    inputs: [
      {id: 'length', label: 'Room/Wall Length (ft)', type: 'number', default: 12, min: 1, max: 100},
      {id: 'width', label: 'Room/Wall Width (ft)', type: 'number', default: 10, min: 1, max: 100},
      {id: 'height', label: 'Wall Height (ft)', type: 'number', default: 8, min: 6, max: 20},
      {id: 'coats', label: 'Number of Coats', type: 'number', default: 2, min: 1, max: 4},
      {id: 'doors', label: 'Number of Doors', type: 'number', default: 1, min: 0, max: 10},
      {id: 'windows', label: 'Number of Windows', type: 'number', default: 2, min: 0, max: 20}
    ],
    calculate: `
      const length = parseFloat(document.getElementById('length').value) || 12;
      const width = parseFloat(document.getElementById('width').value) || 10;
      const height = parseFloat(document.getElementById('height').value) || 8;
      const coats = parseInt(document.getElementById('coats').value) || 2;
      const doors = parseInt(document.getElementById('doors').value) || 0;
      const windows = parseInt(document.getElementById('windows').value) || 0;
      
      let wallArea = 2 * (length + width) * height;
      let doorArea = doors * 20;
      let windowArea = windows * 15;
      let paintableArea = (wallArea - doorArea - windowArea) * coats;
      let gallons = Math.ceil(paintableArea / 350);
      
      document.getElementById('result-gallons').textContent = gallons + ' gallons';
      document.getElementById('result-area').textContent = Math.round(paintableArea / coats) + ' sq ft';
    `
  },
  {
    id: 'tile-calculator',
    name: 'Tile Calculator',
    description: 'Calculate how many tiles you need with waste factor included.',
    icon: '⬜',
    category: 'Planning Tools',
    categorySlug: 'planning-tools',
    inputs: [
      {id: 'roomLength', label: 'Room Length (ft)', type: 'number', default: 10, min: 1, max: 100},
      {id: 'roomWidth', label: 'Room Width (ft)', type: 'number', default: 8, min: 1, max: 100},
      {id: 'tileSize', label: 'Tile Size (inches)', type: 'select', options: ['4x4', '6x6', '8x8', '12x12', '16x16', '18x18'], default: '12x12'},
      {id: 'wasteFactor', label: 'Waste Factor (%)', type: 'number', default: 10, min: 5, max: 20}
    ],
    calculate: `
      const roomLength = parseFloat(document.getElementById('roomLength').value) || 10;
      const roomWidth = parseFloat(document.getElementById('roomWidth').value) || 8;
      const tileSize = document.getElementById('tileSize').value;
      const wasteFactor = parseFloat(document.getElementById('wasteFactor').value) || 10;
      
      let roomSqFt = roomLength * roomWidth;
      let tileDimension = parseInt(tileSize.split('x')[0]);
      let tileSqFt = (tileDimension / 12) * (tileDimension / 12);
      let tilesNeeded = Math.ceil(roomSqFt / tileSqFt);
      let withWaste = Math.ceil(tilesNeeded * (1 + wasteFactor / 100));
      
      document.getElementById('result-tiles').textContent = withWaste + ' tiles';
      document.getElementById('result-sqft').textContent = roomSqFt + ' sq ft';
      document.getElementById('result-boxes').textContent = Math.ceil(withWaste / 10) + ' boxes (est.)';
    `
  },
  {
    id: 'mulch-calculator',
    name: 'Mulch Calculator',
    description: 'Calculate how much mulch you need for garden beds and landscaping.',
    icon: '🌱',
    category: 'Planning Tools',
    categorySlug: 'planning-tools',
    inputs: [
      {id: 'bedLength', label: 'Bed Length (ft)', type: 'number', default: 20, min: 1, max: 200},
      {id: 'bedWidth', label: 'Bed Width (ft)', type: 'number', default: 5, min: 1, max: 100},
      {id: 'depth', label: 'Mulch Depth (inches)', type: 'number', default: 3, min: 1, max: 6}
    ],
    calculate: `
      const length = parseFloat(document.getElementById('bedLength').value) || 20;
      const width = parseFloat(document.getElementById('bedWidth').value) || 5;
      const depth = parseFloat(document.getElementById('depth').value) || 3;
      
      let sqFt = length * width;
      let cubicFeet = sqFt * (depth / 12);
      let cubicYards = cubicFeet / 27;
      let bags = Math.ceil(cubicFeet / 2);
      
      document.getElementById('result-yards').textContent = cubicYards.toFixed(2) + ' cubic yards';
      document.getElementById('result-bags').textContent = bags + ' bags (2 cu ft each)';
    `
  },
  {
    id: 'concrete-calculator',
    name: 'Concrete Calculator',
    description: 'Calculate cubic yards of concrete needed for slabs, footings, and more.',
    icon: '🧱',
    category: 'Planning Tools',
    categorySlug: 'planning-tools',
    inputs: [
      {id: 'shape', label: 'Shape', type: 'select', options: ['Rectangle/Square', 'Circle', 'Footings'], default: 'Rectangle/Square'},
      {id: 'length', label: 'Length (ft)', type: 'number', default: 20, min: 1, max: 200},
      {id: 'width', label: 'Width (ft)', type: 'number', default: 10, min: 1, max: 200},
      {id: 'thickness', label: 'Thickness (inches)', type: 'number', default: 4, min: 2, max: 12}
    ],
    calculate: `
      const shape = document.getElementById('shape').value;
      const length = parseFloat(document.getElementById('length').value) || 20;
      const width = parseFloat(document.getElementById('width').value) || 10;
      const thickness = parseFloat(document.getElementById('thickness').value) || 4;
      
      let cubicFeet;
      if (shape === 'Circle') {
        let radius = length / 2;
        cubicFeet = Math.PI * radius * radius * (thickness / 12);
      } else {
        cubicFeet = length * width * (thickness / 12);
      }
      let cubicYards = cubicFeet / 27;
      let bags80lb = Math.ceil(cubicYards * 45);
      
      document.getElementById('result-yards').textContent = cubicYards.toFixed(2) + ' cubic yards';
      document.getElementById('result-bags').textContent = bags80lb + ' bags (80 lb)';
    `
  },
  {
    id: 'wallpaper-calculator',
    name: 'Wallpaper Calculator',
    description: 'Calculate how many wallpaper rolls you need for your room.',
    icon: '📜',
    category: 'Planning Tools',
    categorySlug: 'planning-tools',
    inputs: [
      {id: 'roomLength', label: 'Room Length (ft)', type: 'number', default: 12, min: 1, max: 50},
      {id: 'roomWidth', label: 'Room Width (ft)', type: 'number', default: 10, min: 1, max: 50},
      {id: 'wallHeight', label: 'Wall Height (ft)', type: 'number', default: 8, min: 6, max: 15},
      {id: 'patternRepeat', label: 'Pattern Repeat (inches)', type: 'number', default: 12, min: 0, max: 36}
    ],
    calculate: `
      const length = parseFloat(document.getElementById('roomLength').value) || 12;
      const width = parseFloat(document.getElementById('roomWidth').value) || 10;
      const height = parseFloat(document.getElementById('wallHeight').value) || 8;
      const pattern = parseFloat(document.getElementById('patternRepeat').value) || 0;
      
      let perimeter = 2 * (length + width);
      let sqFt = perimeter * height;
      let rollCoverage = 30;
      let patternWaste = pattern > 0 ? 1.15 : 1.1;
      let rolls = Math.ceil((sqFt / rollCoverage) * patternWaste);
      
      document.getElementById('result-rolls').textContent = rolls + ' rolls';
      document.getElementById('result-sqft').textContent = Math.round(sqFt) + ' sq ft';
    `
  },
  {
    id: 'lumber-calculator',
    name: 'Lumber Calculator',
    description: 'Calculate board feet and lumber quantities for your project.',
    icon: '🪵',
    category: 'Planning Tools',
    categorySlug: 'planning-tools',
    inputs: [
      {id: 'pieces', label: 'Number of Pieces', type: 'number', default: 10, min: 1, max: 500},
      {id: 'thickness', label: 'Thickness (inches)', type: 'number', default: 2, min: 0.5, max: 12, step: 0.5},
      {id: 'width', label: 'Width (inches)', type: 'number', default: 4, min: 1, max: 24},
      {id: 'length', label: 'Length (ft)', type: 'number', default: 8, min: 1, max: 20}
    ],
    calculate: `
      const pieces = parseInt(document.getElementById('pieces').value) || 10;
      const thickness = parseFloat(document.getElementById('thickness').value) || 2;
      const width = parseFloat(document.getElementById('width').value) || 4;
      const length = parseFloat(document.getElementById('length').value) || 8;
      
      let boardFeet = (thickness * width * length) / 12;
      let totalBoardFeet = boardFeet * pieces;
      
      document.getElementById('result-boardfeet').textContent = totalBoardFeet.toFixed(2) + ' board feet';
      document.getElementById('result-perpiece').textContent = boardFeet.toFixed(2) + ' bf each';
    `
  },
  {
    id: 'insulation-calculator',
    name: 'Insulation Calculator',
    description: 'Calculate insulation needs based on R-value and climate zone.',
    icon: '🧤',
    category: 'Planning Tools',
    categorySlug: 'planning-tools',
    inputs: [
      {id: 'area', label: 'Area to Insulate (sq ft)', type: 'number', default: 1000, min: 50, max: 5000},
      {id: 'location', label: 'Climate Zone', type: 'select', options: ['Zone 1-2 (Warm)', 'Zone 3-4 (Mixed)', 'Zone 5-7 (Cold)', 'Zone 8 (Very Cold)'], default: 'Zone 3-4 (Mixed)'},
      {id: 'insulationType', label: 'Insulation Type', type: 'select', options: ['Attic', 'Wall', 'Basement'], default: 'Attic'},
      {id: 'material', label: 'Material', type: 'select', options: ['Fiberglass Batts', 'Blown-In', 'Spray Foam'], default: 'Fiberglass Batts'}
    ],
    calculate: `
      const area = parseFloat(document.getElementById('area').value) || 1000;
      const location = document.getElementById('location').value;
      const type = document.getElementById('insulationType').value;
      const material = document.getElementById('material').value;
      
      let rValueRecommended = type === 'Attic' ? (location.includes('1-2') ? 30 : location.includes('8') ? 60 : 49) : 
                               type === 'Wall' ? 15 : 11;
      let rPerInch = material === 'Fiberglass Batts' ? 3.2 : material === 'Blown-In' ? 3.7 : 6.5;
      let thicknessNeeded = rValueRecommended / rPerInch;
      
      document.getElementById('result-rvalue').textContent = 'R-' + rValueRecommended;
      document.getElementById('result-thickness').textContent = thicknessNeeded.toFixed(1) + ' inches';
    `
  },
  {
    id: 'grout-calculator',
    name: 'Grout Calculator',
    description: 'Calculate how much grout you need for tile installation.',
    icon: '🔲',
    category: 'Planning Tools',
    categorySlug: 'planning-tools',
    inputs: [
      {id: 'area', label: 'Tile Area (sq ft)', type: 'number', default: 100, min: 10, max: 1000},
      {id: 'tileSize', label: 'Tile Size (inches)', type: 'select', options: ['4x4', '6x6', '8x8', '12x12', '16x16'], default: '12x12'},
      {id: 'jointWidth', label: 'Joint Width', type: 'select', options: ['1/16"', '1/8"', '1/4"', '3/8"'], default: '1/8"'},
      {id: 'tileThickness', label: 'Tile Thickness', type: 'select', options: ['1/4"', '3/8"', '1/2"'], default: '3/8"'}
    ],
    calculate: `
      const area = parseFloat(document.getElementById('area').value) || 100;
      const tileSize = document.getElementById('tileSize').value;
      const jointWidth = document.getElementById('jointWidth').value;
      const thickness = document.getElementById('tileThickness').value;
      
      let jointInches = parseFloat(jointWidth.replace('"', '').split('/')[0]) / parseFloat(jointWidth.replace('"', '').split('/')[1] || 1);
      let thicknessInches = parseFloat(thickness.replace('"', '').split('/')[0]) / parseFloat(thickness.replace('"', '').split('/')[1]);
      let tileDim = parseInt(tileSize.split('x')[0]);
      
      let groutLbs = (area * jointInches * thicknessInches * 0.0625);
      
      document.getElementById('result-pounds').textContent = Math.ceil(groutLbs) + ' lbs';
      document.getElementById('result-bags').textContent = Math.ceil(groutLbs / 10) + ' bags (10 lb)';
    `
  },
  {
    id: 'deck-stain-calculator',
    name: 'Stain & Sealer Calculator',
    description: 'Calculate stain and sealer needed for decks, fences, and wood projects.',
    icon: '🪵',
    category: 'Planning Tools',
    categorySlug: 'planning-tools',
    inputs: [
      {id: 'length', label: 'Length (ft)', type: 'number', default: 20, min: 1, max: 100},
      {id: 'width', label: 'Width (ft)', type: 'number', default: 12, min: 1, max: 100},
      {id: 'surface', label: 'Surface Type', type: 'select', options: ['Deck (one side)', 'Fence (both sides)', 'Siding'], default: 'Deck (one side)'},
      {id: 'coats', label: 'Number of Coats', type: 'number', default: 2, min: 1, max: 3}
    ],
    calculate: `
      const length = parseFloat(document.getElementById('length').value) || 20;
      const width = parseFloat(document.getElementById('width').value) || 12;
      const surface = document.getElementById('surface').value;
      const coats = parseInt(document.getElementById('coats').value) || 2;
      
      let area = length * width;
      if (surface.includes('both sides')) area *= 2;
      let coverage = 250;
      let gallons = Math.ceil((area * coats) / coverage);
      
      document.getElementById('result-gallons').textContent = gallons + ' gallons';
      document.getElementById('result-area').textContent = Math.round(area) + ' sq ft';
    `
  },
  {
    id: 'home-maintenance-schedule',
    name: 'Home Maintenance Schedule Generator',
    description: 'Generate a personalized home maintenance schedule.',
    icon: '📅',
    category: 'Planning Tools',
    categorySlug: 'planning-tools',
    inputs: [
      {id: 'homeAge', label: 'Home Age (years)', type: 'number', default: 10, min: 0, max: 100},
      {id: 'homeSize', label: 'Home Size (sq ft)', type: 'number', default: 2000, min: 500, max: 10000},
      {id: 'climate', label: 'Climate', type: 'select', options: ['Cold/Snow', 'Hot/Dry', 'Humid/Coastal', 'Moderate'], default: 'Moderate'}
    ],
    calculate: `
      const age = parseInt(document.getElementById('homeAge').value) || 10;
      const size = parseFloat(document.getElementById('homeSize').value) || 2000;
      const climate = document.getElementById('climate').value;
      
      let tasks = [
        'Monthly: Replace HVAC filters',
        'Quarterly: Clean gutters and downspouts',
        'Quarterly: Test smoke and CO detectors',
        'Semi-Annual: Clean dryer vent',
        'Annual: Service HVAC system',
        'Annual: Clean chimney (if applicable)',
        'Annual: Inspect roof and flashing'
      ];
      
      if (age > 15) tasks.push('Annual: Inspect water heater');
      if (climate.includes('Snow')) tasks.push('Fall: Winterize outdoor faucets');
      
      document.getElementById('result-tasks').innerHTML = tasks.map(t => '<li class="mb-2">' + t + '</li>').join('');
    `
  },
  {
    id: 'project-timeline-estimator',
    name: 'Project Timeline Estimator',
    description: 'Estimate how long your home improvement project will take.',
    icon: '⏱️',
    category: 'Planning Tools',
    categorySlug: 'planning-tools',
    inputs: [
      {id: 'projectType', label: 'Project Type', type: 'select', options: ['Bathroom Remodel', 'Kitchen Remodel', 'Deck Building', 'Room Addition', 'Roof Replacement', 'Painting'], default: 'Bathroom Remodel'},
      {id: 'scope', label: 'Project Scope', type: 'select', options: ['Small', 'Medium', 'Large'], default: 'Medium'},
      {id: 'crew', label: 'Team Size', type: 'select', options: ['DIY Solo', 'DIY + Helper', 'Professional Crew'], default: 'Professional Crew'}
    ],
    calculate: `
      const project = document.getElementById('projectType').value;
      const scope = document.getElementById('scope').value;
      const crew = document.getElementById('crew').value;
      
      let baseDays = {
        'Bathroom Remodel': 14,
        'Kitchen Remodel': 30,
        'Deck Building': 10,
        'Room Addition': 60,
        'Roof Replacement': 3,
        'Painting': 5
      };
      
      let scopeMultiplier = scope === 'Small' ? 0.6 : scope === 'Large' ? 1.5 : 1;
      let crewMultiplier = crew === 'DIY Solo' ? 2.5 : crew === 'DIY + Helper' ? 1.5 : 1;
      let days = Math.ceil(baseDays[project] * scopeMultiplier * crewMultiplier);
      
      document.getElementById('result-days').textContent = days + ' days';
      document.getElementById('result-weeks').textContent = Math.ceil(days / 7) + ' weeks';
    `
  },
  {
    id: 'home-repair-priority-planner',
    name: 'Home Repair Priority Planner',
    description: 'Prioritize repairs based on urgency, cost, and impact.',
    icon: '📋',
    category: 'Planning Tools',
    categorySlug: 'planning-tools',
    inputs: [
      {id: 'repair1', label: 'Repair Category', type: 'select', options: ['Roof', 'HVAC', 'Plumbing', 'Electrical', 'Cosmetic'], default: 'Roof'},
      {id: 'urgency1', label: 'Urgency (1-10)', type: 'number', default: 8, min: 1, max: 10},
      {id: 'cost1', label: 'Est. Cost ($)', type: 'number', default: 5000, min: 100, max: 50000}
    ],
    calculate: `
      const repair = document.getElementById('repair1').value;
      const urgency = parseInt(document.getElementById('urgency1').value) || 5;
      const cost = parseFloat(document.getElementById('cost1').value) || 1000;
      
      let criticalRepairs = ['Roof', 'HVAC', 'Electrical', 'Plumbing'];
      let priority = criticalRepairs.includes(repair) ? 'HIGH' : urgency > 7 ? 'HIGH' : urgency > 4 ? 'MEDIUM' : 'LOW';
      let timeline = urgency > 8 ? 'Immediate (within days)' : urgency > 5 ? 'Soon (within weeks)' : 'Plan for next season';
      
      document.getElementById('result-priority').textContent = priority;
      document.getElementById('result-timeline').textContent = timeline;
    `
  },
  {
    id: 'emergency-repair-checklist',
    name: 'Emergency Repair Checklist Generator',
    description: 'Get a checklist for handling home repair emergencies.',
    icon: '🚨',
    category: 'Planning Tools',
    categorySlug: 'planning-tools',
    inputs: [
      {id: 'emergency', label: 'Emergency Type', type: 'select', options: ['Water Leak', 'No Heat', 'No AC', 'Electrical Outage', 'Gas Leak', 'Broken Window'], default: 'Water Leak'}
    ],
    calculate: `
      const emergency = document.getElementById('emergency').value;
      
      let checklists = {
        'Water Leak': [
          '✓ Shut off main water valve',
          '✓ Turn off power to affected area if water near outlets',
          '✓ Move furniture/valuables away from water',
          '✓ Place buckets/towels to contain water',
          '✓ Document damage with photos',
          '✓ Call plumber if leak persists'
        ],
        'No Heat': [
          '✓ Check thermostat settings and batteries',
          '✓ Verify furnace/boiler is receiving power',
          '✓ Check circuit breaker',
          '✓ Replace furnace filter if dirty',
          '✓ Check pilot light (gas systems)',
          '✓ Call HVAC technician if no heat after 1 hour'
        ],
        'Gas Leak': [
          '✓ DO NOT turn on/off lights or electronics',
          '✓ Evacuate everyone immediately',
          '✓ Leave doors open',
          '✓ Call gas company from outside',
          '✓ Call 911 if strong odor',
          '✓ Do not re-enter until cleared by professionals'
        ]
      };
      
      let steps = checklists[emergency] || ['✓ Assess the situation', '✓ Call appropriate professional'];
      document.getElementById('result-checklist').innerHTML = steps.map(s => '<li class="mb-2">' + s + '</li>').join('');
    `
  },
  {
    id: 'seasonal-maintenance-checklist',
    name: 'Seasonal Home Maintenance Checklist',
    description: 'Get a seasonal maintenance checklist for your home.',
    icon: '🍂',
    category: 'Planning Tools',
    categorySlug: 'planning-tools',
    inputs: [
      {id: 'season', label: 'Season', type: 'select', options: ['Spring', 'Summer', 'Fall', 'Winter'], default: 'Spring'},
      {id: 'homeType', label: 'Home Type', type: 'select', options: ['Single Family', 'Condo/Townhouse', 'Apartment'], default: 'Single Family'}
    ],
    calculate: `
      const season = document.getElementById('season').value;
      const homeType = document.getElementById('homeType').value;
      
      let tasks = {
        'Spring': [
          'Clean gutters and downspouts',
          'Inspect roof for winter damage',
          'Service AC before hot weather',
          'Clean/seal deck or patio',
          'Check exterior paint and caulking',
          'Test sprinkler system'
        ],
        'Fall': [
          'Clean gutters and remove leaves',
          'Service furnace before cold weather',
          'Inspect chimney and fireplace',
          'Winterize outdoor faucets',
          'Check weatherstripping on doors/windows',
          'Drain garden hoses'
        ]
      };
      
      let seasonTasks = tasks[season] || ['Check smoke detectors', 'Inspect plumbing'];
      if (homeType === 'Apartment') seasonTasks = seasonTasks.slice(0, 3);
      
      document.getElementById('result-tasks').innerHTML = seasonTasks.map(t => '<li class="mb-2">□ ' + t + '</li>').join('');
    `
  },

  // Diagnostic/Troubleshooting Tools (10)
  {
    id: 'toilet-troubleshooter',
    name: 'Toilet Troubleshooter',
    description: 'Diagnose common toilet problems and find solutions.',
    icon: '🚽',
    category: 'Diagnostic Tools',
    categorySlug: 'diagnostic-tools',
    inputs: [
      {id: 'symptom', label: 'What\'s the problem?', type: 'select', options: ['Running constantly', 'Won\'t flush', 'Clogged', 'Leaking at base', 'Weak flush', 'Won\'t stop filling'], default: 'Running constantly'}
    ],
    calculate: `
      const symptom = document.getElementById('symptom').value;
      
      let solutions = {
        'Running constantly': {
          cause: 'Flapper valve or fill valve issue',
          fix: 'Replace the flapper valve ($5-10). If still running, replace fill valve ($15-25).',
          difficulty: 'Easy',
          time: '15-30 minutes'
        },
        'Won\\'t flush': {
          cause: 'Chain disconnected, handle broken, or flapper not lifting',
          fix: 'Check chain connection. Adjust chain length. Replace handle if broken.',
          difficulty: 'Easy',
          time: '10-20 minutes'
        },
        'Clogged': {
          cause: 'Obstruction in drain or trap',
          fix: 'Use plunger first. If that fails, use toilet auger. Avoid chemical drain cleaners.',
          difficulty: 'Easy',
          time: '10-30 minutes'
        }
      };
      
      let solution = solutions[symptom] || {cause: 'Unknown', fix: 'Consult a plumber', difficulty: 'Unknown', time: 'Varies'};
      
      document.getElementById('result-cause').textContent = solution.cause;
      document.getElementById('result-fix').textContent = solution.fix;
      document.getElementById('result-difficulty').textContent = solution.difficulty;
      document.getElementById('result-time').textContent = solution.time;
    `
  },
  {
    id: 'hvac-troubleshooter',
    name: 'HVAC Problem Diagnoser',
    description: 'Diagnose heating and cooling system problems.',
    icon: '❄️',
    category: 'Diagnostic Tools',
    categorySlug: 'diagnostic-tools',
    inputs: [
      {id: 'issue', label: 'What\'s happening?', type: 'select', options: ['No cooling', 'No heating', 'Short cycling', 'Strange noises', 'Bad odor', 'High energy bills'], default: 'No cooling'}
    ],
    calculate: `
      const issue = document.getElementById('issue').value;
      
      let diagnoses = {
        'No cooling': {
          checks: ['Check thermostat settings', 'Verify power to outdoor unit', 'Check for tripped breaker', 'Inspect air filter'],
          likely: 'Thermostat issue, dirty filter, or refrigerant leak',
          action: 'Replace filter first. If no change, call HVAC tech.'
        },
        'Short cycling': {
          checks: ['Clean/replace air filter', 'Check for blocked vents', 'Inspect outdoor unit for debris'],
          likely: 'Dirty filter, blocked airflow, or oversized system',
          action: 'Clean filter and clear obstructions. If continues, call tech.'
        }
      };
      
      let diagnosis = diagnoses[issue] || {checks: ['Check basics'], likely: 'Unknown', action: 'Call professional'};
      
      document.getElementById('result-checks').innerHTML = diagnosis.checks.map(c => '<li class="mb-1">• ' + c + '</li>').join('');
      document.getElementById('result-likely').textContent = diagnosis.likely;
      document.getElementById('result-action').textContent = diagnosis.action;
    `
  },
  {
    id: 'water-heater-troubleshooter',
    name: 'Water Heater Troubleshooter',
    description: 'Diagnose water heater problems and solutions.',
    icon: '🚿',
    category: 'Diagnostic Tools',
    categorySlug: 'diagnostic-tools',
    inputs: [
      {id: 'problem', label: 'Problem', type: 'select', options: ['No hot water', 'Not enough hot water', 'Water too hot', 'Strange noises', 'Leaking', 'Rusty water'], default: 'No hot water'}
    ],
    calculate: `
      const problem = document.getElementById('problem').value;
      
      let solutions = {
        'No hot water': {
          cause: 'Power issue, tripped breaker, or failed heating element',
          steps: ['Check breaker box', 'Verify pilot light (gas)', 'Test heating elements (electric)'],
          callPro: problem.includes('No hot') && 'If breaker is on and pilot lit, call plumber'
        },
        'Leaking': {
          cause: 'Failed pressure relief valve or tank corrosion',
          steps: ['Check temperature/pressure relief valve', 'Inspect connections', 'Look for tank corrosion'],
          callPro: 'If tank is leaking, replacement needed immediately'
        }
      };
      
      let solution = solutions[problem] || {cause: 'Various', steps: ['Inspect unit'], callPro: 'Consult professional'};
      
      document.getElementById('result-cause').textContent = solution.cause;
      document.getElementById('result-steps').innerHTML = solution.steps.map(s => '<li class="mb-1">• ' + s + '</li>').join('');
      document.getElementById('result-callpro').textContent = solution.callPro;
    `
  },
  {
    id: 'garbage-disposal-troubleshooter',
    name: 'Garbage Disposal Fix Finder',
    description: 'Diagnose and fix common garbage disposal problems.',
    icon: '🔧',
    category: 'Diagnostic Tools',
    categorySlug: 'diagnostic-tools',
    inputs: [
      {id: 'issue', label: 'Issue', type: 'select', options: ['Won\'t turn on', 'Humming but not spinning', 'Jammed', 'Leaking', 'Slow draining'], default: 'Won\'t turn on'}
    ],
    calculate: `
      const issue = document.getElementById('issue').value;
      
      let fixes = {
        'Won\\'t turn on': 'Press reset button on bottom of unit. Check breaker box. If still dead, motor may be burnt out.',
        'Humming but not spinning': 'TURN OFF POWER. Use Allen wrench on bottom to manually rotate flywheel. Remove jam with tongs.',
        'Jammed': 'TURN OFF POWER. Use wooden spoon to manually turn blades. Remove obstruction. Press reset button.',
        'Leaking': 'Check sink flange seal, discharge pipe connection, and bottom seals. Tighten or replace gaskets as needed.'
      };
      
      document.getElementById('result-solution').textContent = fixes[issue] || 'Consult manufacturer manual or call plumber.';
      document.getElementById('result-warning').textContent = issue.includes('turn on') || issue.includes('Humming') ? 
        '⚠️ ALWAYS turn off power before working on disposal' : '';
    `
  },
  {
    id: 'electrical-troubleshooter',
    name: 'Electrical Problem Diagnoser',
    description: 'Diagnose electrical issues like tripped breakers and dead outlets.',
    icon: '⚡',
    category: 'Diagnostic Tools',
    categorySlug: 'diagnostic-tools',
    inputs: [
      {id: 'problem', label: 'Electrical Problem', type: 'select', options: ['Outlet not working', 'Light won\'t turn on', 'Breaker keeps tripping', 'Flickering lights', 'Burning smell'], default: 'Outlet not working'}
    ],
    calculate: `
      const problem = document.getElementById('problem').value;
      
      let diagnoses = {
        'Outlet not working': {
          checks: ['Test outlet with lamp', 'Check circuit breaker', 'Press GFCI reset button if applicable', 'Check other outlets on same circuit'],
          warning: 'If multiple outlets dead, could be loose wire connection - call electrician',
          danger: 'LOW'
        },
        'Breaker keeps tripping': {
          checks: ['Identify what appliances are on that circuit', 'Unplug devices and reset breaker', 'Plug in devices one at a time'],
          warning: 'Overloaded circuit, faulty appliance, or short circuit',
          danger: 'MEDIUM - Call electrician if it trips immediately'
        },
        'Burning smell': {
          checks: ['Shut off power to area immediately', 'Check outlets for black marks', 'Inspect breaker panel'],
          warning: 'STOP USING IMMEDIATELY - This is a fire hazard!',
          danger: 'HIGH - Call electrician NOW'
        }
      };
      
      let diagnosis = diagnoses[problem] || {checks: ['Call electrician'], warning: 'Unknown issue', danger: 'MEDIUM'};
      
      document.getElementById('result-checks').innerHTML = diagnosis.checks.map(c => '<li class="mb-1">• ' + c + '</li>').join('');
      document.getElementById('result-warning').textContent = diagnosis.warning;
      document.getElementById('result-danger').textContent = 'Danger Level: ' + diagnosis.danger;
      document.getElementById('result-danger').className = diagnosis.danger === 'HIGH' ? 'font-bold text-red-600' : 'text-gray-700';
    `
  },
  {
    id: 'appliance-error-code-lookup',
    name: 'Appliance Error Code Lookup',
    description: 'Look up error codes for common appliances.',
    icon: '🔍',
    category: 'Diagnostic Tools',
    categorySlug: 'diagnostic-tools',
    inputs: [
      {id: 'appliance', label: 'Appliance', type: 'select', options: ['Dishwasher', 'Washing Machine', 'Dryer', 'Refrigerator', 'Oven'], default: 'Dishwasher'},
      {id: 'errorCode', label: 'Error Code', type: 'text', default: 'E1'}
    ],
    calculate: `
      const appliance = document.getElementById('appliance').value;
      const code = document.getElementById('errorCode').value.toUpperCase();
      
      let codes = {
        'Dishwasher': {
          'E1': 'Water inlet issue - check water supply and inlet valve',
          'E4': 'Overflow detected - check for leaks and drain pump',
          'F1': 'Temperature sensor fault - may need replacement'
        },
        'Washing Machine': {
          'E1': 'Water fill issue - check hoses and water pressure',
          'UE': 'Unbalanced load - redistribute clothes',
          'OE': 'Drain error - check drain hose and pump filter'
        }
      };
      
      let meaning = (codes[appliance] && codes[appliance][code]) || 'Error code not found. Check manufacturer manual.';
      
      document.getElementById('result-meaning').textContent = meaning;
      document.getElementById('result-note').textContent = 'Note: Error codes vary by brand/model. Consult your manual for specifics.';
    `
  },
  {
    id: 'roof-leak-detector',
    name: 'Roof Leak Locator Guide',
    description: 'Interactive guide to help locate the source of roof leaks.',
    icon: '💧',
    category: 'Diagnostic Tools',
    categorySlug: 'diagnostic-tools',
    inputs: [
      {id: 'location', label: 'Where is water entering?', type: 'select', options: ['Ceiling stain', 'Along wall', 'Around chimney', 'Near vent pipe', 'Skylight'], default: 'Ceiling stain'},
      {id: 'weather', label: 'When does it leak?', type: 'select', options: ['During heavy rain', 'After any rain', 'During snow melt', 'Only with wind'], default: 'During heavy rain'}
    ],
    calculate: `
      const location = document.getElementById('location').value;
      const weather = document.getElementById('weather').value;
      
      let findings = {
        'Ceiling stain': {
          likely: 'Missing/damaged shingles, flashing failure, or ice dam',
          lookFor: 'Check roof above stain. Water travels, so leak may be uphill from stain.',
          urgency: 'MEDIUM - Address soon to prevent mold/damage'
        },
        'Around chimney': {
          likely: 'Failed chimney flashing or deteriorated mortar',
          lookFor: 'Inspect flashing around chimney base. Check for gaps or rust.',
          urgency: 'HIGH - Chimney leaks worsen quickly'
        }
      };
      
      let finding = findings[location] || {likely: 'Unknown', lookFor: 'Inspect roof carefully', urgency: 'MEDIUM'};
      
      document.getElementById('result-likely').textContent = finding.likely;
      document.getElementById('result-lookfor').textContent = finding.lookFor;
      document.getElementById('result-urgency').textContent = finding.urgency;
    `
  },
  {
    id: 'plumbing-noise-identifier',
    name: 'Plumbing Noise Identifier',
    description: 'Identify what plumbing noises mean and how to fix them.',
    icon: '🔊',
    category: 'Diagnostic Tools',
    categorySlug: 'diagnostic-tools',
    inputs: [
      {id: 'noise', label: 'Type of noise', type: 'select', options: ['Banging/hammering', 'Gurgling', 'Whistling', 'Dripping', 'Rattling'], default: 'Banging/hammering'},
      {id: 'when', label: 'When do you hear it?', type: 'select', options: ['Turning on/off faucet', 'Flushing toilet', 'Using shower', 'Constantly', 'Randomly'], default: 'Turning on/off faucet'}
    ],
    calculate: `
      const noise = document.getElementById('noise').value;
      const when = document.getElementById('when').value;
      
      let diagnoses = {
        'Banging/hammering': 'Water hammer - caused by sudden water shutoff. Install water hammer arrestors or air chambers.',
        'Gurgling': 'Venting issue or partial clog. Check drain vents on roof. May need plumber to clear.',
        'Whistling': 'Worn valve or partially closed valve. Replace valve washer or fully open water valves.',
        'Dripping': 'Worn faucet washers or valve seats. Replace washers or cartridge.'
      };
      
      let diagnosis = diagnoses[noise] || 'Consult plumber for unusual sounds.';
      
      document.getElementById('result-cause').textContent = noise + ' sound indicates:';
      document.getElementById('result-fix').textContent = diagnosis;
      document.getElementById('result-severity').textContent = noise.includes('Banging') ? 'Can damage pipes - fix soon' : 'Annoying but not urgent';
    `
  },
  {
    id: 'mold-risk-assessment',
    name: 'Mold Risk Assessment Tool',
    description: 'Assess mold risk and get prevention recommendations.',
    icon: '🦠',
    category: 'Diagnostic Tools',
    categorySlug: 'diagnostic-tools',
    inputs: [
      {id: 'humidity', label: 'Indoor Humidity Level', type: 'select', options: ['< 30%', '30-50%', '50-60%', '> 60%'], default: '30-50%'},
      {id: 'ventilation', label: 'Ventilation', type: 'select', options: ['Excellent', 'Good', 'Fair', 'Poor'], default: 'Good'},
      {id: 'leaks', label: 'Water leaks or damage?', type: 'select', options: ['None', 'Minor/past', 'Current'], default: 'None'},
      {id: 'condensation', label: 'Window condensation?', type: 'select', options: ['Never', 'Rarely', 'Often'], default: 'Never'}
    ],
    calculate: `
      const humidity = document.getElementById('humidity').value;
      const ventilation = document.getElementById('ventilation').value;
      const leaks = document.getElementById('leaks').value;
      const condensation = document.getElementById('condensation').value;
      
      let riskScore = 0;
      if (humidity.includes('> 60')) riskScore += 3;
      else if (humidity.includes('50-60')) riskScore += 2;
      if (ventilation === 'Poor') riskScore += 2;
      else if (ventilation === 'Fair') riskScore += 1;
      if (leaks === 'Current') riskScore += 3;
      else if (leaks === 'Minor/past') riskScore += 1;
      if (condensation === 'Often') riskScore += 2;
      
      let riskLevel = riskScore >= 6 ? 'HIGH' : riskScore >= 3 ? 'MODERATE' : 'LOW';
      let recommendations = [];
      
      if (humidity.includes('> 60') || humidity.includes('50-60')) recommendations.push('Use dehumidifier to keep humidity 30-50%');
      if (ventilation !== 'Excellent') recommendations.push('Improve ventilation - use exhaust fans in bathrooms/kitchen');
      if (leaks !== 'None') recommendations.push('Fix all water leaks immediately');
      if (condensation !== 'Never') recommendations.push('Increase insulation and air circulation');
      
      document.getElementById('result-risk').textContent = riskLevel;
      document.getElementById('result-risk').className = riskLevel === 'HIGH' ? 'text-3xl font-bold text-red-600' : 
                                                          riskLevel === 'MODERATE' ? 'text-3xl font-bold text-orange-600' : 'text-3xl font-bold text-green-600';
      document.getElementById('result-recommendations').innerHTML = recommendations.map(r => '<li class="mb-2">• ' + r + '</li>').join('');
    `
  },
  {
    id: 'foundation-crack-evaluator',
    name: 'Foundation Crack Evaluator',
    description: 'Assess foundation cracks and determine if professional help is needed.',
    icon: '🏚️',
    category: 'Diagnostic Tools',
    categorySlug: 'diagnostic-tools',
    inputs: [
      {id: 'width', label: 'Crack Width', type: 'select', options: ['Hairline (< 1/16")', 'Small (1/16" - 1/8")', 'Medium (1/8" - 1/4")', 'Large (> 1/4")'], default: 'Hairline (< 1/16")'},
      {id: 'direction', label: 'Crack Direction', type: 'select', options: ['Vertical', 'Horizontal', 'Diagonal', 'Stair-step (brick)'], default: 'Vertical'},
      {id: 'growing', label: 'Is it growing?', type: 'select', options: ['Not sure', 'No', 'Yes'], default: 'Not sure'},
      {id: 'location', label: 'Location', type: 'select', options: ['Interior wall', 'Exterior wall', 'Floor', 'Multiple areas'], default: 'Interior wall'}
    ],
    calculate: `
      const width = document.getElementById('width').value;
      const direction = document.getElementById('direction').value;
      const growing = document.getElementById('growing').value;
      const location = document.getElementById('location').value;
      
      let severity = 'MINOR';
      let action = 'Monitor - likely normal settling';
      
      if (width.includes('Large') || direction === 'Horizontal' || growing === 'Yes' || location === 'Multiple areas') {
        severity = 'SERIOUS';
        action = 'Call structural engineer immediately';
      } else if (width.includes('Medium') || direction.includes('Diagonal') || direction.includes('Stair')) {
        severity = 'MODERATE';
        action = 'Have foundation specialist inspect';
      }
      
      document.getElementById('result-severity').textContent = severity;
      document.getElementById('result-severity').className = severity === 'SERIOUS' ? 'text-3xl font-bold text-red-600' : 
                                                              severity === 'MODERATE' ? 'text-3xl font-bold text-orange-600' : 'text-3xl font-bold text-green-600';
      document.getElementById('result-action').textContent = action;
      document.getElementById('result-note').textContent = 'Note: Horizontal cracks and cracks > 1/4" are always serious. Get professional assessment.';
    `
  },

  // Utility/Comparison Tools (10)
  {
    id: 'energy-savings-calculator',
    name: 'Energy Savings Calculator',
    description: 'Calculate ROI on energy-efficient home upgrades.',
    icon: '💡',
    category: 'Utility Tools',
    categorySlug: 'utility-tools',
    inputs: [
      {id: 'upgrade', label: 'Upgrade Type', type: 'select', options: ['LED Light Bulbs', 'Smart Thermostat', 'Insulation', 'Energy Star Windows', 'Solar Panels'], default: 'LED Light Bulbs'},
      {id: 'currentCost', label: 'Current Annual Energy Cost ($)', type: 'number', default: 2400, min: 100, max: 10000}
    ],
    calculate: `
      const upgrade = document.getElementById('upgrade').value;
      const currentCost = parseFloat(document.getElementById('currentCost').value) || 2400;
      
      let savings = {
        'LED Light Bulbs': {pct: 0.75, cost: 200},
        'Smart Thermostat': {pct: 0.15, cost: 200},
        'Insulation': {pct: 0.20, cost: 2500},
        'Energy Star Windows': {pct: 0.15, cost: 8000},
        'Solar Panels': {pct: 0.70, cost: 15000}
      };
      
      let data = savings[upgrade];
      let annualSavings = currentCost * data.pct;
      let roi = (data.cost / annualSavings).toFixed(1);
      
      document.getElementById('result-annual').textContent = '$' + Math.round(annualSavings).toLocaleString() + '/year';
      document.getElementById('result-upfront').textContent = '$' + data.cost.toLocaleString();
      document.getElementById('result-roi').textContent = roi + ' years';
    `
  },
  {
    id: 'home-value-impact-calculator',
    name: 'Home Value Impact Calculator',
    description: 'Estimate which repairs add the most value to your home.',
    icon: '📈',
    category: 'Utility Tools',
    categorySlug: 'utility-tools',
    inputs: [
      {id: 'project', label: 'Home Improvement', type: 'select', options: ['Kitchen Remodel', 'Bathroom Remodel', 'New Roof', 'Deck Addition', 'Siding Replacement', 'Window Replacement'], default: 'Kitchen Remodel'},
      {id: 'projectCost', label: 'Project Cost ($)', type: 'number', default: 25000, min: 1000, max: 100000}
    ],
    calculate: `
      const project = document.getElementById('project').value;
      const cost = parseFloat(document.getElementById('projectCost').value) || 25000;
      
      let roi = {
        'Kitchen Remodel': 0.65,
        'Bathroom Remodel': 0.60,
        'New Roof': 0.85,
        'Deck Addition': 0.70,
        'Siding Replacement': 0.75,
        'Window Replacement': 0.70
      };
      
      let valueAdded = cost * roi[project];
      let roiPct = (roi[project] * 100).toFixed(0);
      
      document.getElementById('result-value').textContent = '$' + Math.round(valueAdded).toLocaleString();
      document.getElementById('result-roi').textContent = roiPct + '%';
    `
  },
  {
    id: 'tool-finder-quiz',
    name: 'Tool Finder Quiz',
    description: 'Find out what tools you need for your project.',
    icon: '🔨',
    category: 'Utility Tools',
    categorySlug: 'utility-tools',
    inputs: [
      {id: 'project', label: 'Project Type', type: 'select', options: ['Hanging Pictures', 'Basic Plumbing', 'Painting', 'Building Deck', 'Electrical Work'], default: 'Hanging Pictures'}
    ],
    calculate: `
      const project = document.getElementById('project').value;
      
      let toolLists = {
        'Hanging Pictures': ['Hammer or drill', 'Level', 'Pencil', 'Stud finder', 'Picture hangers/anchors'],
        'Basic Plumbing': ['Adjustable wrench', 'Pipe wrench', 'Plunger', 'Plumbers tape', 'Bucket'],
        'Painting': ['Paint brushes', 'Roller and tray', 'Drop cloths', 'Painters tape', 'Ladder'],
        'Building Deck': ['Circular saw', 'Drill/driver', 'Level', 'Tape measure', 'Post hole digger', 'Speed square'],
        'Electrical Work': ['Voltage tester', 'Wire strippers', 'Screwdrivers', 'Needle-nose pliers', 'Flashlight']
      };
      
      let tools = toolLists[project] || ['Basic tool set'];
      
      document.getElementById('result-tools').innerHTML = tools.map(t => '<li class="mb-2">✓ ' + t + '</li>').join('');
      document.getElementById('result-safety').textContent = project === 'Electrical Work' ? 
        '⚠️ Always turn off power at breaker before electrical work!' : '';
    `
  },
  {
    id: 'contractor-comparison-checklist',
    name: 'Contractor Comparison Checklist',
    description: 'Checklist to compare and vet contractors.',
    icon: '📋',
    category: 'Utility Tools',
    categorySlug: 'utility-tools',
    inputs: [
      {id: 'projectType', label: 'Project Type', type: 'select', options: ['General Contracting', 'Plumbing', 'Electrical', 'HVAC', 'Roofing'], default: 'General Contracting'}
    ],
    calculate: `
      const projectType = document.getElementById('projectType').value;
      
      let checklistItems = [
        '□ Licensed and insured',
        '□ Get 3+ written quotes',
        '□ Check references (ask for 3+)',
        '□ Verify BBB rating',
        '□ Check online reviews',
        '□ Detailed written contract',
        '□ Payment schedule in writing',
        '□ Timeline with milestones',
        '□ Warranty information',
        '□ Permit handling clarified'
      ];
      
      if (projectType === 'Electrical' || projectType === 'Plumbing') {
        checklistItems.push('□ Verify master license number');
      }
      
      document.getElementById('result-checklist').innerHTML = checklistItems.map(item => '<li class="mb-2">' + item + '</li>').join('');
    `
  },
  {
    id: 'btu-calculator',
    name: 'BTU Calculator',
    description: 'Calculate what size air conditioner or heater you need.',
    icon: '🌡️',
    category: 'Utility Tools',
    categorySlug: 'utility-tools',
    inputs: [
      {id: 'roomSize', label: 'Room Size (sq ft)', type: 'number', default: 300, min: 50, max: 2000},
      {id: 'ceilingHeight', label: 'Ceiling Height', type: 'select', options: ['8 ft (standard)', '10 ft (high)', '12+ ft (very high)'], default: '8 ft (standard)'},
      {id: 'sunlight', label: 'Sun Exposure', type: 'select', options: ['Shaded', 'Average', 'Very Sunny'], default: 'Average'},
      {id: 'climate', label: 'Climate', type: 'select', options: ['Cool', 'Moderate', 'Hot'], default: 'Moderate'}
    ],
    calculate: `
      const size = parseFloat(document.getElementById('roomSize').value) || 300;
      const ceiling = document.getElementById('ceilingHeight').value;
      const sunlight = document.getElementById('sunlight').value;
      const climate = document.getElementById('climate').value;
      
      let btuPerSqFt = 20;
      if (ceiling.includes('10 ft')) btuPerSqFt *= 1.25;
      if (ceiling.includes('12+')) btuPerSqFt *= 1.5;
      if (sunlight === 'Shaded') btuPerSqFt *= 0.9;
      if (sunlight === 'Very Sunny') btuPerSqFt *= 1.2;
      if (climate === 'Hot') btuPerSqFt *= 1.2;
      
      let btuNeeded = Math.round(size * btuPerSqFt);
      let tons = (btuNeeded / 12000).toFixed(1);
      
      document.getElementById('result-btu').textContent = btuNeeded.toLocaleString() + ' BTU';
      document.getElementById('result-tons').textContent = tons + ' tons (for central AC)';
    `
  },
  {
    id: 'stud-spacing-calculator',
    name: 'Stud Spacing Calculator',
    description: 'Calculate stud spacing and quantities for wall framing.',
    icon: '📏',
    category: 'Utility Tools',
    categorySlug: 'utility-tools',
    inputs: [
      {id: 'wallLength', label: 'Wall Length (ft)', type: 'number', default: 16, min: 4, max: 100},
      {id: 'spacing', label: 'Stud Spacing', type: 'select', options: ['16" O.C.', '24" O.C.'], default: '16" O.C.'},
      {id: 'wallHeight', label: 'Wall Height (ft)', type: 'number', default: 8, min: 6, max: 12}
    ],
    calculate: `
      const length = parseFloat(document.getElementById('wallLength').value) || 16;
      const spacing = document.getElementById('spacing').value;
      const height = parseFloat(document.getElementById('wallHeight').value) || 8;
      
      let spacingInches = parseInt(spacing.split('"')[0]);
      let studsNeeded = Math.ceil((length * 12) / spacingInches) + 1;
      let plates = length * 3;
      
      document.getElementById('result-studs').textContent = studsNeeded + ' studs (' + height + 'ft each)';
      document.getElementById('result-plates').textContent = Math.ceil(plates) + ' linear ft (for top/bottom plates)';
    `
  },
  {
    id: 'roof-pitch-calculator',
    name: 'Roof Pitch Calculator',
    description: 'Calculate roof pitch and angle from measurements.',
    icon: '📐',
    category: 'Utility Tools',
    categorySlug: 'utility-tools',
    inputs: [
      {id: 'rise', label: 'Rise (inches over 12")', type: 'number', default: 6, min: 1, max: 24},
      {id: 'run', label: 'Run (inches)', type: 'number', default: 12, min: 1, max: 24}
    ],
    calculate: `
      const rise = parseFloat(document.getElementById('rise').value) || 6;
      const run = parseFloat(document.getElementById('run').value) || 12;
      
      let angle = Math.atan(rise / run) * (180 / Math.PI);
      let pitch = rise + '/' + run;
      
      document.getElementById('result-pitch').textContent = pitch + ' pitch';
      document.getElementById('result-angle').textContent = angle.toFixed(1) + '°';
    `
  },
  {
    id: 'board-foot-calculator',
    name: 'Board Foot Calculator',
    description: 'Calculate board feet for lumber pricing.',
    icon: '🪵',
    category: 'Utility Tools',
    categorySlug: 'utility-tools',
    inputs: [
      {id: 'thickness', label: 'Thickness (inches)', type: 'number', default: 2, min: 0.5, max: 12, step: 0.25},
      {id: 'width', label: 'Width (inches)', type: 'number', default: 6, min: 1, max: 24},
      {id: 'length', label: 'Length (ft)', type: 'number', default: 8, min: 1, max: 20},
      {id: 'quantity', label: 'Quantity', type: 'number', default: 1, min: 1, max: 500}
    ],
    calculate: `
      const thickness = parseFloat(document.getElementById('thickness').value) || 2;
      const width = parseFloat(document.getElementById('width').value) || 6;
      const length = parseFloat(document.getElementById('length').value) || 8;
      const quantity = parseInt(document.getElementById('quantity').value) || 1;
      
      let boardFeet = (thickness * width * length) / 12;
      let totalBoardFeet = boardFeet * quantity;
      
      document.getElementById('result-boardfeet').textContent = totalBoardFeet.toFixed(2) + ' board feet';
      document.getElementById('result-perpiece').textContent = boardFeet.toFixed(2) + ' bf per piece';
    `
  },
  {
    id: 'wire-gauge-calculator',
    name: 'Wire Gauge Calculator',
    description: 'Determine correct electrical wire gauge for your project.',
    icon: '⚡',
    category: 'Utility Tools',
    categorySlug: 'utility-tools',
    inputs: [
      {id: 'amperage', label: 'Circuit Amperage', type: 'select', options: ['15 amp', '20 amp', '30 amp', '40 amp', '50 amp'], default: '20 amp'},
      {id: 'distance', label: 'Wire Run Distance (ft)', type: 'number', default: 50, min: 1, max: 200}
    ],
    calculate: `
      const amperage = document.getElementById('amperage').value;
      const distance = parseFloat(document.getElementById('distance').value) || 50;
      
      let wireGauges = {
        '15 amp': distance > 100 ? '12 AWG' : '14 AWG',
        '20 amp': distance > 100 ? '10 AWG' : '12 AWG',
        '30 amp': distance > 100 ? '8 AWG' : '10 AWG',
        '40 amp': '8 AWG',
        '50 amp': '6 AWG'
      };
      
      document.getElementById('result-gauge').textContent = wireGauges[amperage] || '12 AWG';
      document.getElementById('result-note').textContent = 'Note: Always consult NEC code and local requirements. This is a general guide.';
    `
  },
  {
    id: 'ladder-height-calculator',
    name: 'Ladder Height Calculator',
    description: 'Calculate what ladder size you need for safe reach.',
    icon: '🪜',
    category: 'Utility Tools',
    categorySlug: 'utility-tools',
    inputs: [
      {id: 'reachHeight', label: 'Height You Need to Reach (ft)', type: 'number', default: 12, min: 5, max: 40},
      {id: 'ladderType', label: 'Ladder Type', type: 'select', options: ['Step Ladder', 'Extension Ladder'], default: 'Step Ladder'}
    ],
    calculate: `
      const reach = parseFloat(document.getElementById('reachHeight').value) || 12;
      const type = document.getElementById('ladderType').value;
      
      let ladderHeight;
      if (type === 'Step Ladder') {
        ladderHeight = reach - 4;
      } else {
        ladderHeight = reach + 3;
      }
      
      document.getElementById('result-size').textContent = Math.ceil(ladderHeight) + ' ft ' + type;
      document.getElementById('result-safety').textContent = '⚠️ Never stand on top 2 rungs of ladder. Maintain 3-point contact.';
    `
  }
];

// Generate HTML for each tool
function generateToolHTML(tool) {
  const resultBlocks = tool.calculate.match(/result-(\w+)/g) || [];
  const uniqueResults = [...new Set(resultBlocks.map(r => r.replace('result-', '')))];
  
  const resultHTML = uniqueResults.map(id => {
    if (tool.calculate.includes(`innerHTML`)) {
      return `<div class="bg-white rounded-lg p-4 border border-gray-200">
        <ul id="result-${id}" class="text-gray-700"></ul>
      </div>`;
    }
    return `<div class="bg-white rounded-lg p-4 border border-orange-100">
      <p class="text-lg font-semibold text-gray-900" id="result-${id}">—</p>
    </div>`;
  }).join('\n');

  const inputHTML = tool.inputs.map(input => {
    if (input.type === 'select') {
      return `<div>
        <label for="${input.id}" class="block text-sm font-medium text-gray-700 mb-1">${input.label}</label>
        <select id="${input.id}" class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition" onchange="calculate()">
          ${input.options.map(opt => `<option ${opt === input.default ? 'selected' : ''}>${opt}</option>`).join('\n')}
        </select>
      </div>`;
    } else if (input.type === 'checkbox') {
      return `<div class="flex items-center">
        <input type="checkbox" id="${input.id}" ${input.checked ? 'checked' : ''} class="mr-2 w-5 h-5 text-orange-600 focus:ring-orange-500" onchange="calculate()">
        <label for="${input.id}" class="text-sm font-medium text-gray-700">${input.label}</label>
      </div>`;
    } else {
      return `<div>
        <label for="${input.id}" class="block text-sm font-medium text-gray-700 mb-1">${input.label}</label>
        <input type="${input.type}" id="${input.id}" value="${input.default || ''}" ${input.min ? `min="${input.min}"` : ''} ${input.max ? `max="${input.max}"` : ''} ${input.step ? `step="${input.step}"` : ''}
          class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
          oninput="calculate()">
      </div>`;
    }
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${tool.name} | GoFixr</title>
  <meta name="description" content="${tool.description}">
  <meta name="keywords" content="${tool.name.toLowerCase()}, home repair calculator, diy tool">
  <link rel="canonical" href="https://gofixr.com/tools/${tool.id}.html">
  <meta property="og:title" content="${tool.name} | GoFixr">
  <meta property="og:description" content="${tool.description}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://gofixr.com/tools/${tool.id}.html">
  <meta name="twitter:card" content="summary_large_image">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🔧</text></svg>">
  <style>
    .calc-card { background: linear-gradient(135deg, #FEF3E2 0%, #ffffff 100%); }
  </style>
</head>
<body class="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"WebApplication","name":"${tool.name}","description":"${tool.description}","url":"https://gofixr.com/tools/${tool.id}.html","applicationCategory":"HomeApplication","operatingSystem":"Web","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"}}</script>

  <nav class="bg-white shadow-md sticky top-0 z-50 border-b-4 border-orange-500">
    <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
      <a href="/" class="flex items-center gap-2">
        <span class="text-3xl">🔧</span>
        <span class="text-2xl font-bold" style="color: #1B4965;">Go<span style="color: #FF6B35;">Fixr</span></span>
      </a>
      <div class="hidden md:flex gap-6 text-sm font-semibold">
        <a href="/" class="hover:text-orange-500 transition" style="color: #1B4965;">Home</a>
        <a href="/tools/" class="hover:text-orange-500 transition" style="color: #1B4965;">All Tools</a>
        <a href="/about.html" class="hover:text-orange-500 transition" style="color: #1B4965;">About</a>
      </div>
      <button onclick="document.getElementById('mobile-menu').classList.toggle('hidden')" class="md:hidden" style="color: #1B4965;">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
    </div>
    <div id="mobile-menu" class="hidden md:hidden px-4 pb-3 space-y-2 bg-white border-t">
      <a href="/" class="block py-2 font-medium" style="color: #1B4965;">Home</a>
      <a href="/tools/" class="block py-2 font-medium" style="color: #1B4965;">All Tools</a>
      <a href="/about.html" class="block py-2 font-medium" style="color: #1B4965;">About</a>
    </div>
  </nav>

  <main class="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
    <nav class="text-sm text-gray-500 mb-6">
      <a href="/" class="hover:text-orange-600">Home</a> →
      <a href="/tools/" class="hover:text-orange-600">Tools</a> →
      <a href="/tools/#${tool.categorySlug}" class="hover:text-orange-600">${tool.category}</a> →
      <span class="text-gray-700">${tool.name}</span>
    </nav>

    <div class="mb-8">
      <span class="inline-block bg-orange-100 text-orange-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">${tool.icon} ${tool.category}</span>
      <h1 class="text-3xl md:text-4xl font-bold mb-3" style="color: #1B4965;">${tool.name}</h1>
      <p class="text-lg text-gray-600">${tool.description}</p>
    </div>

    <div class="calc-card rounded-2xl shadow-lg border-2 border-orange-200 p-6 md:p-8 mb-8">
      <div class="grid md:grid-cols-2 gap-4 mb-6">
        ${inputHTML}
      </div>
      <div class="mt-6 space-y-4">
        ${resultHTML}
      </div>
    </div>

    <div class="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mb-8">
      <h3 class="font-bold text-lg mb-2" style="color: #1B4965;">💡 Pro Tip</h3>
      <p class="text-gray-700">Always add 10-15% extra material for waste, mistakes, and future repairs. Get multiple quotes from licensed contractors for complex projects.</p>
    </div>

    <div class="grid md:grid-cols-2 gap-6">
      <div class="bg-white rounded-lg shadow p-6 border">
        <h3 class="font-bold text-lg mb-3" style="color: #1B4965;">Related Tools</h3>
        <ul class="space-y-2 text-sm">
          <li><a href="/tools/diy-vs-hire-calculator.html" class="text-orange-600 hover:underline">DIY vs Hire Calculator</a></li>
          <li><a href="/tools/contractor-comparison-checklist.html" class="text-orange-600 hover:underline">Contractor Comparison</a></li>
        </ul>
      </div>
      <div class="bg-white rounded-lg shadow p-6 border">
        <h3 class="font-bold text-lg mb-3" style="color: #1B4965;">More Calculators</h3>
        <ul class="space-y-2 text-sm">
          <li><a href="/tools/" class="text-orange-600 hover:underline">View All 50 Tools →</a></li>
        </ul>
      </div>
    </div>
  </main>

  <footer class="bg-gray-900 text-gray-300 py-12 mt-16">
    <div class="max-w-7xl mx-auto px-4 text-center">
      <div class="flex items-center justify-center gap-2 mb-4">
        <span class="text-2xl">🔧</span>
        <span class="text-xl font-bold text-white">GoFixr</span>
      </div>
      <p class="text-sm mb-4">Free home repair calculators and planning tools</p>
      <p class="text-xs text-gray-500">&copy; 2026 GoFixr.com. All tools are for estimation purposes. Consult professionals for complex repairs.</p>
    </div>
  </footer>

  <script>
    function calculate() {
      try {
        ${tool.calculate}
      } catch (e) {
        console.error('Calculation error:', e);
      }
    }
    window.onload = calculate;
  </script>
</body>
</html>`;
}

// Generate all tool files
const outputDir = path.join(__dirname, 'site', 'tools');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

tools.forEach(tool => {
  const filename = path.join(outputDir, `${tool.id}.html`);
  const html = generateToolHTML(tool);
  fs.writeFileSync(filename, html, 'utf8');
  console.log(`✓ Generated ${tool.id}.html`);
});

console.log(`\n✅ Generated ${tools.length} tool pages!`);

// Export tool list for index page
fs.writeFileSync(
  path.join(outputDir, '../tools-list.json'),
  JSON.stringify(tools.map(t => ({id: t.id, name: t.name, category: t.category, categorySlug: t.categorySlug, icon: t.icon})), null, 2)
);
