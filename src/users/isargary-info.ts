import { BadRequestException } from '@nestjs/common';
import {
  FRONTPRESENCETYPE,
  ISARGARRELATION,
  ISARGARYTYPE,
  MARTYRRELATION,
} from '@prisma/client';

export type IsargaryInfo = {
  isargaryType: ISARGARYTYPE;
  martyrRelation: MARTYRRELATION | null;
  isargarRelation: ISARGARRELATION | null;
  janbaziPercent: number | null;
  captivityMonths: number | null;
  frontPresenceType: FRONTPRESENCETYPE | null;
  frontPresenceMonths: number | null;
};

const EMPTY_DETAILS: Omit<IsargaryInfo, 'isargaryType'> = {
  martyrRelation: null,
  isargarRelation: null,
  janbaziPercent: null,
  captivityMonths: null,
  frontPresenceType: null,
  frontPresenceMonths: null,
};

const JANBAZI_PERCENTAGES = Array.from(
  { length: 16 },
  (_, index) => (index + 1) * 5,
);

function requirePositiveInteger(value: number | null, field: string) {
  if (!Number.isInteger(value) || (value ?? 0) <= 0) {
    throw new BadRequestException(`${field} must be a positive integer`);
  }
}

export function normalizeIsargaryInfo(
  update: Partial<IsargaryInfo>,
  current?: IsargaryInfo,
): IsargaryInfo {
  const previous: IsargaryInfo = current ?? {
    isargaryType: ISARGARYTYPE.none,
    ...EMPTY_DETAILS,
  };
  const isargaryType = update.isargaryType ?? previous.isargaryType;
  const typeChanged = isargaryType !== previous.isargaryType;
  const details = {
    ...(typeChanged ? { ...previous, ...EMPTY_DETAILS } : previous),
    ...update,
    isargaryType,
  } as IsargaryInfo;

  if (isargaryType === ISARGARYTYPE.none) {
    return { isargaryType, ...EMPTY_DETAILS };
  }

  if (isargaryType === ISARGARYTYPE.martyrFamily) {
    if (!details.martyrRelation) {
      throw new BadRequestException(
        'martyrRelation is required for martyrFamily',
      );
    }
    return {
      isargaryType,
      ...EMPTY_DETAILS,
      martyrRelation: details.martyrRelation,
    };
  }

  if (!details.isargarRelation) {
    throw new BadRequestException(
      `isargarRelation is required for ${isargaryType}`,
    );
  }

  if (isargaryType === ISARGARYTYPE.janbaz) {
    if (
      details.janbaziPercent === null ||
      !JANBAZI_PERCENTAGES.includes(details.janbaziPercent)
    ) {
      throw new BadRequestException(
        'janbaziPercent must be between 5 and 80 in steps of 5',
      );
    }
    return {
      isargaryType,
      ...EMPTY_DETAILS,
      isargarRelation: details.isargarRelation,
      janbaziPercent: details.janbaziPercent,
    };
  }

  if (isargaryType === ISARGARYTYPE.azade) {
    requirePositiveInteger(details.captivityMonths, 'captivityMonths');
    return {
      isargaryType,
      ...EMPTY_DETAILS,
      isargarRelation: details.isargarRelation,
      captivityMonths: details.captivityMonths,
    };
  }

  if (!details.frontPresenceType) {
    throw new BadRequestException('frontPresenceType is required for isargar');
  }
  requirePositiveInteger(details.frontPresenceMonths, 'frontPresenceMonths');
  return {
    isargaryType,
    ...EMPTY_DETAILS,
    isargarRelation: details.isargarRelation,
    frontPresenceType: details.frontPresenceType,
    frontPresenceMonths: details.frontPresenceMonths,
  };
}
