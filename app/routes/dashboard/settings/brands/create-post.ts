import { brands, departments } from "@prisma/client";
import { ActionFunction, json } from "@remix-run/node";
import slugify from "slugify";
import prisma from "~/services/prisma";

export const action: ActionFunction = async ({ request }) => {
  if (request.method === 'POST') {
    const { id, title }: { id: number, title: string } = await request.json();
    let brand: brands | null;
    if (id) {
      brand = await prisma.brands.update({ where: { id }, data: { name: title } });
      return json({
        success: true,
        message: `Successfully  department ${id}`,
        data: brand
      });
    }
    brand = await prisma.brands.create({ data: { name: title, slug: slugify(title) } });
    return json({
      success: true,
      message: `Successfully created department ${brand.name}`,
      data: brand
    });
  }
}