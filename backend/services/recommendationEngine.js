/**
 * AI Recommendation Engine
 * Rule-based heuristic engine for Industrial IoT analysis.
 */

const generateInsights = (machineDataList) => {
  const recommendations = [];
  let totalFactoryHealth = 0;
  let totalPower = 0;
  let totalProduction = 0;
  let idleMachines = 0;
  let overloadedMachines = 0;
  let maintenanceMachines = 0;

  const analyzedMachines = machineDataList.map((machine) => {
    // 1. Health Scoring
    let healthScore = 100;
    const { temp = 70, vib = 0.02, pwr = 0, rpm = 0, status = 'Normal', prod = 0 } = machine.telemetry || {};

    if (temp > 80) healthScore -= 15;
    if (temp > 95) healthScore -= 15;
    if (vib > 0.05) healthScore -= 10;
    if (vib > 0.08) healthScore -= 20;
    if (status === 'Overloaded') healthScore -= 25;
    if (status === 'Maintenance') healthScore -= 50;
    
    // Ensure health doesn't drop below 0
    healthScore = Math.max(0, healthScore);
    totalFactoryHealth += healthScore;
    totalPower += pwr;
    totalProduction += prod;

    if (status === 'Idle' || (rpm === 0 && pwr > 0)) idleMachines++;
    if (status === 'Overloaded') overloadedMachines++;
    if (status === 'Maintenance' || status === 'Bearing Wear') maintenanceMachines++;

    // --- Rule 1: Predictive Maintenance ---
    if (vib > 0.08 && temp > 85) {
      recommendations.push({
        type: 'Predictive Maintenance',
        target: machine.name,
        severity: 'Critical',
        confidence: 94,
        estimatedSavings: 15000,
        estimatedProductionGain: 0,
        explanation: 'Harmonic vibration and thermal load indicate imminent bearing failure within 48 hours.',
        suggestedAction: 'Halt machine and replace spindle bearings immediately to prevent catastrophic failure.'
      });
    } else if (vib > 0.06) {
      recommendations.push({
        type: 'Predictive Maintenance',
        target: machine.name,
        severity: 'Medium',
        confidence: 78,
        estimatedSavings: 3000,
        estimatedProductionGain: 0,
        explanation: 'Elevated vibration detected. Early signs of mechanical wear.',
        suggestedAction: 'Schedule inspection and lubrication during the next shift change.'
      });
    }

    // --- Rule 2: Machine Failure Prediction ---
    if (healthScore < 40 && status !== 'Maintenance') {
      recommendations.push({
        type: 'Machine Failure Prediction',
        target: machine.name,
        severity: 'High',
        confidence: 88,
        estimatedSavings: 25000,
        estimatedProductionGain: 0,
        explanation: `Overall health score has dropped to ${healthScore}. Failure probability is highly elevated.`,
        suggestedAction: 'Shift load to auxiliary machines and prepare for emergency maintenance.'
      });
    }

    // --- Rule 3: Idle Machine Detection ---
    if (rpm === 0 && pwr > 0.5 && status !== 'Maintenance') {
      recommendations.push({
        type: 'Idle Machine Detection',
        target: machine.name,
        severity: 'Low',
        confidence: 98,
        estimatedSavings: Math.round(pwr * 24 * 30 * 0.12), // roughly monthly saving
        estimatedProductionGain: 0,
        explanation: `Machine is drawing ${pwr.toFixed(2)}kW while idle (parasitic draw).`,
        suggestedAction: 'Implement automated deep-sleep modes during inactive cycles.'
      });
    }

    // --- Rule 8: Inventory Forecast ---
    if (status === 'Overloaded') {
      recommendations.push({
        type: 'Inventory Forecast',
        target: machine.name,
        severity: 'Medium',
        confidence: 82,
        estimatedSavings: 1200,
        estimatedProductionGain: 50,
        explanation: 'Machine overload is causing a Work-in-Progress (WIP) bottleneck.',
        suggestedAction: 'Reallocate upstream inventory to prevent queue buildup.'
      });
    }

    return {
      machineId: machine.machineId,
      name: machine.name,
      healthScore
    };
  });

  const avgFactoryHealth = analyzedMachines.length > 0 
    ? Math.round(totalFactoryHealth / analyzedMachines.length) 
    : 100;

  // --- Factory Level Rules ---
  
  // --- Rule 4: Energy Optimization ---
  if (totalPower > (analyzedMachines.length * 30)) { // Arbitrary heuristic threshold
    recommendations.push({
      type: 'Energy Optimization',
      target: 'Factory Level',
      severity: 'Medium',
      confidence: 85,
      estimatedSavings: Math.round(totalPower * 0.05 * 30 * 24 * 0.12),
      estimatedProductionGain: 0,
      explanation: `Detected peak power draw of ${totalPower.toFixed(0)} kW across the cluster.`,
      suggestedAction: 'Load-shift non-critical operations to off-peak grid hours.'
    });
  }

  // --- Rule 5: Carbon Reduction ---
  if (totalPower > (analyzedMachines.length * 40)) {
    recommendations.push({
      type: 'Carbon Reduction',
      target: 'Factory Level',
      severity: 'Low',
      confidence: 90,
      estimatedSavings: 800,
      estimatedProductionGain: 0,
      explanation: 'Sustained high energy consumption is inflating the carbon footprint.',
      suggestedAction: 'Switch to Renewable Energy Credits (RECs) for HVAC and secondary systems.'
    });
  }

  // --- Rule 6: Production Optimization ---
  if (totalProduction > 0 && totalPower / totalProduction > 1.5) {
    recommendations.push({
      type: 'Production Optimization',
      target: 'Factory Level',
      severity: 'Medium',
      confidence: 81,
      estimatedSavings: 5000,
      estimatedProductionGain: Math.round(totalProduction * 0.1),
      explanation: 'Energy per unit produced is inefficient (OEE variance).',
      suggestedAction: 'Optimize feed rates by -5% to stabilize thermal load and improve efficiency.'
    });
  }

  // --- Rule 7: Resource Sharing ---
  if (idleMachines > 0 && overloadedMachines > 0) {
    recommendations.push({
      type: 'Resource Sharing',
      target: 'Factory Level',
      severity: 'High',
      confidence: 95,
      estimatedSavings: 4000,
      estimatedProductionGain: 120,
      explanation: `Detected ${overloadedMachines} overloaded nodes and ${idleMachines} idle nodes.`,
      suggestedAction: 'Reroute active jobs from overloaded machines to idle machines via the cluster balancer.'
    });
  }

  // --- Rule 9: Worker Allocation ---
  if (maintenanceMachines >= 2) {
    recommendations.push({
      type: 'Worker Allocation',
      target: 'Maintenance Team',
      severity: 'High',
      confidence: 89,
      estimatedSavings: 2000,
      estimatedProductionGain: 0,
      explanation: 'Multiple machines require simultaneous maintenance.',
      suggestedAction: 'Reallocate Tier-2 technicians from assembly to the maintenance queue.'
    });
  }

  // Sort recommendations by confidence (highest first)
  recommendations.sort((a, b) => b.confidence - a.confidence);

  return {
    factoryHealthScore: avgFactoryHealth,
    machineHealthScores: analyzedMachines,
    recommendations
  };
};

module.exports = {
  generateInsights
};
