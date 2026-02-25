import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: '67ème Avenue',
        short_name: '67ème',
        description: 'Portfolio Ralys Shop',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        icons: [
            {
                src: '/icon192_app.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon512_app.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}
