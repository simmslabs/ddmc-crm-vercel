import { departments } from "@prisma/client";
import { ActionFunction, json } from "@remix-run/node";
import prisma from "~/services/prisma";

export const action: ActionFunction = async ({ request }) => {
  if (request.method === 'POST') {
    const { id, title }: { id: number, title: string } = await request.json();
    let department: departments | null;
    if (id) {
      department = await prisma.departments.update({ where: { id }, data: { title } });
      return json({
        success: true,
        message: `Successfully  department ${id}`,
        data: department
      });
    }
    department = await prisma.departments.create({ data: { title } });
    return json({
      success: true,
      message: `Successfully created department ${department.title}`,
      data: department
    });
  }
}