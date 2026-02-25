const fs = require('fs');

// 1. App.tsx
let app = fs.readFileSync('src/App.tsx', 'utf8');
app = app.replace(/slopeD: -1,/g, 'slopeD: -0.8,');
app = app.replace(/slopeS: [0-9\.]+,/g, 'slopeS: 0.8,');
fs.writeFileSync('src/App.tsx', app);

// 2. Controls.tsx
let controls = fs.readFileSync('src/components/Controls.tsx', 'utf8');
controls = controls.replace(/const defaultSlopeD = .*\n.*const defaultSlopeS = .*\n/g, '');
controls = controls.replace(/slopeD: [-0-9\.]+, slopeS: [0-9\.]+/, 'slopeD: -0.8, slopeS: 0.8');
fs.writeFileSync('src/components/Controls.tsx', controls);

// 3. econMath.ts
let math = fs.readFileSync('src/utils/econMath.ts', 'utf8');
math = math.replace(
  /const { model, baseP, baseQ, shiftD, shiftS, slopeD, slopeS, priceCeiling, priceFloor, tax, worldPrice, tariff } = state;/,
  `const { model, baseP, baseQ, shiftD, shiftS, slopeD, slopeS, priceCeiling, priceFloor, tax, worldPrice, tariff } = state;\n\n  const effSlopeD = slopeD * (baseP / baseQ);\n  const effSlopeS = slopeS * (baseP / baseQ);`
);
math = math.replace(/calculateEquilibrium\(0, 0, [-0-9\.]+, [0-9\.]+, baseP, baseQ\)/g, 'calculateEquilibrium(0, 0, -0.8 * (baseP / baseQ), 0.8 * (baseP / baseQ), baseP, baseQ)');
math = math.replace(/slopeD, slopeS/g, 'effSlopeD, effSlopeS');
// For any explicitly named slopeD in getQS/getQD etc
math = math.replace(/shiftD, slopeD/g, 'shiftD, effSlopeD');
math = math.replace(/shiftS, slopeS/g, 'shiftS, effSlopeS');
fs.writeFileSync('src/utils/econMath.ts', math);

// 4. EconGraph.tsx
let graph = fs.readFileSync('src/components/EconGraph.tsx', 'utf8');
graph = graph.replace(
  /const maxQ = currentMaxQ;\n  const maxP = currentMaxP;/,
  `const maxQ = currentMaxQ;\n  const maxP = currentMaxP;\n\n  const effSlopeD = slopeD * (baseP / baseQ);\n  const effSlopeS = slopeS * (baseP / baseQ);\n  const defaultEffSlopeD = -0.8 * (baseP / baseQ);\n  const defaultEffSlopeS = 0.8 * (baseP / baseQ);`
);
graph = graph.replace(/shiftD, slopeD/g, 'shiftD, effSlopeD');
graph = graph.replace(/shiftS, slopeS/g, 'shiftS, effSlopeS');
// Update the shadows logic
graph = graph.replace(/shiftD !== 0 \|\| slopeD !== -1/g, 'shiftD !== 0 || slopeD !== -0.8');
graph = graph.replace(/shiftS !== 0 \|\| slopeS !== 0\.8/g, 'shiftS !== 0 || slopeS !== 0.8');
graph = graph.replace(/getPD\(0, 0, -1, baseP, baseQ\)/g, 'getPD(0, 0, defaultEffSlopeD, baseP, baseQ)');
graph = graph.replace(/getPD\(maxQ, 0, -1, baseP, baseQ\)/g, 'getPD(maxQ, 0, defaultEffSlopeD, baseP, baseQ)');
graph = graph.replace(/getPS\(0, 0, 0\.8, baseP, baseQ\)/g, 'getPS(0, 0, defaultEffSlopeS, baseP, baseQ)');
graph = graph.replace(/getPS\(maxQ, 0, 0\.8, baseP, baseQ\)/g, 'getPS(maxQ, 0, defaultEffSlopeS, baseP, baseQ)');
// Update drag logic
graph = graph.replace(/dy \/ slopeD/g, 'dy / effSlopeD');
graph = graph.replace(/dy \/ slopeS/g, 'dy / effSlopeS');
fs.writeFileSync('src/components/EconGraph.tsx', graph);

// 5. Explanation.tsx
let exp = fs.readFileSync('src/components/Explanation.tsx', 'utf8');
exp = exp.replace(
  /const hasTax = \(model === 'tax' \|\| model === 'elasticity'\) && state\.tax > 0;/,
  `const hasTax = (model === 'tax' || model === 'elasticity') && state.tax > 0;\n  const effSlopeD = state.slopeD * (state.baseP / state.baseQ);\n  const effSlopeS = state.slopeS * (state.baseP / state.baseQ);`
);
exp = exp.replace(/state\.slopeD/g, 'effSlopeD');
exp = exp.replace(/state\.slopeS/g, 'effSlopeS');
fs.writeFileSync('src/components/Explanation.tsx', exp);

console.log("Refactoring complete");
