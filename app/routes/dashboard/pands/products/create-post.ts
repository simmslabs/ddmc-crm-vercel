import { unstable_composeUploadHandlers, unstable_createFileUploadHandler, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData } from "@remix-run/node";
import { ActionFunction } from "remix";
import prisma from "~/services/prisma";
import fs from "fs";
import { inventories } from "@prisma/client";
import slugify from "slugify";

export const action: ActionFunction = async ({ request }) => {
  if (request.method === "POST") {

    const uploadHandler = unstable_composeUploadHandlers(
      unstable_createFileUploadHandler({
        maxPartSize: 5_000_000,
        file: ({ filename }) => filename,
      }),
      unstable_createMemoryUploadHandler()
    );

    const formData = await unstable_parseMultipartFormData(
      request,
      uploadHandler
    );

    const images = formData.getAll("images") as unknown as FormDataEntryValue & {
      name: string,
      filepath: string
    }[];

    const title = formData.get("title") as string;
    const quantity = formData.get("quantity");
    const description = formData.get("description") as string;
    const slug = formData.get("slug") as string;
    const sales_price = formData.get("sales_price");
    const product_code = formData.get("product_code") as string;
    const product_brand = formData.get("product_brand");
    const purchase_price = formData.get("purchase_price") as string;
    const product_category = formData.get("product_category");
    const show_in_shop = formData.get("show_in_shop") as unknown as number;
    const update = parseInt(formData.get("update") as string, 10);

    try {

      const dt = {
        slug: slugify(title).toLowerCase(),
        title: title,
        quantity: parseInt(quantity as string, 10),
        description: description,
        sales_price: parseInt(sales_price as string, 10) * 100,
        purchase_price: parseInt(purchase_price as string, 10) * 100,
        brandsId: parseInt(product_brand as string),
        categoriesId: parseInt(product_category as string, 10),
        code: product_code,
        show_in_shop: show_in_shop ? true : false,
      };

      let product: inventories;
      if (update > 0) {
        product = await prisma.inventories.update({
          where: {
            id: update,
          },
          data: dt,
        });
      } else {
        product = await prisma.inventories.create({
          data: dt
        });
      }

      if (images.length > 0 && product) {
        if (update > 0) {
          const _imgs = await prisma.images.findMany({ where: { inventories_id: update } });
          _imgs.forEach(async (img) => {
            try {
              fs.unlinkSync(`public/images/products/${img.image}`);
            } catch (error) {
              console.log(error);
            }
          });
          const dt = await prisma.images.deleteMany({
            where: {
              inventories_id: update
            }
          });
        }
        for (let i = 0; i < images.length; i++) {
          const image = images[i];
          const _images = await prisma.images.create({
            data: {
              image: image.name,
              inventories_id: product.id,
            }
          });
          if (_images) {
            fs.copyFileSync(image.filepath, `public/images/products/${image.name}`);
          }
        }
      }

      return {
        success: true,
        message: "Product created successfully",
        update,
        data: product
      };

    } catch (error: any) {
      return {
        success: false,
        message: error.message,
        // data: error
      }
    }
  }
}