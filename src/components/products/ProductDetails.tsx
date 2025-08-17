"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";

type Media = {
  id: number;
  image: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type ProductData = {
  id: number;
  media?: Media[];
  name: string;
  description: string;
  price: string;
  discount_rate: string;
  quantity_in_stock: number;
  sku: string;
  rating: number;
  reviewCount: number;
};

interface ProductPageProps {
  product: { data: ProductData };
}

export default function ProductPage({ product }: ProductPageProps) {
  const media = Array.isArray(product.data.media) ? product.data.media : [];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // ✅ zustand hook
  const addToCart = useCartStore((state) => state.addToCart);

  const discountNum = parseFloat(product.data.discount_rate);
  const priceNum = parseFloat(product.data.price);
  const discountedPrice = (priceNum * (1 - discountNum / 100)).toFixed(2);

  const validImageIndex =
    selectedImageIndex < media.length ? selectedImageIndex : 0;

  const increaseQty = () => {
    if (quantity < product.data.quantity_in_stock) setQuantity(quantity + 1);
  };

  const decreaseQty = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const onChangeQty = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = Number(e.target.value);
    if (isNaN(val)) return;
    if (val < 1) val = 1;
    if (val > product.data.quantity_in_stock)
      val = product.data.quantity_in_stock;
    setQuantity(val);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? (media.length > 0 ? media.length - 1 : 0) : prev - 1
    );
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
  };

  // ✅ Add to cart handler
  const handleAddToCart = () => {
    addToCart([
      {
        id: product.data.id,
        name: product.data.name,
        sku: product.data.sku,
        price: Number(discountedPrice),
        quantity: quantity,
      },
    ]);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 grid md:grid-cols-2 gap-10">
      {/* Left side images */}
      <div className="relative">
        <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden border border-gray-200 relative">
          <img
            src={`http://127.0.0.1:8000/${media[validImageIndex]?.image}`}
            alt={`Product Image ${validImageIndex + 1}`}
            style={{ width: "100%", height: "auto", objectFit: "cover" }}
          />

          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow hover:bg-gray-100"
            aria-label="Previous Image"
            type="button"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow hover:bg-gray-100"
            aria-label="Next Image"
            type="button"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Thumbnails */}
        <div className="flex space-x-3 mt-4 overflow-x-auto">
          {media.length > 0 ? (
            media.map((mediaItem, idx) => (
              <button
                key={mediaItem.id}
                onClick={() => setSelectedImageIndex(idx)}
                className={`w-20 h-20 rounded-md border overflow-hidden ${
                  idx === validImageIndex
                    ? "border-blue-600 ring-2 ring-blue-500"
                    : "border-gray-300"
                }`}
                aria-label={`Select image ${idx + 1}`}
                type="button"
              >
                <img
                  src={`http://127.0.0.1:8000/${mediaItem.image}`}
                  alt={`Thumbnail ${idx + 1}`}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </button>
            ))
          ) : (
            <p>No images available</p>
          )}
        </div>
      </div>

      {/* Right side product details */}
      <div>
        <h1 className="text-3xl font-semibold">{product.data.name}</h1>

        {/* Price & Discount */}
        <div className="flex items-center space-x-4 mt-2">
          <p className="text-3xl font-bold text-red-600">${discountedPrice}</p>
          {discountNum > 0 && (
            <>
              <p className="text-gray-400 line-through">
                ${product.data.price}
              </p>
              <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">
                -{discountNum.toFixed(0)}%
              </span>
            </>
          )}
        </div>

        {/* Quantity */}
        <div className="mt-6">
          <p className="font-medium mb-1">Quantity</p>
          <div className="flex items-center space-x-2 max-w-xs">
            <Button variant="outline" onClick={decreaseQty}>
              –
            </Button>
            <Input
              type="number"
              min={1}
              max={product.data.quantity_in_stock}
              value={quantity}
              onChange={onChangeQty}
              className="text-center w-16"
            />
            <Button variant="outline" onClick={increaseQty}>
              +
            </Button>
          </div>
          <p className="mt-3 text-md text-gray-800">
            {product.data.quantity_in_stock} items available
          </p>
        </div>

        {/* Add to cart */}
        <div className="mt-6 flex space-x-4">
          <Button
            className="flex-1 bg-blue-900 font-bold"
            size="lg"
            disabled={product.data.quantity_in_stock === 0}
            onClick={handleAddToCart}
          >
            Add to cart
          </Button>
        </div>
        {/* view to cart */}
        <div className="mt-6 flex space-x-4">
          <Link href="/products/buy" className="flex-1">
            <Button className="w-full text-white font-bold" size="lg">
              View Cart
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
