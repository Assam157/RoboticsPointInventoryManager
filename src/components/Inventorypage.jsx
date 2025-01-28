   import React, { useState, useEffect } from 'react';
import './InventoryPage.css';

const InventoryPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch all products from the backend
        const fetchProducts = async () => {
            try {
                const response = await fetch(
                    'https://roboticspointbackend-b6b7b2e85bbf.herokuapp.com/get_products',
                    {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to load products');
                }

                const data = await response.json();
                setProducts(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load products: ' + err.message);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleUpdate = async (productId, newQuantity, newPrice) => {
        // Avoid unnecessary updates if no changes are made
        if (isNaN(newQuantity) || isNaN(newPrice)) {
            alert('Invalid quantity or price');
            return;
        }

        // Update the stock and price for the product
        const response = await fetch(
            'https://roboticspointbackend-b6b7b2e85bbf.herokuapp.com/update_product_stock',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    _id: productId,
                    availableQuant: parseInt(newQuantity),
                    price: parseFloat(newPrice),
                }),
            }
        );

        const data = await response.json();

        if (data.success) {
            setProducts((prevProducts) =>
                prevProducts.map((product) =>
                    product._id === productId
                        ? {
                              ...product,
                              availableQuant: parseInt(newQuantity),
                              price: parseFloat(newPrice),
                          }
                        : product
                )
            );
            alert('Stock and price updated successfully!');
        } else {
            alert('Error updating product: ' + data.message);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="inventory-page">
            <h2>Inventory Management</h2>
            <table>
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Available Quantity</th>
                        <th>Price</th>
                        <th>Update Quantity</th>
                        <th>Update Price</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product._id}>
                            <td>{product.name}</td>
                            <td>{product.availableQuant}</td>
                            <td>${product.price ? product.price.toFixed(2) : '0.00'}</td>
                            <td>
                                <input
                                    type="number"
                                    defaultValue={product.availableQuant}
                                    onBlur={(e) => {
                                        const newQuantity = e.target.value;
                                        if (parseInt(newQuantity) !== product.availableQuant) {
                                            handleUpdate(
                                                product._id,
                                                newQuantity,
                                                product.price
                                            );
                                        }
                                    }}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    step="0.01"
                                    defaultValue={product.price}
                                    onBlur={(e) => {
                                        const newPrice = e.target.value;
                                        if (parseFloat(newPrice) !== product.price) {
                                            handleUpdate(
                                                product._id,
                                                product.availableQuant,
                                                newPrice
                                            );
                                        }
                                    }}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InventoryPage;
