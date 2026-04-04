export async function POST(req) {
  try {
    const { url } = await req.json();

    let currentUrl = url;

    for (let i = 0; i < 3; i++) {
      const res = await fetch(currentUrl, {
        method: "GET",
        redirect: "manual",
      });

      const location = res.headers.get("location");

      if (!location) break;

      currentUrl = location;
    }

    return Response.json({
      expanded: currentUrl,
    });
  } catch {
    return Response.json({ error: "Cannot expand link" }, { status: 500 });
  }
}
