import { departments, media_types } from "@prisma/client";
import { ActionFunction, json } from "@remix-run/node";
import prisma from "~/services/prisma";

export const action: ActionFunction = async ({ request }) => {
  if (request.method === 'POST') {
    const { id, title }: { id: number, title: string } = await request.json();
    let media_type: media_types | null;
    if (id) {
      media_type = await prisma.media_types.update({ where: { id }, data: { title } });
      return json({
        success: true,
        message: `Successfully  department ${id}`,
        data: media_type
      });
    }
    media_type = await prisma.media_types.create({ data: { title } });
    return json({
      success: true,
      message: `Successfully created department ${media_type.title}`,
      data: media_type
    });
  }
}