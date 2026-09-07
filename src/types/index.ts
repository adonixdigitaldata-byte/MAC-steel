export interface ProductSpecification {
  label: string;
  labelAr?: string;
  value: string;
  valueAr?: string;
}

export interface Product {
  id: string;
  slug: string;
  partNumber: string;
  name: string;
  nameAr: string;
  category: string;
  categoryAr: string;
  description: string;
  descriptionAr: string;
  shortDescription?: string;
  shortDescriptionAr?: string;
  documentRef?: string;
  productCode?: string;
  size?: string;
  material?: string;
  grade?: string;
  finish?: string;
  thickness?: string;
  availableSizes?: string[];
  application?: string;
  applicationAr?: string;
  applications?: string[];
  applicationsAr?: string[];
  features?: string[];
  featuresAr?: string[];
  specifications?: ProductSpecification[];
  image?: string;
  gallery?: string[];
  relatedProducts?: string[];
  related?: string[];
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
