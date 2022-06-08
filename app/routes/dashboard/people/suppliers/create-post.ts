import { customers, suppliers } from "@prisma/client";
import { ActionFunction, json } from "@remix-run/node";
import prisma from "~/services/prisma";

export const action: ActionFunction = async ({ request }) => {
  if (request.method === "POST") {
    const { fullname, email, phone, update }: { fullname: string, email: string, phone: string, update: number | null } = await request.json();
    if (fullname.length > 0) {
      let supplier: suppliers | null;
      if (update) {
        supplier = await prisma.suppliers.update({
          where: { id: update },
          data: {
            name: fullname,
            email: email,
            phone: phone,
          },
        });
      } else {
        supplier = await prisma.suppliers.create({
          data: {
            name: fullname,
            phone: phone,
            email: email,
            employee: 1
          }
        });
      }
      return json({
        success: true,
        data: supplier,
        message: `Successfully created customer ${supplier.name}`
      });
    }
  }
  return json({
    success: false,
    message: "Fullname is required"
  });
};