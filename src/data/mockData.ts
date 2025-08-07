// Mock data for development and testing
export const products = [
  {
    id: '1',
    name: 'Classic Dress Shirt',
    category: 'shirt' as const,
    basePrice: 1299,
    image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Premium cotton dress shirt with classic fit and professional styling.',
    fabrics: [
      {
        id: 'f1',
        name: 'Premium Cotton',
        type: 'Cotton',
        priceMultiplier: 1.0,
        image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'Soft, breathable cotton fabric'
      },
      {
        id: 'f2',
        name: 'Egyptian Cotton',
        type: 'Cotton',
        priceMultiplier: 1.3,
        image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'Luxurious Egyptian cotton with superior quality'
      }
    ]
  },
  {
    id: '2',
    name: 'Business Suit',
    category: 'suit' as const,
    basePrice: 4999,
    image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Tailored business suit with modern cut and premium finish.',
    fabrics: [
      {
        id: 'f3',
        name: 'Wool Blend',
        type: 'Wool',
        priceMultiplier: 1.2,
        image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'Durable wool blend for professional wear'
      },
      {
        id: 'f4',
        name: 'Pure Wool',
        type: 'Wool',
        priceMultiplier: 1.5,
        image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'Premium pure wool for luxury suits'
      }
    ]
  },
  {
    id: '3',
    name: 'Evening Dress',
    category: 'dress' as const,
    basePrice: 2999,
    image: 'https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Elegant evening dress perfect for special occasions.',
    fabrics: [
      {
        id: 'f5',
        name: 'Silk',
        type: 'Silk',
        priceMultiplier: 1.8,
        image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'Luxurious silk fabric with natural sheen'
      },
      {
        id: 'f6',
        name: 'Satin',
        type: 'Satin',
        priceMultiplier: 1.4,
        image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'Smooth satin with elegant drape'
      }
    ]
  },
  {
    id: '4',
    name: 'Formal Trousers',
    category: 'pants' as const,
    basePrice: 1599,
    image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Perfectly tailored formal trousers for professional wear.',
    fabrics: [
      {
        id: 'f7',
        name: 'Cotton Blend',
        type: 'Cotton',
        priceMultiplier: 1.0,
        image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'Comfortable cotton blend for daily wear'
      },
      {
        id: 'f8',
        name: 'Linen',
        type: 'Linen',
        priceMultiplier: 1.2,
        image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'Breathable linen for summer comfort'
      }
    ]
  },
  {
    id: '5',
    name: 'Blazer Jacket',
    category: 'jacket' as const,
    basePrice: 3499,
    image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Stylish blazer jacket for business and casual occasions.',
    fabrics: [
      {
        id: 'f9',
        name: 'Tweed',
        type: 'Wool',
        priceMultiplier: 1.3,
        image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'Classic tweed for timeless style'
      },
      {
        id: 'f10',
        name: 'Cashmere',
        type: 'Cashmere',
        priceMultiplier: 2.0,
        image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'Luxurious cashmere for ultimate comfort'
      }
    ]
  },
  {
    id: '6',
    name: 'Casual Shirt',
    category: 'shirt' as const,
    basePrice: 999,
    image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Comfortable casual shirt for everyday wear.',
    fabrics: [
      {
        id: 'f11',
        name: 'Denim',
        type: 'Cotton',
        priceMultiplier: 1.1,
        image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'Durable denim fabric for casual wear'
      },
      {
        id: 'f12',
        name: 'Flannel',
        type: 'Cotton',
        priceMultiplier: 1.2,
        image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'Soft flannel for cozy comfort'
      }
    ]
  }
];

export const fabrics = [
  {
    id: 'f1',
    name: 'Premium Cotton',
    type: 'Cotton',
    priceMultiplier: 1.0,
    image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300',
    description: 'Soft, breathable cotton fabric perfect for everyday wear'
  },
  {
    id: 'f2',
    name: 'Egyptian Cotton',
    type: 'Cotton',
    priceMultiplier: 1.3,
    image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300',
    description: 'Luxurious Egyptian cotton with superior quality and durability'
  },
  {
    id: 'f3',
    name: 'Pure Silk',
    type: 'Silk',
    priceMultiplier: 1.8,
    image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300',
    description: 'Luxurious silk fabric with natural sheen and smooth texture'
  },
  {
    id: 'f4',
    name: 'Wool Blend',
    type: 'Wool',
    priceMultiplier: 1.2,
    image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300',
    description: 'Durable wool blend perfect for professional and formal wear'
  }
];

export const customizationOptions = {
  collar: ['Spread', 'Point', 'Button-down', 'Cutaway', 'Band'],
  sleeve: ['Full Sleeve', 'Half Sleeve', '3/4 Sleeve', 'Sleeveless'],
  fit: ['Slim Fit', 'Regular Fit', 'Relaxed Fit', 'Tailored Fit'],
  length: ['Regular', 'Long', 'Short', 'Extra Long'],
  buttons: ['Standard', 'Horn', 'Mother of Pearl', 'Metal', 'Wooden'],
  stitching: ['Standard', 'Contrast', 'Decorative', 'Hand-stitched']
};