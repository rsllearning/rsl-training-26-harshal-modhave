import { setup, fromPromise, assign } from 'xstate';
import type { CartItem, CheckoutResult } from '../types';

export interface CheckoutContext {
  items: CartItem[];
  total: number;
  orderResult: CheckoutResult | null;
  errorMessage: string | null;
}

export type CheckoutEvent =
  | { type: 'SYNC_CART'; items: CartItem[] }
  | { type: 'SUBMIT_PAYMENT' }
  | { type: 'CANCEL' }
  | { type: 'RESET' };

// Asynchronous Payment Actor with AbortSignal HTTP Cancellation
const submitPaymentActor = fromPromise<
  CheckoutResult,
  { items: CartItem[]; total: number }
>(async ({ input, signal }) => {
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: input.items, total: input.total }),
    signal, // Native AbortSignal passed directly to fetch
  });

  if (!response.ok) {
    throw new Error('Payment processing failed on server');
  }

  return (await response.json()) as CheckoutResult;
});

export const checkoutMachine = setup({
  types: {
    context: {} as CheckoutContext,
    events: {} as CheckoutEvent,
  },
  actors: {
    submitPaymentActor,
  },
  guards: {
    isCartNotEmpty: ({ context }) => context.items.length > 0,
  },
}).createMachine({
  id: 'checkout',
  initial: 'reviewing',
  context: {
    items: [],
    total: 0,
    orderResult: null,
    errorMessage: null,
  },
  on: {
    SYNC_CART: {
      actions: assign({
        items: ({ event }) => event.items,
        total: ({ event }) =>
          event.items.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
          ),
      }),
    },
  },
  states: {
    reviewing: {
      on: {
        SUBMIT_PAYMENT: {
          guard: 'isCartNotEmpty', // Transition guarded: cart must not be empty
          target: 'submitting',
        },
      },
    },
    submitting: {
      entry: assign({ errorMessage: null }),
      invoke: {
        src: 'submitPaymentActor',
        input: ({ context }) => ({
          items: context.items,
          total: context.total,
        }),
        onDone: {
          target: 'success',
          actions: assign({
            orderResult: ({ event }) => event.output,
          }),
        },
        onError: {
          target: 'reviewing',
          actions: assign({
            errorMessage: ({ event }) =>
              (event.error as Error)?.message || 'Payment submission failed',
          }),
        },
      },
      on: {
        CANCEL: {
          target: 'reviewing', // Immediately aborts in-flight promise actor
        },
      },
    },
    success: {
      on: {
        RESET: {
          target: 'reviewing',
          actions: assign({
            orderResult: null,
            errorMessage: null,
          }),
        },
      },
    },
  },
});