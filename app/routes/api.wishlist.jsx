import { json } from "@remix-run/react";
import prisma from "../db.server";
import { cors } from "remix-utils/cors";

export async function loader({ request }) {
  console.log('loader running')
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

  console.log("Wishlist data: " + JSON.stringify(wishlist));

  return cors(request, response);
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
      return cors(
        request,
        json({
          error: "Missing required parameters",
        }),
      );
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
        return cors(request, response);

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
        return cors(request, response);

      default:
        return cors(
          request,
          json({
            error: "Invalid action",
          }),
        );
    }
  } catch (error) {
    return cors(
      request,
      json({
        error: error.message,
      }),
    );
  }
}
