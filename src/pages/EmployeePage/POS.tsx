import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonIcon,
  IonBadge,
  IonToast,
} from '@ionic/react';
import { addCircleOutline, removeCircleOutline, trashOutline, cartOutline } from 'ionicons/icons';
import EmployeeHeader from '../../components/EmployeeComponents/Layout/Header';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface CartItem extends Product {
  quantity: number;
}

const POS: React.FC = () => {
  const [products] = useState<Product[]>([
    { id: '1', name: 'Protein Shake', price: 250, stock: 50 },
    { id: '2', name: 'Energy Drink', price: 80, stock: 100 },
    { id: '3', name: 'Gym Towel', price: 150, stock: 30 },
    { id: '4', name: 'Water Bottle', price: 120, stock: 45 },
    { id: '5', name: 'Energy Bar', price: 60, stock: 80 },
  ]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const addToCart = () => {
    if (!selectedProduct) return;

    const product = products.find((p) => p.id === selectedProduct);
    if (!product) return;

    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(
          cart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        );
      } else {
        setToastMessage('Insufficient stock!');
        setShowToast(true);
      }
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    setSelectedProduct('');
  };

  const updateQuantity = (id: string, delta: number) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    setCart(
      cart.map((item) => {
        if (item.id === id) {
          const newQuantity = item.quantity + delta;
          if (newQuantity <= 0) return item;
          if (newQuantity > product.stock) {
            setToastMessage('Insufficient stock!');
            setShowToast(true);
            return item;
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      setToastMessage('Cart is empty!');
      setShowToast(true);
      return;
    }

    // Mock checkout - replace with actual API call
    setToastMessage(`Payment successful! Total: ₱${calculateTotal().toFixed(2)}`);
    setShowToast(true);
    setCart([]);
  };

  return (
    <IonPage>
      <EmployeeHeader title="Point of Sale" />
      <IonContent fullscreen className="ion-padding" style={{ '--background': '#F0F4F8' }}>
        <IonGrid>
          <IonRow>
            <IonCol size="12" sizeMd="7">
              {/* Product Selection */}
              <IonCard>
                <IonCardContent>
                  <h2 style={{ color: '#1B2E4B', fontWeight: 'bold', marginBottom: '16px' }}>
                    Select Products
                  </h2>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                    <IonSelect
                      placeholder="Choose a product"
                      value={selectedProduct}
                      onIonChange={(e) => setSelectedProduct(e.detail.value)}
                      style={{ flex: 1 }}
                    >
                      {products.map((product) => (
                        <IonSelectOption key={product.id} value={product.id}>
                          {product.name} - ₱{product.price} (Stock: {product.stock})
                        </IonSelectOption>
                      ))}
                    </IonSelect>
                    <IonButton onClick={addToCart} color="primary">
                      <IonIcon icon={addCircleOutline} slot="start" />
                      Add
                    </IonButton>
                  </div>

                  {/* Cart Items */}
                  <h3 style={{ color: '#1B2E4B', fontWeight: '600', marginBottom: '12px' }}>
                    Cart Items
                  </h3>
                  {cart.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#9BADB7' }}>
                      <IonIcon icon={cartOutline} style={{ fontSize: '64px', marginBottom: '16px' }} />
                      <p>No items in cart</p>
                    </div>
                  ) : (
                    <IonList>
                      {cart.map((item) => (
                        <IonItem key={item.id}>
                          <IonLabel>
                            <h3 style={{ fontWeight: '600', color: '#1B2E4B' }}>{item.name}</h3>
                            <p>₱{item.price} × {item.quantity}</p>
                          </IonLabel>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <IonButton
                              size="small"
                              fill="clear"
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              <IonIcon icon={removeCircleOutline} />
                            </IonButton>
                            <IonBadge color="primary">{item.quantity}</IonBadge>
                            <IonButton
                              size="small"
                              fill="clear"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              <IonIcon icon={addCircleOutline} />
                            </IonButton>
                            <IonButton
                              size="small"
                              fill="clear"
                              color="danger"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <IonIcon icon={trashOutline} />
                            </IonButton>
                          </div>
                        </IonItem>
                      ))}
                    </IonList>
                  )}
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="5">
              {/* Receipt Summary */}
              <IonCard>
                <IonCardContent>
                  <h2 style={{ color: '#1B2E4B', fontWeight: 'bold', marginBottom: '16px' }}>
                    Receipt Summary
                  </h2>
                  <div style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '12px', marginBottom: '12px' }}>
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}
                      >
                        <span style={{ color: '#9BADB7' }}>
                          {item.name} (×{item.quantity})
                        </span>
                        <span style={{ fontWeight: '600', color: '#1B2E4B' }}>
                          ₱{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      marginTop: '16px',
                      color: '#1B2E4B',
                    }}
                  >
                    <span>Total:</span>
                    <span>₱{calculateTotal().toFixed(2)}</span>
                  </div>
                  <IonButton expand="block" onClick={handleCheckout} style={{ marginTop: '20px' }}>
                    Complete Payment
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
        />
      </IonContent>
    </IonPage>
  );
};

export default POS;
