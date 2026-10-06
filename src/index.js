export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ==============================
    // IMAGEKIT UPLOAD AUTH
    // ==============================
    if (url.pathname === "/api/upload-auth") {
      if (request.method !== "GET") {
        return new Response("Method Not Allowed", {
          status: 405
        });
      }

      const privateKey = env.IMAGEKIT_PRIVATE_KEY;
      const publicKey = env.IMAGEKIT_PUBLIC_KEY;

      if (!privateKey || !publicKey) {
        return Response.json(
          {
            error: "Konfigurasi ImageKit belum lengkap."
          },
          { status: 500 }
        );
      }

      const token = crypto.randomUUID();

      // Kurang dari 1 jam sesuai kebutuhan ImageKit
      const expire = Math.floor(Date.now() / 1000) + 30 * 60;

      const encoder = new TextEncoder();

      const cryptoKey = await crypto.subtle.importKey(
        "raw",
        encoder.encode(privateKey),
        {
          name: "HMAC",
          hash: "SHA-1"
        },
        false,
        ["sign"]
      );

      const signatureBuffer = await crypto.subtle.sign(
        "HMAC",
        cryptoKey,
        encoder.encode(token + expire)
      );

      const signature = Array.from(
        new Uint8Array(signatureBuffer)
      )
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");

      return Response.json({
        token,
        expire,
        signature,
        publicKey
      });
    }

    // ==============================
    // WEBSITE
    // ==============================
    return env.ASSETS.fetch(request);
  }
};
