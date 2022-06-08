import { ActionFunction } from "remix";
import prisma from "~/services/prisma";

export const action: ActionFunction = async ({ request }) => {
  const { id } = await request.json();
  if (request.method === "POST") {
    if (id) {
      const product = await prisma.project_categories.delete({
        where: {
          id: id,
        },
      });
      return product;
    }
  }
}