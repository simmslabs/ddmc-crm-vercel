import { departments } from "@prisma/client";
import { ActionFunction, json } from "@remix-run/node";
import prisma from "~/services/prisma";

export const action: ActionFunction = async ({ request }) => {
  if (request.method === 'POST') {
    const { id, title }: { id: number, title: string } = await request.json();
    let employee_position: departments | null;
    if (id) {
      employee_position = await prisma.employee_positions.update({ where: { id }, data: { title } });
      return json({
        success: true,
        message: `Successfully  department ${id}`,
        data: employee_position
      });
    }
    employee_position = await prisma.employee_positions.create({ data: { title } });
    return json({
      success: true,
      message: `Successfully created department ${employee_position.title}`,
      data: employee_position
    });
  }
}