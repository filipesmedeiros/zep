import withAnalyzer from '@next/bundle-analyzer'

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  compress: true,
}

export default withAnalyzer({
  enabled:
    process.env.ANALYZE === 'true' && process.env.NODE_ENV !== 'production',
})(nextConfig)
