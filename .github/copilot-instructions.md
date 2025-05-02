We use bun latest version. in frontend we use shadcn and tailwind with our own router library. do not use useState, use this instead: 

```
import { useLocal } from "@/lib/hooks/use-local";
const local = useLocal({data: []}, async () => {
    // async init function.
    local.data = ['loaded'];
    local.render();
})
```

Use bahasa indonesia for all of the UI text that is shown to user, but use english for code.

In server we already setup prisma client in global db variable, just use it.

To deal with database CRUD operations such as fetching, inserting, updating, and deleting data, we are using API in folder backend/src/api. Under the hood, we are using prisma for this. For example, in backend/src/api/auth.esensi/user.ts, we are fetching a data from table auth_user filtered by his/her username. This is the example:

```
import { defineAPI } from "rlib/server";
export default defineAPI({
  name: "auth_user",
  url: "/api/auth/user",
  async handler(arg: { username: string }) {
    const res = await db.auth_user.findFirst({
      where: {
        OR: [
          {email: arg.username},
          {username: arg.username,}
        ],
      },
    });
    return res;
  },
});

```

Do not use fetch on frontend, use api instead like this instead:

```
import { api } from "@/lib/gen/auth.esensi";
const res = await api.auth_user({ username: username! });
```