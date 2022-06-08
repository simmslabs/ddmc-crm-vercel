import { projects } from "@prisma/client";
import { ActionFunction, json } from "@remix-run/node";
import prisma from "~/services/prisma";
import { projects_type } from "~/services/types";

export const action: ActionFunction = async ({ request }) => {
  const { invoice_id, start_date, due_date, customer_id, note, comment, title, project_category_id, update, status, tasks } = await request.json();
  if (request.method === "POST") {
    if (invoice_id) {

      const url = new URL(request.url);
      let invoice: projects | null;
      if (update) {
        invoice = await prisma.projects.update({
          where: { id: update }, data: {
            invoice_id, start_date, due_date, customer_id, note, comment, project_title: title, project_category_id, status, tasks: {
              createMany: {
                data: tasks.map((_t: any) => ({
                  task_title: _t.task_title,
                  start_date: _t.start_date,
                  due_date: _t.due_date,
                  employee_id: _t.employee_id,
                  note: _t.note,
                  comment: _t.comment,
                }))
              }
            }
          }
        });
      } else {
        invoice = await prisma.projects.create({
          data: {
            start_date,
            invoice_id,
            due_date,
            customer_id,
            note,
            comment,
            project_title: title,
            project_category_id,
            status,
            tasks: {
              createMany: {
                data: tasks.map((_t: any) => ({
                  task_title: _t.task_title,
                  start_date: _t.start_date,
                  due_date: _t.due_date,
                  employee_id: _t.employee_id,
                  note: _t.note,
                  comment: _t.comment,
                }))
              }
            }
          }
        });
      }

      if (invoice) {
        const _inv = await prisma.projects.findFirst({ where: { id: invoice.id }, include: { customer: true, category: true, invoice: true, tasks: true } });
        return json({
          success: true,
          message: `Successfully created project ${invoice.project_title}`,
          data: _inv
        });
      } else {
        return json({
          success: false,
          message: `Failed to create project`,
        });
      }
    };
  };
};