import React, { useEffect, useState } from "react";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";
import "./ProductPage.css";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    subcategoryId: "",
    mrp: "",
    price: "",
    stock: "",
    image: "",
    sizes: "",
    colors: "",
  });

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("GET error:", error);
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle input
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Submit (Add / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      name: formData.name,
      subcategoryId: formData.subcategoryId,
      images: [formData.image],
      mrp: Number(formData.mrp),
      price: Number(formData.price),
      stock: Number(formData.stock),
      sizes: formData.sizes ? formData.sizes.split(",") : [],
      colors: formData.colors ? formData.colors.split(",") : [],
    };

    try {
      if (editId) {
        const updated = await updateProduct(editId, productData);

        // Update instantly in UI
        setProducts((prev) =>
          prev.map((p) =>
            p._id === editId ? updated : p
          )
        );

        alert("Product Updated");
      } else {
        const newProduct = await addProduct(productData);

        // Show immediately below
        setProducts((prev) => [...prev, newProduct]);

        alert("Product Added");
      }

      setShowPopup(false);
      setEditId(null);

      setFormData({
        name: "",
        subcategoryId: "",
        mrp: "",
        price: "",
        stock: "",
        image: "",
        sizes: "",
        colors: "",
      });
    } catch (error) {
      console.log("SAVE error:", error.response?.data);
      alert("Error saving product");
    }
  };

  // Edit
  const handleEdit = (p) => {
    setFormData({
      name: p.name,
      subcategoryId: p.subcategoryId?._id || "",
      mrp: p.mrp,
      price: p.price,
      stock: p.stock,
      image: p.images?.[0] || "",
      sizes: p.sizes?.join(","),
      colors: p.colors?.join(","),
    });

    setEditId(p._id);
    setShowPopup(true);
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete product?")) return;

    try {
      await deleteProduct(id);

      // Remove instantly
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div className="container">
      <h1>Fashion Products</h1>

      <button className="add-btn" onClick={() => setShowPopup(true)}>
        Add Product
      </button>

      {products.length === 0 ? (
        <h2>No Products Found</h2>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <div className="card" key={p._id}>
              <img src={p.images?.[0]} alt={p.name} />
              <h3>{p.name}</h3>
              <p>MRP: ₹{p.mrp}</p>
              <p>Price: ₹{p.price}</p>
              <p>Stock: {p.stock}</p>
              <p>Sizes: {p.sizes?.join(", ")}</p>
              <p>Colors: {p.colors?.join(", ")}</p>

              <div className="actions">
                <button onClick={() => handleEdit(p)}>Edit</button>
                <button className="delete" onClick={() => handleDelete(p._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>{editId ? "Edit Product" : "Add Product"}</h2>

            <form onSubmit={handleSubmit}>
              <input name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} required />
              <input name="subcategoryId" placeholder="Subcategory ID" value={formData.subcategoryId} onChange={handleChange} required />
              <input name="mrp" placeholder="MRP" value={formData.mrp} onChange={handleChange} required />
              <input name="price" placeholder="Price" value={formData.price} onChange={handleChange} required />
              <input name="stock" placeholder="Stock" value={formData.stock} onChange={handleChange} required />
              <input name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} required />
              <input name="sizes" placeholder="Sizes (S,M,L)" value={formData.sizes} onChange={handleChange} />
              <input name="colors" placeholder="Colors (Red,Blue)" value={formData.colors} onChange={handleChange} />

              <div className="popup-buttons">
                <button type="submit">Submit</button>
                <button type="button" onClick={() => setShowPopup(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}