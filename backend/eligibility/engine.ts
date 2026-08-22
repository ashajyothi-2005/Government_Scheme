import { GovernmentScheme, UserProfile, EligibilityResult, CriterionEvaluation, SchemeCriterion } from '../../shared/types';

export function evaluateCriterion(criterion: SchemeCriterion, profile: Partial<UserProfile>): CriterionEvaluation {
  const userValue = profile[criterion.field as keyof UserProfile];

  // Check for missing/undefined/unprovided information
  if (userValue === undefined || userValue === null || userValue === '') {
    return {
      criterionId: criterion.id,
      label: criterion.label,
      status: 'UNKNOWN',
      reason: `Information for "${criterion.label}" was not provided in your profile.`,
      sourceDocTitle: criterion.sourceDocTitle,
      sourcePageNumber: criterion.sourcePageNumber,
      userValueProvided: null,
      expectedValue: criterion.expectedValue
    };
  }

  let isPass = false;
  let reason = '';

  switch (criterion.operator) {
    case 'equals': {
      isPass = String(userValue).toLowerCase() === String(criterion.expectedValue).toLowerCase();
      reason = isPass
        ? `You meet this requirement (${userValue}).`
        : `Your profile indicates "${userValue}", but the scheme requires "${criterion.expectedValue}".`;
      break;
    }

    case 'in': {
      if (Array.isArray(criterion.expectedValue)) {
        isPass = criterion.expectedValue.some(
          (val) => String(val).toLowerCase() === String(userValue).toLowerCase()
        );
        reason = isPass
          ? `Your category/qualification (${userValue}) is accepted under this guideline.`
          : `Your value "${userValue}" is not listed under accepted criteria: [${criterion.expectedValue.join(', ')}].`;
      } else {
        isPass = false;
        reason = `Invalid rule expectation configuration.`;
      }
      break;
    }

    case 'lte': {
      const numVal = Number(userValue);
      const limit = Number(criterion.expectedValue);
      if (isNaN(numVal)) {
        return {
          criterionId: criterion.id,
          label: criterion.label,
          status: 'UNKNOWN',
          reason: `Could not parse numerical value for comparison.`,
          sourceDocTitle: criterion.sourceDocTitle,
          sourcePageNumber: criterion.sourcePageNumber,
          userValueProvided: userValue,
          expectedValue: criterion.expectedValue
        };
      }
      isPass = numVal <= limit;
      reason = isPass
        ? `Your value (₹${numVal.toLocaleString('en-IN')}) is within the permissible ceiling limit of ₹${limit.toLocaleString('en-IN')}.`
        : `Your reported income (₹${numVal.toLocaleString('en-IN')}) exceeds the maximum eligible ceiling of ₹${limit.toLocaleString('en-IN')}.`;
      break;
    }

    case 'gte': {
      const numVal = Number(userValue);
      const limit = Number(criterion.expectedValue);
      isPass = numVal >= limit;
      reason = isPass
        ? `Your age/value (${numVal}) satisfies the minimum threshold of ${limit}.`
        : `Your age/value (${numVal}) is below the required minimum of ${limit}.`;
      break;
    }

    case 'between': {
      const numVal = Number(userValue);
      const { min, max } = criterion.expectedValue || {};
      isPass = numVal >= min && numVal <= max;
      reason = isPass
        ? `Your value (${numVal}) is within the required range of ${min} to ${max}.`
        : `Your value (${numVal}) is outside the required range of ${min} to ${max}.`;
      break;
    }

    case 'boolean': {
      isPass = Boolean(userValue) === Boolean(criterion.expectedValue);
      reason = isPass
        ? `Condition requirement satisfied.`
        : `Condition requirement not met.`;
      break;
    }

    default: {
      isPass = false;
      reason = 'Unknown rule evaluation operator.';
    }
  }

  return {
    criterionId: criterion.id,
    label: criterion.label,
    status: isPass ? 'PASS' : 'FAIL',
    reason,
    sourceDocTitle: criterion.sourceDocTitle,
    sourcePageNumber: criterion.sourcePageNumber,
    userValueProvided: userValue,
    expectedValue: criterion.expectedValue
  };
}

export function evaluateSchemeEligibility(scheme: GovernmentScheme, profile: Partial<UserProfile>): EligibilityResult {
  const evaluations: CriterionEvaluation[] = [];
  const missingFields: string[] = [];

  // Check state applicability first
  if (!scheme.applicableStates.includes('ALL')) {
    const userState = profile.state;
    if (!userState) {
      evaluations.push({
        criterionId: 'crit-state-check',
        label: `State Domicile: ${scheme.applicableStates.join(', ')}`,
        status: 'UNKNOWN',
        reason: 'State information is missing from your profile.',
        sourceDocTitle: scheme.name,
        sourcePageNumber: 1,
        userValueProvided: null,
        expectedValue: scheme.applicableStates
      });
      missingFields.push('state');
    } else {
      const stateMatch = scheme.applicableStates.some(
        (s) => s.toLowerCase() === userState.toLowerCase()
      );
      evaluations.push({
        criterionId: 'crit-state-check',
        label: `State Domicile: ${scheme.applicableStates.join(', ')}`,
        status: stateMatch ? 'PASS' : 'FAIL',
        reason: stateMatch
          ? `You reside in ${userState}, which is eligible for this state-specific scheme.`
          : `This scheme is exclusively applicable in ${scheme.applicableStates.join(', ')}, but your state is ${userState}.`,
        sourceDocTitle: scheme.name,
        sourcePageNumber: 1,
        userValueProvided: userState,
        expectedValue: scheme.applicableStates
      });
    }
  }

  for (const crit of scheme.criteria) {
    const evalRes = evaluateCriterion(crit, profile);
    evaluations.push(evalRes);
    if (evalRes.status === 'UNKNOWN' && !missingFields.includes(crit.field)) {
      missingFields.push(crit.field);
    }
  }

  const passCount = evaluations.filter((e) => e.status === 'PASS').length;
  const failCount = evaluations.filter((e) => e.status === 'FAIL').length;
  const unknownCount = evaluations.filter((e) => e.status === 'UNKNOWN').length;
  const total = evaluations.length;

  let overallStatus: EligibilityResult['overallStatus'] = 'LIKELY_ELIGIBLE';
  let summaryMessage = '';
  let matchScore = 0;

  if (failCount > 0) {
    overallStatus = 'LIKELY_NOT_ELIGIBLE';
    matchScore = Math.max(10, Math.round((passCount / total) * 50));
    summaryMessage = `You may not qualify for this scheme because ${failCount} eligibility requirement(s) were not satisfied based on your current profile.`;
  } else if (unknownCount > 0) {
    overallStatus = 'MORE_INFO_NEEDED';
    matchScore = Math.round(((passCount + 0.5 * unknownCount) / total) * 100);
    summaryMessage = `You meet ${passCount} known requirement(s), but additional information (${missingFields.join(', ')}) is needed to verify full eligibility.`;
  } else {
    overallStatus = 'LIKELY_ELIGIBLE';
    matchScore = 100;
    summaryMessage = `Based on official guidelines, your profile satisfies all ${passCount} evaluated eligibility criteria for this scheme.`;
  }

  return {
    schemeId: scheme.id,
    overallStatus,
    matchScore,
    evaluations,
    summaryMessage,
    missingFields
  };
}

export function rankSchemesForUser(schemes: GovernmentScheme[], profile: Partial<UserProfile>): { scheme: GovernmentScheme; result: EligibilityResult }[] {
  const results = schemes.map((scheme) => {
    const evalResult = evaluateSchemeEligibility(scheme, profile);
    return { scheme, result: evalResult };
  });

  // Sort by match score descending, then prioritize LIKELY_ELIGIBLE > MORE_INFO_NEEDED > LIKELY_NOT_ELIGIBLE
  return results.sort((a, b) => {
    if (a.result.overallStatus === 'LIKELY_ELIGIBLE' && b.result.overallStatus !== 'LIKELY_ELIGIBLE') return -1;
    if (b.result.overallStatus === 'LIKELY_ELIGIBLE' && a.result.overallStatus !== 'LIKELY_ELIGIBLE') return 1;
    if (a.result.overallStatus === 'MORE_INFO_NEEDED' && b.result.overallStatus === 'LIKELY_NOT_ELIGIBLE') return -1;
    if (b.result.overallStatus === 'MORE_INFO_NEEDED' && a.result.overallStatus === 'LIKELY_NOT_ELIGIBLE') return 1;
    return b.result.matchScore - a.result.matchScore;
  });
}
