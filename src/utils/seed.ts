import { DB } from "@/types";
import * as schemas from "@/db/schemas";
import { usersData } from "@/db/dataset";
import bcryp from "bcryptjs";

export async function seed(db: DB) {
  await db.delete(schemas.usersTable);

  const mappedUsers = usersData.map((user) => ({
    ...user,
    password: bcryp.hashSync(user.password, 10),
  }));

  const insertedUsers = await db.insert(schemas.usersTable).values(mappedUsers);
  console.log("data seeded");
  console.log(insertedUsers.meta.changes);
}
