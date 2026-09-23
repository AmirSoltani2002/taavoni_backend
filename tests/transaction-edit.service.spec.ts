import { FinalTransactionService } from '../src/final-transaction/final-transaction.service';
import { TransactionService } from '../src/transaction/transaction.service';

describe('Transaction edit services', () => {
  it('gives transactions without a payment date no score', () => {
    const service = new TransactionService({} as never);

    expect(
      service.scoreComputation({
        date: null,
        amount: 10_000_000,
        isConfirmed: true,
      }),
    ).toBe(0);
  });

  it('clears a preselling transaction document without persisting the command field', async () => {
    const update = jest.fn().mockResolvedValue({ id: 4, document: null });
    const service = new TransactionService({
      transaction: { update },
    } as never);

    await service.update(4, { removeDocument: true });

    expect(update).toHaveBeenCalledWith({
      where: { id: 4 },
      data: {
        document: null,
        user: undefined,
        preselling: undefined,
      },
    });
  });

  it('clears a final transaction document without persisting the command field', async () => {
    const update = jest.fn().mockResolvedValue({ id: 5, document: null });
    const service = new FinalTransactionService({
      finalTransaction: { update },
    } as never);

    await service.update(5, { removeDocument: true });

    expect(update).toHaveBeenCalledWith({
      where: { id: 5 },
      data: {
        document: null,
        user: undefined,
        subProject: undefined,
      },
    });
  });
});
