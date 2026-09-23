import { BadRequestException } from '@nestjs/common';

type TransactionPaymentDetails = {
  bank?: string | null;
  targetBank?: string | null;
  number?: string | null;
  date?: Date | null;
};

const requiredFieldsMessage =
  'Bank, target bank, transaction number, and payment date are required';

export function requireTransactionPaymentDetails(
  details: TransactionPaymentDetails,
) {
  if (
    !details.bank ||
    !details.targetBank ||
    !details.number ||
    !details.date
  ) {
    throw new BadRequestException(requiredFieldsMessage);
  }
}

export function preventClearingTransactionPaymentDetails(
  details: TransactionPaymentDetails,
) {
  if (
    details.bank === null ||
    details.targetBank === null ||
    details.number === null ||
    details.date === null
  ) {
    throw new BadRequestException(requiredFieldsMessage);
  }
}
