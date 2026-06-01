const PLACEHOLDER_URL = '/placeholder-cover.png'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Chain = {[key: string]: (...args: any[]) => Chain | string}

function buildChain(): Chain {
  return {
    width: () => buildChain(),
    height: () => buildChain(),
    auto: () => buildChain(),
    fit: () => buildChain(),
    url: () => PLACEHOLDER_URL,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(_source: any): Chain {
  return buildChain()
}
