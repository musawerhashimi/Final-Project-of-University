export type Customers = {
  id_card: number;
  name: string;
  date_of_birth: string;
  gender: "Male" | "Female";
  email: string;
  phone: number;
  address: string;
  city: string;
  balance: Record<string, number>;
  image: string;
};

const customers: Customers[] = [
  {
    id_card: 1,
    name: "Edris",
    date_of_birth: "2002/03/10",
    gender: "Male",
    email: "musawerhashimi@.com",
    phone: 93730520798,
    address: "kabul,khairkhana",
    city: "Kabul",

    balance: {
      USD: 200,
    },
    image: "/images/bg-2.jpg",
  },
  {
    id_card: 2,
    name: "Suhail",
    date_of_birth: "2002/03/10",
    gender: "Male",
    email: "musawerhashimi@.com",
    phone: 93730520798,
    address: "kabul,khairkhana",
    city: "Kabul",
    balance: {
      USD: 2000,
      AFG: 2099877,
    },
    image: "/images/bg-1.jpg",
  },
  {
    id_card: 3,
    name: "Musawer",
    date_of_birth: "2002/03/10",
    gender: "Male",
    email: "musawerhashimi@.com",
    phone: 93730520798,
    address: "kabul,khairkhana",
    city: "Kabul",
    balance: {
      USD: 2000,
      AFG: 2099877,
    },
    image: "/images/bg-3.jpg",
  },
  {
    id_card: 4,
    name: "تجار منصور (عمده‌فروشی)",
    date_of_birth: "2002/03/10",
    gender: "Male",
    email: "musawerhashimi@.com",
    phone: 93730520798,
    address: "kabul,khairkhana",
    city: "Kabul",
    balance: {
      USD: 2000,
      AFG: 2099877,
    },
    image: "/images/bg-4.jpg",
  },
  {
    id_card: 5,
    name: "وارت سرکه سه",
    date_of_birth: "2002/03/10",
    gender: "Male",
    email: "musawerhashimi@.com",
    phone: 93730520798,
    address: "kabul,khairkhana",
    city: "Kabul",
    balance: {
      USD: 2000,
      AFG: 2099877,
    },
    image: "/images/logo.jpg",
  },
  {
    id_card: 6,
    name: "ریانی تجار",
    date_of_birth: "2002/03/10",
    gender: "Male",
    email: "musawerhashimi@.com",
    phone: 93730520798,
    address: "kabul,khairkhana",
    city: "Kabul",
    balance: {
      USD: 2000,
      AFG: 2099877,
    },
    image: "/images/user.jpeg",
  },
  {
    id_card: 7,
    name: "مرکزی جاوید امیری",
    date_of_birth: "2002/03/10",
    gender: "Male",
    email: "musawerhashimi@.com",
    phone: 93730520798,
    address: "kabul,khairkhana",
    city: "Kabul",
    balance: {
      USD: 2000,
      AFG: 2099877,
    },
    image: "/images/product-3.jpg",
  },
  {
    id_card: 8,
    name: "شیرین آغا تجار",
    date_of_birth: "2002/03/10",
    gender: "Male",
    email: "musawerhashimi@.com",
    phone: 93730520798,
    address: "kabul,khairkhana",
    city: "Kabul",
    balance: {
      USD: 2000,
      AFG: 2099877,
    },
    image: "/images/product-2.jpg",
  },
  {
    id_card: 9,
    name: "بصیر جان (بالین فروش)",
    date_of_birth: "2002/03/10",
    gender: "Male",
    email: "musawerhashimi@.com",
    phone: 93730520798,
    address: "kabul,khairkhana",
    city: "Kabul",
    balance: {
      USD: 2000,
      AFG: 2099877,
    },
    image: "/images/product.jpg",
  },
];
export default customers;
