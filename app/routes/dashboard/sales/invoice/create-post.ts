import { invoice_items } from "@prisma/client";
import { ActionFunction, json } from "@remix-run/node";
import { getServerToken } from "~/services/hooks";
import prisma from "~/services/prisma";

export const action: ActionFunction = async ({ request }) => {

  const { invoice_items, customer_id, invoice_date, invoice_due, order_number, tax_amount, user_id } = await request.json();
  if (request.method === "POST") {
    if (invoice_items && customer_id && invoice_date && invoice_due && order_number && tax_amount >= 0) {
      const invoice = await prisma.invoices.create({
        data: {
          user_id,
          customer_id: customer_id,
          invoice_date: invoice_date,
          invoice_due: invoice_due,
          invoice_num: order_number,
          tax: tax_amount,
          type: 'sale',
          invoice_items: {
            createMany: {
              data: invoice_items.map((item: any) => ({
                quantity: item.quantity,
                price: item.price,
                description: item.description,
                amount: item.amount,
                type: 'sale',
              }))
            }
          }
        },
      });
      const _invoice = await prisma.invoices.findFirst({ where: { id: invoice.id }, include: { customer: true, user: true, invoice_items: true } });
      if (_invoice) {
        return json({
          success: true,
          message: 'Invoice successfully created',
          data: _invoice,
        });
      }
    }
  } else {
    return json({
      success: false,
      message: 'Please provide all required fields'
    });
  }
}