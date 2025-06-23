type Medicine = {
  _id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  expiryDate: string;
  status: string;
  availability: "in-stock" | "low-stock" | "out-of-stock";
  available?: boolean;
};
