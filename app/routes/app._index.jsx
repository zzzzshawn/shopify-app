import { json } from "@remix-run/node";
import prisma from "../db.server";
import { authenticate } from "../shopify.server";
import { useLoaderData } from "@remix-run/react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { BlockStack, Card, DataTable, EmptyState, Layout, Page} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";

export async function loader({ request }) {
  const auth = await authenticate.admin(request);
  const shop = auth.session.shop;

  const wishlists = await prisma.wishlist.findMany({
    where: {
      shop,
    },
    orderBy: {
      id: "asc",
    },
  });

  return json({
    wishlists,
  });
}

export default function Index() {
  const {wishlists} = useLoaderData();
  console.log(wishlists);
  const wishlistData = wishlists.map((wishlist) => {
    const createdAt = formatDistanceToNow(parseISO(wishlist.createdAt), {
      addSuffix: true,
    });
    return [wishlist.customerId, wishlist.productId, createdAt];
  }) 

  return (
    <Page title="Wishlist overview dashboard">
      <TitleBar title="Overview"></TitleBar>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              {wishlistData.length > 0 ? (
                <DataTable
                  columnContentTypes={["text", "text", "text"]}
                  headings={["Customer ID", "Product ID", "Created At"]}
                  rows={wishlistData}
                />
              ) : (
                <EmptyState
                  heading="Manage your wishlist products here"
                  action={{
                    content: "Learn more",
                    url: "https://youtube.com/codeinspire",
                    external: "true",
                  }}
                  secondaryAction={{
                    content: "Watch videos",
                    url: "https://youtube.com/codeinspire",
                    external: "true",
                  }}
                  image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                >
                  <p>You don't have any products in your wishlist yet.</p>
                </EmptyState>
              )}
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
