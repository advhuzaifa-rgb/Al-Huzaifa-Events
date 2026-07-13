import one from './1.webp'
import two from './2.webp'
import three from './3.webp'

export const articles = [
  {
    slug: 'bring-summer-home-simple-ways-to-add-colour',
    image: one,
    title: 'Bring Summer Home: Simple Ways to Add Colour to Your Space',
    metaTitle: 'Bring Summer Home: Simple Ways to Add Colour | Al Huzaifa',
    metaDescription:
      'Discover simple, sophisticated ways to bring summer colour into your home through furniture, accessories and styling — without redesigning an entire room.',
    description:
      'Adding colour is one of the easiest ways to refresh your interiors for summer. Instead of redesigning an entire room, introduce carefully selected colours through furniture, accessories and styling to create a sophisticated seasonal update.',
    points: [
      {
        heading: 'Start with Soft Neutrals',
        description: 'Use beige, ivory and sand as the foundation.',
      },
      {
        heading: 'Introduce Seasonal Accent Colours',
        description:
          'Terracotta, olive, sage, muted blue and warm coral create a fresh summer palette.',
      },
      {
        heading: 'Refresh with Accessories',
        description: 'Cushions, artwork, vases and decorative objects instantly transform a room.',
      },
      {
        heading: 'Mix Natural Materials',
        description: 'Wood, marble, boucle and linen balance colourful accents beautifully.',
      },
      {
        heading: 'Use Statement Furniture',
        description:
          'A coloured accent chair or ottoman adds personality without overwhelming the space.',
      },
    ],
  },

  {
    slug: 'create-your-own-summer-retreat-cozy-corner',
    image: two,
    title: 'Create Your Own Summer Retreat: How to Design a Cozy Corner Just for You',
    metaTitle: 'Create Your Own Summer Retreat: Design a Cozy Corner | Al Huzaifa',
    metaDescription:
      'Learn how to turn any unused corner of your home into a calming summer retreat with thoughtfully designed luxury furniture and accessories from Al Huzaifa.',
    description:
      'Summer is the perfect season to slow down and create a personal sanctuary at home. Whether it’s a reading nook, a quiet coffee corner, or a relaxing space to unwind after work, even the smallest area can become your favourite place. With thoughtfully designed luxury furniture and accessories from Al Huzaifa Furniture, creating a calming retreat has never been easier.',
    points: [
      {
        heading: 'Choose the Right Spot',
        description: 'Look for unused corners near natural light or windows.',
      },
      {
        heading: 'Invest in Comfortable Seating',
        description: 'A luxurious accent chair instantly defines the space.',
      },
      {
        heading: 'Layer Soft Textures',
        description: 'Use cushions, throws and rugs to create warmth.',
      },
      {
        heading: 'Add Functional Furniture',
        description: 'A side table keeps books, drinks and décor within reach.',
      },
      {
        heading: 'Style with Lighting',
        description: 'A table or floor lamp creates a relaxing ambience.',
      },
      {
        heading: 'Personalise the Space',
        description: 'Include books, candles, artwork and greenery that reflect your personality.',
      },
    ],
  },
  {
    slug: 'summer-styling-guide-10-easy-ways-to-refresh-your-home',
    image: three,
    title: 'Summer Styling Guide: 10 Easy Ways to Refresh Your Home This Season',
    metaTitle: 'Summer Styling Guide: 10 Easy Ways to Refresh Your Home | Al Huzaifa',
    metaDescription:
      'Refreshing your home for summer doesn’t require a complete renovation. Discover 10 easy styling updates to transform your interiors while keeping them timeless.',
    description:
      'Refreshing your home for summer doesn’t require a complete renovation. Small styling updates can completely transform your interiors while keeping them timeless and elegant.',
    points: [
      {
        heading: 'Lighten Your Colour Palette',
        description: 'Introduce soft neutral shades inspired by nature.',
      },
      {
        heading: 'Add Natural Textures',
        description: 'Combine linen, wood and marble for warmth.',
      },
      { heading: 'Refresh Your Seating', description: 'Invest in comfortable statement seating.' },
      {
        heading: 'Style with Accessories',
        description: 'Update vases, candles and decorative objects.',
      },
      { heading: 'Bring in Greenery', description: 'Plants instantly add freshness.' },
      { heading: 'Upgrade Lighting', description: 'Layer warm lighting for cosy evenings.' },
      { heading: 'Create Conversation Areas', description: 'Arrange furniture for better flow.' },
      {
        heading: 'Declutter',
        description: 'Open, organised spaces feel cooler and more luxurious.',
      },
      { heading: 'Introduce Organic Shapes', description: 'Curved furniture softens interiors.' },
      {
        heading: 'Invest in Timeless Pieces',
        description: 'Choose quality furniture that lasts beyond trends.',
      },
    ],
  },
]

export const getArticleBySlug = (slug) => articles.find((article) => article.slug === slug)
