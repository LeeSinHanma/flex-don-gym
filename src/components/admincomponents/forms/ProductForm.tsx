import React from 'react';
import { IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonTextarea } from '@ionic/react';
import './ProductForm.css';

interface ProductFormData {
  name: string;
  category: string;
  price: string;
  stock: string;
  description: string;
  sku: string;
}

interface ProductFormProps {
  formData: ProductFormData;
  onChange: (data: ProductFormData) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ formData, onChange }) => {
  const handleChange = (field: keyof ProductFormData, value: string) => {
    onChange({ ...formData, [field]: value });
  };

  const categories = ['Supplements', 'Equipment', 'Apparel', 'Accessories', 'Drinks'];

  return (
    <div className="product-form">
      <IonItem>
        <IonLabel position="stacked">Product Name *</IonLabel>
        <IonInput
          value={formData.name}
          onIonChange={(e) => handleChange('name', e.detail.value!)}
          placeholder="Enter product name"
        />
      </IonItem>

      <IonItem>
        <IonLabel position="stacked">Category *</IonLabel>
        <IonSelect
          value={formData.category}
          onIonChange={(e) => handleChange('category', e.detail.value)}
          placeholder="Select category"
        >
          {categories.map((cat) => (
            <IonSelectOption key={cat} value={cat}>
              {cat}
            </IonSelectOption>
          ))}
        </IonSelect>
      </IonItem>

      <IonItem>
        <IonLabel position="stacked">Price (₱) *</IonLabel>
        <IonInput
          type="number"
          value={formData.price}
          onIonChange={(e) => handleChange('price', e.detail.value!)}
          placeholder="0.00"
        />
      </IonItem>

      <IonItem>
        <IonLabel position="stacked">Stock Quantity *</IonLabel>
        <IonInput
          type="number"
          value={formData.stock}
          onIonChange={(e) => handleChange('stock', e.detail.value!)}
          placeholder="0"
        />
      </IonItem>

      <IonItem>
        <IonLabel position="stacked">SKU</IonLabel>
        <IonInput
          value={formData.sku}
          onIonChange={(e) => handleChange('sku', e.detail.value!)}
          placeholder="Product SKU"
        />
      </IonItem>

      <IonItem>
        <IonLabel position="stacked">Description</IonLabel>
        <IonTextarea
          value={formData.description}
          onIonChange={(e) => handleChange('description', e.detail.value!)}
          placeholder="Product description"
          rows={3}
        />
      </IonItem>
    </div>
  );
};

export default ProductForm;
