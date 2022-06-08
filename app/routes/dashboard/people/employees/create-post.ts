import { customers, employees, employee_status } from "@prisma/client";
import { ActionFunction, json } from "@remix-run/node";
import prisma from "~/services/prisma";
import bcrypt from "bcrypt";

export const action: ActionFunction = async ({ request }) => {
  if (request.method === "POST") {
    try {
      const { fullname, email, phone, update, password, department, position, status, salary, role }:
        {
          fullname: string,
          email: string,
          phone: string,
          update: number | null,
          password: string,
          salary: string,
          department: number,
          position: number,
          status: employee_status,
          role: number
        } = await request.json();
      if (fullname.length > 0) {
        let employee: employees;
        if (update) {
          employee = await prisma.employees.update({
            where: { id: update },
            data: {
              name: fullname,
              email: email,
              phone: phone,
              salary: salary,
              departmentsId: department,
              employee_positionsId: position,
              employee_status: status,
              role_id: role
            },
          });
          if (password && password.length > 0) {
            const enc = bcrypt.hashSync(password, 10);
            await prisma.employees.update({ where: { id: employee.id }, data: { password: enc } });
          }
        } else {
          const hash = await bcrypt.hash(password, 10);
          employee = await prisma.employees.create({
            data: {
              name: fullname,
              email: email,
              phone: phone,
              salary: salary,
              employee_positionsId: position,
              departmentsId: department,
              employee_status: status,
              password: hash,
              role_id: role
            }
          });
        }
        const employee_ = await prisma.employees.findFirst({ where: { id: employee.id }, include: { position: true, department: true, role: true } });
        if (employee_) {
          return json({
            success: true,
            data: employee_,
            message: `Successfully created customer ${employee_.name}`
          });
        }
      }
    } catch (error) {
      return json({
        success: false,
        message: error
      });
    }
  }
  return json({
    success: false,
    message: "Fullname is required"
  });
};