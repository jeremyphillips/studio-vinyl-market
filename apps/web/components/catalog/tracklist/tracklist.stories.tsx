import type {Meta, StoryObj} from '@storybook/react'

import {Tracklist} from './tracklist'

const meta: Meta<typeof Tracklist> = {
  title: 'Catalog/Tracklist',
  component: Tracklist,
  parameters: {layout: 'padded'},
}

export default meta
type Story = StoryObj<typeof Tracklist>

export const SingleDisc: Story = {
  args: {
    discs: [
      {
        _key: 'disc-1',
        discNumber: 1,
        tracks: [
          {_key: 'a1', position: 'A1', title: 'So What'},
          {_key: 'a2', position: 'A2', title: 'Freddie Freeloader'},
          {_key: 'a3', position: 'A3', title: 'Blue in Green'},
          {_key: 'b1', position: 'B1', title: 'All Blues'},
          {_key: 'b2', position: 'B2', title: 'Flamenco Sketches'},
        ],
      },
    ],
  },
}

export const MultiDisc: Story = {
  args: {
    discs: [
      {
        _key: 'disc-1',
        discNumber: 1,
        tracks: [
          {_key: 'a1', position: 'A1', title: 'Chameleon'},
          {_key: 'a2', position: 'A2', title: 'Watermelon Man'},
        ],
      },
      {
        _key: 'disc-2',
        discNumber: 2,
        tracks: [
          {_key: 'b1', position: 'B1', title: 'Sly'},
          {_key: 'b2', position: 'B2', title: 'Vein Melter'},
        ],
      },
    ],
  },
}

export const Named: Story = {
  args: {
    discs: [
      {
        _key: 'disc-1',
        discNumber: 1,
        name: 'Side A',
        tracks: [
          {_key: 't1', position: '1', title: 'Opening'},
          {_key: 't2', position: '2', title: 'Interlude'},
        ],
      },
      {
        _key: 'disc-2',
        discNumber: 2,
        name: 'Side B',
        tracks: [{_key: 't3', position: '3', title: 'Closing'}],
      },
    ],
  },
}

export const Empty: Story = {
  args: {discs: []},
}
