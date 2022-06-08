import { ActionFunction } from "remix";
import prisma from "~/services/prisma";

export const action: ActionFunction = async ({ request }) => {
  const { id } = await request.json();
  if (request.method === "POST") {
    if (id) {
      const inv_its = await prisma.invoice_items.deleteMany({
        where: {
          invoice_id: id,
        }
      });
      const product = await prisma.invoices.delete({
        where: {
          id: id,
        },
      });
      return product;
    }
  }
}