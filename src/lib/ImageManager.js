"use server"

import sharp from "sharp";

export async function TrimEdges(Image, width = 100, height = 100) {
    try {

        const arrayBuffer = await Image.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer)

        const proccessedbuffer = await sharp(arrayBuffer)
        .trim()
        .resize(width, height)
        .toFormat("webp")
        .toBuffer();

        return new Uint8Array(proccessedbuffer);
    } catch (e) {
        if (e) throw e;
    }
}