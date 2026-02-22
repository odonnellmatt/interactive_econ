export const calculateEquilibrium = (
  shiftD: number, shiftS: number, slopeD: number, slopeS: number, baseP: number, baseQ: number, tax: number = 0
) => {
  const Qeq = baseQ + (slopeS * shiftS - slopeD * shiftD - tax) / (slopeS - slopeD);
  const Peq = baseP + slopeD * (Qeq - baseQ - shiftD);
  return { Qeq, Peq };
};

export const getPD = (Q: number, shiftD: number, slopeD: number, baseP: number, baseQ: number) => {
  return baseP + slopeD * (Q - baseQ - shiftD);
};

export const getPS = (Q: number, shiftS: number, slopeS: number, baseP: number, baseQ: number) => {
  return baseP + slopeS * (Q - baseQ - shiftS);
};

export const getQD = (P: number, shiftD: number, slopeD: number, baseP: number, baseQ: number) => {
  return (P - baseP) / slopeD + baseQ + shiftD;
};

export const getQS = (P: number, shiftS: number, slopeS: number, baseP: number, baseQ: number) => {
  return (P - baseP) / slopeS + baseQ + shiftS;
};

export const getGraphData = (state: any) => {
  const { model, baseP, baseQ, shiftD, shiftS, slopeD, slopeS, priceCeiling, priceFloor, tax, worldPrice, tariff } = state;

  const baseEq = calculateEquilibrium(0, 0, -1, 1, baseP, baseQ);
  const freeMarketEq = calculateEquilibrium(shiftD, shiftS, slopeD, slopeS, baseP, baseQ);
  const currentEq = calculateEquilibrium(shiftD, shiftS, slopeD, slopeS, baseP, baseQ, (model === 'tax' || model === 'elasticity') ? tax : 0);

  let P_C = currentEq.Peq;
  let P_P = (model === 'tax' || (model === 'elasticity' && tax > 0)) ? currentEq.Peq - tax : currentEq.Peq;
  let Q_traded = currentEq.Qeq;
  let shortage = 0;
  let surplus = 0;
  let imports = 0;

  if (model === 'ceiling' && priceCeiling < freeMarketEq.Peq) {
    P_C = priceCeiling;
    P_P = priceCeiling;
    Q_traded = getQS(priceCeiling, shiftS, slopeS, baseP, baseQ);
    shortage = getQD(priceCeiling, shiftD, slopeD, baseP, baseQ) - Q_traded;
  } else if (model === 'floor' && priceFloor > freeMarketEq.Peq) {
    P_C = priceFloor;
    P_P = priceFloor;
    Q_traded = getQD(priceFloor, shiftD, slopeD, baseP, baseQ);
    surplus = getQS(priceFloor, shiftS, slopeS, baseP, baseQ) - Q_traded;
  } else if (model === 'world') {
    const effectiveWorldPrice = worldPrice + tariff;
    if (effectiveWorldPrice < freeMarketEq.Peq) {
      P_C = effectiveWorldPrice;
      P_P = effectiveWorldPrice;
      const qS = getQS(effectiveWorldPrice, shiftS, slopeS, baseP, baseQ);
      const qD = getQD(effectiveWorldPrice, shiftD, slopeD, baseP, baseQ);
      Q_traded = qD;
      imports = qD - qS;
    } else {
      P_C = effectiveWorldPrice;
      P_P = effectiveWorldPrice;
      const qS = getQS(effectiveWorldPrice, shiftS, slopeS, baseP, baseQ);
      Q_traded = qS;
    }
  }

  // Welfare calculations
  const demandIntercept = getPD(0, shiftD, slopeD, baseP, baseQ); // P when Q=0 on demand curve
  const supplyIntercept = getPS(0, shiftS, slopeS, baseP, baseQ); // P when Q=0 on supply curve

  let CS = 0;
  let PS = 0;
  let DWL = 0;
  let taxRevenue = 0;
  let tariffRevenue = 0;

  if (model === 'tax' || (model === 'elasticity' && tax > 0)) {
    // Tax model welfare
    CS = 0.5 * (demandIntercept - P_C) * Q_traded;
    PS = 0.5 * (P_P - supplyIntercept) * Q_traded;
    taxRevenue = tax * Q_traded;
    DWL = 0.5 * tax * (freeMarketEq.Qeq - Q_traded);
  } else if (model === 'ceiling' && priceCeiling < freeMarketEq.Peq) {
    CS = 0.5 * (demandIntercept - P_C) * Q_traded;
    PS = 0.5 * (P_P - supplyIntercept) * Q_traded;
    DWL = 0.5 * (getPD(Q_traded, shiftD, slopeD, baseP, baseQ) - getPS(Q_traded, shiftS, slopeS, baseP, baseQ)) * (freeMarketEq.Qeq - Q_traded);
  } else if (model === 'floor' && priceFloor > freeMarketEq.Peq) {
    CS = 0.5 * (demandIntercept - P_C) * Q_traded;
    PS = 0.5 * (P_P - supplyIntercept) * Q_traded;
    DWL = 0.5 * (getPD(Q_traded, shiftD, slopeD, baseP, baseQ) - getPS(Q_traded, shiftS, slopeS, baseP, baseQ)) * (freeMarketEq.Qeq - Q_traded);
  } else if (model === 'world' && tariff > 0 && imports > 0) {
    const qS_tariff = getQS(P_C, shiftS, slopeS, baseP, baseQ);
    const qD_tariff = getQD(P_C, shiftD, slopeD, baseP, baseQ);
    const qS_free = getQS(worldPrice, shiftS, slopeS, baseP, baseQ);
    const qD_free = getQD(worldPrice, shiftD, slopeD, baseP, baseQ);
    CS = 0.5 * (demandIntercept - P_C) * qD_tariff;
    PS = 0.5 * (P_P - supplyIntercept) * qS_tariff;
    tariffRevenue = tariff * (qD_tariff - qS_tariff);
    DWL = 0.5 * tariff * (qS_tariff - qS_free) + 0.5 * tariff * (qD_free - qD_tariff);
  } else {
    // Standard / no intervention
    CS = 0.5 * (demandIntercept - P_C) * Q_traded;
    PS = 0.5 * (P_P - supplyIntercept) * Q_traded;
  }

  // Clamp negative values to 0
  CS = Math.max(0, CS);
  PS = Math.max(0, PS);
  DWL = Math.max(0, DWL);

  return {
    baseEq,
    freeMarketEq,
    currentEq,
    P_C,
    P_P,
    Q_traded,
    shortage,
    surplus,
    imports,
    CS,
    PS,
    DWL,
    taxRevenue,
    tariffRevenue,
  };
};
