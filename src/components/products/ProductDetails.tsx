import React from 'react';


const ProductDetails = ({ product }) => {
    console.log(product);
    const { id, name, description, price, sku, is_active } = product;
    return (
        <div>
           <h1>Product Details</h1>
           <p>Product ID: {id}</p>
           <p>Name: {name}</p>
           <p>Description: {description}</p>
           <p>Price: ${price}</p>
           <p>SKU: {sku}</p>
           <p>Status: {is_active ? "Active" : "Inactive"}</p>
        </div>
    );
};

export default ProductDetails;