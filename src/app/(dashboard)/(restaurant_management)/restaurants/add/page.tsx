import AddRestaurantForm from "@/components/restaurant/AddRestaruantForm";

function RestaurantAddPage() {
  return (
    <div className="shadow-md border p-4 rounded-md">
      <div>
        <h4 className="text-2xl font-bold text-center mb-4">
          Add a new restaurant
        </h4>
      </div>
      <AddRestaurantForm />
    </div>
  );
}

export default RestaurantAddPage;
