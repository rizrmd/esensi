import { betterAuth } from "better-auth";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "get-session",
  url: "/api/get-session",
  async handler() {
    return new Response(`\
<script>
fetch('/api/auth/get-session').then(async (e) => {
    window.parent.postMessage(
      { action: "session", ...(await e.json()) },
      "*"
    );
});
window.onmessage = (e) => {
  if (e.data === 'signout') {
    fetch('/api/auth/sign-out', {method: 'POST', body: '{}'}).then(() => {
      window.parent.postMessage(
        { action: "signout" },
        "*"
      );
    })
  }
}
</script>`, {
      headers: { "content-type": "text/html" },
    });
  },
});
