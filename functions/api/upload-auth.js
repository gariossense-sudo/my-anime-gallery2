export async function onRequestGet(context) {
  const privateKey = context.env.private_rx4Q1vVX7D96n3F3OxwSP+FEJLo=;
  const publicKey = context.env.public_RJZJ2GxMj0hxx+927eVCodOl+Bk=;

  if (!privateKey || !publicKey) {
    return Response.json(
      { error: "Konfigurasi ImageKit belum lengkap." },
      { status: 500 }
    );
  }

  const token = crypto.randomUUID();
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

  const signature = Array.from(new Uint8Array(signatureBuffer))
    .map(byte => byte.toString(16).padStart(2, "0"))
    .join("");

  return Response.json({
    token,
    expire,
    signature,
    publicKey
  });
}
