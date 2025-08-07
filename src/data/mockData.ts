import { Product, Fabric } from '../types';

export const fabrics: Fabric[] = [
  {
    id: '1',
    name: 'Premium Cotton',
    type: 'Cotton',
    priceMultiplier: 1.2,
    image: 'https://images.pexels.com/photos/6069977/pexels-photo-6069977.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Soft, breathable cotton perfect for everyday wear'
  },
  {
    id: '2',
    name: 'Silk Blend',
    type: 'Silk',
    priceMultiplier: 2.5,
    image: 'https://images.pexels.com/photos/5691616/pexels-photo-5691616.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Luxurious silk blend for special occasions'
  },
  {
    id: '3',
    name: 'Wool Suiting',
    type: 'Wool',
    priceMultiplier: 2.0,
    image: 'https://images.pexels.com/photos/7679459/pexels-photo-7679459.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Professional wool fabric for formal wear'
  },
  {
    id: '4',
    name: 'Linen Summer',
    type: 'Linen',
    priceMultiplier: 1.5,
    image: 'https://images.pexels.com/photos/6621343/pexels-photo-6621343.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Light and airy linen for summer comfort'
  }
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Custom Dress Shirt',
    category: 'shirt',
    basePrice: 899,
    image: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Perfectly tailored dress shirt for professional occasions',
    fabrics
  },
  {
    id: '2',
    name: 'Tailored Suit',
    category: 'suit',
    basePrice: 2499,
    image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Complete two-piece suit tailored to perfection',
    fabrics
  },
  {
    id: '3',
    name: 'Custom Blazer',
    category: 'jacket',
    basePrice: 1799,
    image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Sophisticated blazer for business and casual wear',
    fabrics
  },
  {
    id: '4',
    name: 'Formal Trousers',
    category: 'pants',
    basePrice: 1199,
    image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Perfectly fitted formal trousers',
    fabrics
  },
  {
    id: '5',
    name: 'Evening Dress',
    category: 'dress',
    basePrice: 3299,
    image: 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Elegant evening dress for special occasions',
    fabrics
  },
  {
    id: '6',
    name: 'Casual Shirt',
    category: 'shirt',
    basePrice: 699,
    image: 'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Comfortable casual shirt for everyday wear',
    fabrics
  }
];

export const customizationOptions = {
  collar: ['Spread', 'Point', 'Button-down', 'Mandarin', 'Club'],
  sleeve: ['Full Sleeve', 'Half Sleeve', '3/4 Sleeve', 'Sleeveless'],
  fit: ['Slim Fit', 'Regular Fit', 'Relaxed Fit', 'Tailored Fit'],
  length: ['Regular', 'Long', 'Short', 'Extra Long'],
  buttons: ['Plastic', 'Shell', 'Horn', 'Metal', 'Wood'],
  stitching: ['Machine', 'Hand-stitched', 'French Seam', 'Flat-fell']
};