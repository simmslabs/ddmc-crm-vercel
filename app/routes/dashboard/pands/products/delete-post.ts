import { ActionFunction } from "remix";
import prisma from "~/services/prisma";

export const action: ActionFunction = async ({ request }) => {
  const { id } = await request.json();
  if (request.method === "POST") {
    if (id) {
      const product = await prisma.inventories.delete({
        where: {
          id: id,
        },
      });
      return product;
    }
  }
}