import {
  Box,
  Card,
  Page,
  Text,
  BlockStack,
  InlineGrid,
  TextField,
  Button,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useState } from "react";
import { Form, useLoaderData } from "@remix-run/react";
import prisma from "../db.server";

export async function loader() {
  const appSetting = await prisma.setting.findFirst({});

  return new Response(JSON.stringify(appSetting), { status: 200 });
}

export async function action({ request }) {
  const data = await request.formData();
  const response = Object.fromEntries(data);

  const existingSetting = await prisma.setting.findFirst({
    where: {
      settingName: "wishlistSetting",
    },
  });

  if (!existingSetting) {
    const newSetting = await prisma.setting.create({
      data: {
        name: response.name,
        description: response.description,
      },
    });

    return new Response(JSON.stringify(newSetting), { status: 200 });
  }

  const newSetting = await prisma.setting.upsert({
    where: {
      id: existingSetting.id,
    },
    create: {
      name: response.name,
      description: response.description,
    },
    update: {
      name: response.name,
      description: response.description,
    },
  });

  return new Response(JSON.stringify(newSetting), { status: 200 });
}

export default function SettingsPage() {
  const data = useLoaderData();
  const setting = JSON.parse(data);

  const [formState, setFormState] = useState(setting);

  return (
    <Page>
      <TitleBar title="Settings" />
      <BlockStack gap={{ xs: "800", sm: "400" }}>
        <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
          <Box
            as="section"
            paddingInlineStart={{ xs: 400, sm: 0 }}
            paddingInlineEnd={{ xs: 400, sm: 0 }}
          >
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">
                Settings
              </Text>
              <Text as="p" variant="bodyMd">
                Update app settings and preferences.
              </Text>
            </BlockStack>
          </Box>
          <Card roundedAbove="sm">
            <Form method="POST">
              <BlockStack gap="400">
                <TextField
                  label="App name."
                  name="name"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e })}
                />
                <TextField
                  label="Description."
                  name="description"
                  value={formState.description}
                  onChange={(e) =>
                    setFormState({ ...formState, description: e })
                  }
                />

                <Button submit={true} variant="primary">
                  Save
                </Button>
              </BlockStack>
            </Form>
          </Card>
        </InlineGrid>
      </BlockStack>
    </Page>
  );
}
