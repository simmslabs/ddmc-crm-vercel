import { media_sizes } from "@prisma/client";
import { ActionFunction, json } from "@remix-run/node";
import prisma from "~/services/prisma";

export const action: ActionFunction = async ({ request }) => {
  if (request.method === 'POST') {
    const { id, title }: { id: number, title: string } = await request.json();
    let media_size: media_sizes | null;
    if (id) {
      media_size = await prisma.media_sizes.update({ where: { id }, data: { title } });
      return json({
        success: true,
        message: `Successfully  department ${id}`,
        data: media_size
      });
    }
    media_size = await prisma.media_sizes.create({ data: { title } });
    return json({
      success: true,
      message: `Successfully created department ${media_size.title}`,
      data: media_size
    });
  }
}