import { customers } from "@prisma/client";
import { ActionFunction, json } from "@remix-run/node";
import prisma from "~/services/prisma";

export const action: ActionFunction = async ({ request }) => {
  if (request.method === "POST") {
    const { fullname, email, phone, update }: { fullname: string, email: string, phone: string, update: number | null } = await request.json();
    if (fullname.length > 0) {
      let customer: customers | null;
      if (update) {
        customer = await prisma.customers.update({
          where: { id: update },
          data: {
            name: fullname,
            email: email,
            phone: phone,
          },
        });
      } else {
        customer = await prisma.customers.create({
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
        data: customer,
        message: `Successfully created customer ${customer.name}`
      });
    }
  }
  return json({
    success: false,
    message: "Fullname is required"
  });
};