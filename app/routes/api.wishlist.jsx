import { json } from "@remix-run/react";
import prisma from "../db.server";

export async function loader({ request }) {
  const url = new URL(request.url);
  const customerId = url.searchParams.get("customerId");
  const productId = url.searchParams.get("productId");
  const shop = url.searchParams.get("shop");

  if (!customerId || !productId || !shop) {
    return json({
      error: "Missing required parameters",
    });
  }

  const wishlist = await prisma.wishlist.findMany({
    where: {
      customerId,
      productId,
      shop,
    },
  });

  const response = json({
    ok: true,
    message: "success",
    data: wishlist,
  });

  return json(response);
}

export async function action({ request }) {
  try {
    let data = await request.formData();
    data = Object.fromEntries(data);
    const customerId = data.customerId;
    const productId = data.productId;
    const shop = data.shop;
    const _action = data._action;

    if (!customerId || !productId || !shop || !_action) {
      return json({
        error: "Missing required parameters",
      });
    }

    let response;

    switch (_action) {
      case "CREATE":
        const wishlist = await prisma.wishlist.create({
          data: {
            customerId,
            productId,
            shop,
          },
        });
        response = json({
          message: "Product added to wishlist",
          method: _action,
          wishlisted: true,
          data: wishlist,
        });
        return response;

      case "DELETE":
        await prisma.wishlist.deleteMany({
          where: {
            customerId,
            productId,
            shop,
          },
        });
        response = json({
          message: "Product removed from wishlist",
          method: _action,
          wishlisted: false,
        });
        return response;

      default:
        return json({
          error: "Invalid action",
        });
    }
  } catch (error) {
    return json({
      error: error.message,
    });
  }
}
