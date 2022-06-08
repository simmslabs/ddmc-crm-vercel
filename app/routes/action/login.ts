import { ActionFunction, json } from "@remix-run/node";
import prisma from "~/services/prisma";
import crypt from "bcrypt";
import Cookies from "universal-cookie";

export const action: ActionFunction = async ({ request }) => {
  if (request.method === "POST") {
    const { email, password } = await request.json();
    if (email === "" || password === "") {
      return json({
        success: false,
        body: "Email or password is empty"
      })
    }

    const user = await prisma.employees.findFirst({
      where: {
        email,
      },
      include: {
        role: {
          include: {
            role_permissions: {
              select: {
                permission: {
                  select: {
                    name: true
                  }
                },
              }
            }
          }
        },
        department: true
      }
    });

    if (!user) {
      return json({
        success: false,
        body: "Email or password is wrong"
      })
    }

    if (crypt.compareSync(password, user.password)) {
      const cookie = new Cookies();
      cookie.set("token", user, { path: "/" });
      return json({
        success: true,
        data: user
      })
    } else {
      return json({
        success: false,
        body: "Email or password is wrong"
      })
    }
  }
}