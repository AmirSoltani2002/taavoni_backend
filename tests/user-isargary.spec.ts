import { BadRequestException } from '@nestjs/common';
import {
  FRONTPRESENCETYPE,
  ISARGARRELATION,
  ISARGARYTYPE,
  MARTYRRELATION,
} from '@prisma/client';
import {
  IsargaryInfo,
  normalizeIsargaryInfo,
} from '../src/users/isargary-info';

const janbazInfo: IsargaryInfo = {
  isargaryType: ISARGARYTYPE.janbaz,
  martyrRelation: null,
  isargarRelation: ISARGARRELATION.self,
  janbaziPercent: 25,
  captivityMonths: null,
  frontPresenceType: null,
  frontPresenceMonths: null,
};

describe('User isargary information', () => {
  it('normalizes each supported type to only its applicable fields', () => {
    expect(
      normalizeIsargaryInfo({
        isargaryType: ISARGARYTYPE.martyrFamily,
        martyrRelation: MARTYRRELATION.child,
      }),
    ).toMatchObject({
      isargaryType: ISARGARYTYPE.martyrFamily,
      martyrRelation: MARTYRRELATION.child,
      isargarRelation: null,
    });

    expect(
      normalizeIsargaryInfo({
        isargaryType: ISARGARYTYPE.azade,
        isargarRelation: ISARGARRELATION.spouse,
        captivityMonths: 18,
      }),
    ).toMatchObject({
      isargaryType: ISARGARYTYPE.azade,
      isargarRelation: ISARGARRELATION.spouse,
      captivityMonths: 18,
      janbaziPercent: null,
    });

    expect(
      normalizeIsargaryInfo({
        isargaryType: ISARGARYTYPE.isargar,
        isargarRelation: ISARGARRELATION.child,
        frontPresenceType: FRONTPRESENCETYPE.voluntary,
        frontPresenceMonths: 12,
      }),
    ).toMatchObject({
      isargaryType: ISARGARYTYPE.isargar,
      isargarRelation: ISARGARRELATION.child,
      frontPresenceType: FRONTPRESENCETYPE.voluntary,
      frontPresenceMonths: 12,
      captivityMonths: null,
    });
  });

  it('erases previous details when the type changes', () => {
    expect(
      normalizeIsargaryInfo(
        {
          isargaryType: ISARGARYTYPE.azade,
          isargarRelation: ISARGARRELATION.spouse,
          captivityMonths: 24,
        },
        janbazInfo,
      ),
    ).toEqual({
      isargaryType: ISARGARYTYPE.azade,
      martyrRelation: null,
      isargarRelation: ISARGARRELATION.spouse,
      janbaziPercent: null,
      captivityMonths: 24,
      frontPresenceType: null,
      frontPresenceMonths: null,
    });
  });

  it('erases every detail when none is selected', () => {
    expect(
      normalizeIsargaryInfo({ isargaryType: ISARGARYTYPE.none }, janbazInfo),
    ).toEqual({
      isargaryType: ISARGARYTYPE.none,
      martyrRelation: null,
      isargarRelation: null,
      janbaziPercent: null,
      captivityMonths: null,
      frontPresenceType: null,
      frontPresenceMonths: null,
    });
  });

  it.each([
    [{ isargaryType: ISARGARYTYPE.martyrFamily }],
    [
      {
        isargaryType: ISARGARYTYPE.janbaz,
        isargarRelation: ISARGARRELATION.self,
        janbaziPercent: 12,
      },
    ],
    [
      {
        isargaryType: ISARGARYTYPE.azade,
        isargarRelation: ISARGARRELATION.self,
        captivityMonths: 0,
      },
    ],
    [
      {
        isargaryType: ISARGARYTYPE.isargar,
        isargarRelation: ISARGARRELATION.self,
        frontPresenceType: FRONTPRESENCETYPE.mandatory,
        frontPresenceMonths: 1.5,
      },
    ],
  ])('rejects incomplete or invalid details: %p', (input) => {
    expect(() => normalizeIsargaryInfo(input)).toThrow(BadRequestException);
  });
});
