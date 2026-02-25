import axios from "axios";

const BASE_URL = "https://fashion-spot.onrender.com/api/products";

// GET all products
export const getProducts = async () => {
  const res = await axios.get(BASE_URL);
  console.log("GET Response:", res.data);
  return res.data.products || res.data.data ;
};

// ADD product
export const addProduct = async (product) => {
  const res = await axios.post(BASE_URL, product, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// UPDATE product
export const updateProduct = async (id, product) => {
  const res = await axios.put(`${BASE_URL}/${id}`, product);
  return res.data;
};

// DELETE product
export const deleteProduct = async (id) => {
  const res = await axios.delete(`${BASE_URL}/${id}`);
  return res.data;
};
