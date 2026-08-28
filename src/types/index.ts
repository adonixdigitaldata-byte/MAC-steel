export interface ProductSpecification {
  label: string;
  labelAr?: string;
  value: string;
  valueAr?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  nameAr: string;
  category: string;
  categoryAr: string;
  description: string;
  descriptionAr: string;
  documentRef?: string;
  productCode?: string;
  size?: string;
  material?: string;
  grade?: string;
  application?: string;
  applicationAr?: string;
  features?: string[];
  featuresAr?: string[];
  specifications?: ProductSpecification[];
  image?: string;
  gallery?: string[];
  relatedProducts?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderCustomerDetails {
  name: string;
  mobile: string;
  email?: string;
}
