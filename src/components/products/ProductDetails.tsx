"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Heart, Star, ChevronLeft, ChevronRight } from "lucide-react";

type Media = {
  id: number;
  image: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type Product = {
  id: number;
  media?: Media[]; // made optional to be safe
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
  product: Product;
}

export default function ProductPage({ product }: ProductPageProps) {
  console.log("Product data:", product);

  // Safe default values

  const media = Array.isArray(product.data.media) ? product.data.media : [];
  console.log("media length:", media.length);


  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
  const discountNum = parseFloat(product.data.discount_rate);
  const priceNum = parseFloat(product.data.price);
  const discountedPrice = (priceNum * (1 - discountNum / 100)).toFixed(2);

  // Ensure selectedImageIndex stays within bounds if media changes
  const validImageIndex =
    selectedImageIndex < media.length ? selectedImageIndex : 0;

  const increaseQty = () => {
    if (quantity < product.quantity_in_stock) setQuantity(quantity + 1);
  };

  const decreaseQty = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const onChangeQty = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = Number(e.target.value);
    if (isNaN(val)) return;
    if (val < 1) val = 1;
    if (val > product.quantity_in_stock) val = product.quantity_in_stock;
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
              console.log(mediaItem.image,"media image"),
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
              <p className="text-gray-400 line-through">${product.price}</p>
              <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">
                -{discountNum.toFixed(0)}%
              </span>
            </>
          )}
        </div>

        {/* Rating & Reviews */}
        <div className="flex items-center space-x-2 mt-3 text-yellow-500">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
              stroke="currentColor"
              className="w-5 h-5"
            />
          ))}
          <span className="text-gray-600 text-sm">
            ({product.reviewCount} reviews)
          </span>
        </div>
      

        {/* Quantity */}
        <div className="mt-6">
          <p className="font-medium mb-1">Quantity</p>
          <div className="flex items-center space-x-2 max-w-xs">
            <Button
              variant="outline"
              onClick={decreaseQty}
              aria-label="Decrease quantity"
            >
              –
            </Button>
            <Input
              type="number"
              min={1}
              max={product.quantity_in_stock}
              value={quantity}
              onChange={onChangeQty}
              className="text-center w-16"
              aria-live="polite"
              aria-atomic="true"
            />
            <Button
              variant="outline"
              onClick={increaseQty}
              aria-label="Increase quantity"
            >
              +
            </Button>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {product.quantity_in_stock} items available
          </p>
        </div>

        {/* Add to cart & favorite */}
        <div className="mt-6 flex space-x-4">
          <Button
            className="flex-1"
            size="lg"
            disabled={product.quantity_in_stock === 0}
          >
            Add to cart
          </Button>
          <Button
            variant="outline"
            aria-label="Add to favorites"
            className="w-12 h-12 flex items-center justify-center"
          >
            <Heart className="w-6 h-6 text-red-500" />
          </Button>
        </div>

        {/* Delivery info */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-2">Delivery</h2>
          <p className="text-sm text-gray-700 mb-1">
            Free standard shipping on orders over $35 before tax, plus free
            returns.
          </p>
          <table className="w-full text-sm text-left text-gray-600 border border-gray-200 rounded-md">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">How Long</th>
                <th className="px-3 py-2">How Much</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-2">Standard delivery</td>
                <td className="px-3 py-2">1-4 business days</td>
                <td className="px-3 py-2">$4.50</td>
              </tr>
              <tr>
                <td className="px-3 py-2">Express delivery</td>
                <td className="px-3 py-2">1 business day</td>
                <td className="px-3 py-2">$10.00</td>
              </tr>
              <tr>
                <td className="px-3 py-2">Pick up in store</td>
                <td className="px-3 py-2">1-3 business days</td>
                <td className="px-3 py-2">Free</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Return info */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Return</h2>
          <ul className="list-disc list-inside text-gray-700 text-sm">
            <li>
              You have 60 days to return the item(s) using any of the following
              methods:
            </li>
            <li>Free store returns</li>
            <li>Free returns via USPS Dropoff Service</li>
          </ul>
        </div>

        {/* Share & payment */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex space-x-3 items-center text-gray-600">
            <span>Share:</span>
            <a
              href="#"
              aria-label="Share on Facebook"
              className="hover:text-blue-600"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.5228-4.4772-10-10-10S2 6.4772 2 12c0 4.9915 3.657 9.1283 8.438 9.8787v-6.987H7.898v-2.89h2.54V9.845c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.466h-1.26c-1.243 0-1.63.772-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.1283 22 16.9915 22 12z" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="Share on Twitter"
              className="hover:text-blue-400"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14.86 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5.5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="Share on Pinterest"
              className="hover:text-red-600"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12c0 4.991 3.657 9.128 8.438 9.879-.117-.839-.223-2.13.047-3.047.243-.79 1.562-5.036 1.562-5.036s-.397-.796-.397-1.974c0-1.847 1.071-3.23 2.406-3.23 1.135 0 1.682.85 1.682 1.87 0 1.138-.727 2.837-1.1 4.414-.312 1.317.66 2.389 1.957 2.389 2.35 0 4.158-2.48 4.158-6.056 0-3.147-2.26-5.351-5.486-5.351-3.734 0-5.918 2.796-5.918 5.688 0 1.138.438 2.357.985 3.02a.396.396 0 01.09.38c-.1.416-.324 1.317-.367 1.5-.058.243-.19.296-.44.179-1.64-.764-2.66-3.15-2.66-5.077 0-4.138 3.006-7.933 8.673-7.933 4.545 0 8.077 3.243 8.077 7.58 0 4.515-2.846 8.155-6.8 8.155-1.33 0-2.576-.69-3.004-1.49l-.816 3.112c-.296 1.142-1.096 2.57-1.633 3.437a12.076 12.076 0 0011.029-13.294A11.66 11.66 0 0012 0z" />
              </svg>
            </a>
          </div>

          <div className="flex space-x-4 items-center">
            {/* Payment method logos */}
            <Image src="/visa.svg" alt="Visa" width={48} height={24} />
            <Image
              src="/mastercard.svg"
              alt="MasterCard"
              width={48}
              height={24}
            />
            <Image src="/paypal.svg" alt="PayPal" width={48} height={24} />
          </div>
        </div>
      </div>
    </div>
  );
}
