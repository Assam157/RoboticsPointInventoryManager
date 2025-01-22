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
                const response = await fetch('https://roboticspointbackend-b6b7b2e85bbf.herokuapp.com/get_products', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                
                // Check if the response is ok (status 200)
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

    const handleStockChange = async (productId, newQuantity) => {
        // Update the available quantity for the product
        const response = await fetch('https://roboticspointbackend-b6b7b2e85bbf.herokuapp.com/update_product_stock', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ _id: productId, availableQuant: parseInt(newQuantity) }),
        });
        
        const data = await response.json();

        if (data.success) {
            setProducts((prevProducts) =>
                prevProducts.map((product) =>
                    product._id === productId ? { ...product, availableQuant: newQuantity } : product
                )
            );
            alert('Stock updated successfully!');
        } else {
            alert('Error updating stock: ' + data.message);
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
                        <th>Update Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product._id}>
                            <td>{product.name}</td>
                            <td>{product.availableQuant}</td>
                            <td>
                                <input
                                    type="number"
                                    defaultValue={product.availableQuant}
                                    onBlur={(e) => handleStockChange(product._id, e.target.value)}
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
