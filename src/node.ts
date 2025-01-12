const credentials = btoa("ney:caca");

fetch("http://localhost:8787/api/todos", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Basic ${credentials}`,
  },
  body: JSON.stringify({ text: "test" }),
})
  .then((res) => {
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    console.log("autorhized");
  })
  .catch((err) => console.log(err));
