import { accounts, brands, departments } from "@prisma/client";
import { ActionFunction, json } from "@remix-run/node";
import slugify from "slugify";
import prisma from "~/services/prisma";

export const action: ActionFunction = async ({ request }) => {
  if (request.method === 'POST') {
    const { title, description, update } = await request.json();
    let account: accounts | null;
    if (update) {
      account = await prisma.accounts.update({ where: { id: update }, data: { name: title, description } });
      return json({
        success: true,
        message: `Successfully updated account ${account.name}`,
        data: account
      });
    }
    account = await prisma.accounts.create({ data: { name: title, description } });
    return json({
      success: true,
      message: `Successfully created department ${account.name}`,
      data: account
    });
  }
}