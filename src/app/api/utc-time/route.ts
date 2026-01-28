import { encryptDataApi } from "@/components/shared/encryption";
import { NextResponse } from "next/server";

export async function GET() {
  const utcTimestamp = parseFloat((Date.now() / 1000).toFixed(3));
  
  return NextResponse.json(
    { fx_dyn: encryptDataApi(utcTimestamp, process.env.SECRET_KEY as string) },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
        "Surrogate-Control": "no-store",
      },
    }
  );
}
