import { ActionFunction, json } from "@remix-run/node";
import prisma from "~/services/prisma";

export const action: ActionFunction = async ({ request }) => {
  if (request.method === "POST") {
    const { id } = await request.json();
    if (id) {
      const role = await prisma.roles.delete({
        where: {
          id
        }
      });
      return json({
        success: true,
        message: `Successfully deleted role ${role.name}`,
        data: role
      });
    }
  }
}