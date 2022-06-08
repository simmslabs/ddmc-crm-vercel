import { categories, departments } from "@prisma/client";
import { ActionFunction, json } from "@remix-run/node";
import prisma from "~/services/prisma";

export const action: ActionFunction = async ({ request }) => {
  if (request.method === 'POST') {
    const { id, title }: { id: number, title: string } = await request.json();
    let category: categories | null;
    if (id) {
      category = await prisma.categories.update({ where: { id }, data: { title } });
      return json({
        success: true,
        message: `Successfully  department ${id}`,
        data: category
      });
    }
    category = await prisma.categories.create({ data: { title } });
    return json({
      success: true,
      message: `Successfully created department ${category.title}`,
      data: category
    });
  }
}