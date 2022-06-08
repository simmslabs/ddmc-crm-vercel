import { departments, roles } from "@prisma/client";
import { ActionFunction, json } from "@remix-run/node";
import prisma from "~/services/prisma";

export const action: ActionFunction = async ({ request }) => {
  if (request.method === 'POST') {
    const { id, title, permissions } = await request.json();
    let role: roles | null;
    if (id) {
      await prisma.role_has_permissions.deleteMany({ where: { role_id: id } });
      role = await prisma.roles.update({
        where: { id }, data: {
          name: title, role_permissions: {
            createMany: {
              data: permissions.map((r: any) => ({
                permission_id: r
              }))
            }
          }
        }
      });
      return json({
        success: true,
        message: `Successfully updated role ${role.name}`,
        data: role
      });
    }
    role = await prisma.roles.create({
      data: {
        name: title, guard_name: '', role_permissions: {
          createMany: {
            data: permissions.map((r: any) => ({
              permission_id: r,
            }))
          }
        }
      }
    });
    return json({
      success: true,
      message: `Successfully created department ${role.name}`,
      data: role
    });
  }
}