import express from "express";
import { createServer as createViteServer } from "vite";
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { products } from "./shared/products.js";

const app = express();
const port = Number(process.env.PORT) || 3000;
const isProduction =
  process.env.NODE_ENV === "production" ||
  process.argv.includes("--production");
const root = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json({ limit: "32kb" }));

app.get("/api/products", (_request, response) => {
  response.json(products);
});

app.post("/api/checkout", (request, response) => {
  const { customer, items } = request.body ?? {};
  const name = typeof customer?.name === "string" ? customer.name.trim() : "";
  const phone =
    typeof customer?.phone === "string" ? customer.phone.trim() : "";
  const address =
    typeof customer?.address === "string" ? customer.address.trim() : "";

  if (!name || !phone || !address) {
    return response
      .status(400)
      .json({ error: "Заполните имя, телефон и адрес доставки." });
  }

  if (
    !Array.isArray(items) ||
    items.length === 0 ||
    items.some(
      (item) =>
        typeof item?.id !== "string" ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 99 ||
        !products.some((product) => product.id === item.id),
    )
  ) {
    return response.status(400).json({ error: "Проверьте состав заказа." });
  }

  const total = items.reduce((sum, item) => {
    const product = products.find((entry) => entry.id === item.id);
    return sum + product.price * item.quantity;
  }, 0);

  return response.status(201).json({
    orderId: randomUUID(),
    total,
    message: "Заказ принят. Мы свяжемся с вами для подтверждения.",
  });
});

if (isProduction) {
  const distPath = path.join(root, "dist");
  app.use(express.static(distPath));
  app.get("*", (_request, response) => {
    response.sendFile(path.join(distPath, "index.html"));
  });
} else {
  const vite = await createViteServer({
    configFile: path.join(root, "vite.config.js"),
    server: { middlewareMode: true },
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.get("*", async (request, response, next) => {
    try {
      const template = await vite.transformIndexHtml(
        request.originalUrl,
        await readFile(path.join(root, "index.html"), "utf-8"),
      );
      response.status(200).set({ "Content-Type": "text/html" }).end(template);
    } catch (error) {
      vite.ssrFixStacktrace(error);
      next(error);
    }
  });
}

app.use((error, _request, response, _next) => {
  console.error("Request failed:", error);
  response.status(500).json({ error: "Внутренняя ошибка сервера." });
});

app.listen(port, () => {
  console.log(`Интерьер запущен: http://localhost:${port}`);
});
