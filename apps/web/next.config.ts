import type {NextConfig} from 'next'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: projectId ? `/images/${projectId}/**` : '/images/**',
      },
    ],
  },
  logging: {
    fetches: {fullUrl: false},
  },
  typedRoutes: true,
}

export default nextConfig
