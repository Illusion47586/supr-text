import OGImage from '@components/og_image';
import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const config = {
    runtime: 'edge',
};

export default function (req: NextRequest) {
    const { searchParams } = req.nextUrl;
    return new ImageResponse(<OGImage code={searchParams.get('code')} />, {
        width: 1200,
        height: 600,
    });
}
