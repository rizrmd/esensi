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