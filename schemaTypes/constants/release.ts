/** Allowed values for `release.format` (physical release type). */
export const releaseFormatOptions: {title: string; value: string}[] = [
  {title: 'LP', value: 'LP'},
  {title: 'EP', value: 'EP'},
  {title: 'Single', value: 'Single'},
]

/** Allowed values for `release.speed` (RPM stored as string). */
export const releaseSpeedOptions: {title: string; value: string}[] = [
  {title: '33 RPM', value: '33'},
  {title: '45 RPM', value: '45'},
  {title: '78 RPM', value: '78'},
]
