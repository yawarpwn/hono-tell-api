import { Hono } from "hono";
import { basicAuth } from "hono/basic-auth";

const app = new Hono();

app.get("/", (c) => {
  return new Response("Good morining");
});

app.get("/posts/:id", (c) => {
  const page = c.req.query("page");
  const id = c.req.param("id");
  c.header("X-Message", "Hi!");
  return c.text(`You want see ${page} of ${id}`);
});

app.post("/posts", (c) => c.text("Created!", 201));
app.delete("/posts/:id", (c) => c.text(`${c.req.param("id")} is deleted!`));

const View = () => {
  return (
    <html>
      <body>
        <h1>Hello Hono!</h1>
      </body>
    </html>
  );
};

app.use("/admin/*", basicAuth({ username: "admin", password: "secret" }));

app.get("/admin", (c) => {
  return c.text("you are authorized");
});

app.get("/page", (c) => {
  return c.html(<View />);
});

export default app;
