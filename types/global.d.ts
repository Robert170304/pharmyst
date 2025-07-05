type availabilityStatus = "in-stock" | "low-stock" | "out-of-stock";
type Medicine = {
  _id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  expiryDate: string;
  status: string;
  availability: availabilityStatus;
  available?: boolean;
};

interface searchParamsDTO {
  name: string;
  category: string;
  availability: string;
  manufacturer: string;
  expiryDate: string;
  pharmacy: string;
  page: number;
  limit: number;
}

interface SearchPharmacyItemDTO {
  pharmacy: {
    _id: string;
    pharmacyName: string;
    address: string;
    distance: string;
    phone: string;
    rating: number;
    isOpen: boolean;
  };
  medicines: {
    _id: string;
    name: string;
    category: string;
    price: number;
    quantity: number;
    expiryDate: string;
    availability: string;
  }[];
}

interface PharmacyPublicDTO {
  _id: string;
  pharmacyName: string;
  address: string;
  phone: string;
  rating: number;
  reviews: number;
  hours: string;
  isOpen: boolean;
  ownerName: string;
}
