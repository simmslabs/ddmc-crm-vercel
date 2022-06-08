import { ActionFunction } from "remix";
import prisma from "~/services/prisma";

export const action: ActionFunction = async ({ request }) => {
  const { invoice_id, amount, user_id } = await request.json();
  if (invoice_id && amount && user_id) {
    const payment = await prisma.receipts.create({
      data: {
        invoice_id,
        amount: amount * 100,
        user_id,
      }
    });
    console.log(payment);

    const invoice = await prisma.invoices.findFirst({ where: { id: invoice_id }, include: { customer: true, user: true, invoice_items: true, supplier: true, receipts: true } });
    if (invoice) {
      return invoice;
    }
  }
}