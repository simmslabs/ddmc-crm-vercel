import { accounts, brands, departments, project_categories } from "@prisma/client";
import { ActionFunction, json } from "@remix-run/node";
import slugify from "slugify";
import prisma from "~/services/prisma";

export const action: ActionFunction = async ({ request }) => {
  if (request.method === 'POST') {
    const { title, update } = await request.json();
    let account: project_categories | null;
    if (update) {
      account = await prisma.project_categories.update({ where: { id: update }, data: { title } });
      return json({
        success: true,
        message: `Successfully updated account ${account.title}`,
        data: account
      });
    }
    account = await prisma.project_categories.create({ data: { title } });
    return json({
      success: true,
      message: `Successfully created department ${account.title}`,
      data: account
    });
  }
}