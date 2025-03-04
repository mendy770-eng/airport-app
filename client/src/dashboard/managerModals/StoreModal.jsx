import { useState } from 'react';
import '../css/manager.css';
import fuelIcon from '../../assets/images/fuelPump.png';
import wingIcon from '../../assets/images/wing.png';
import wrenchIcon from '../../assets/images/wrench.png';
import WheelIcon from '../../assets/images/frontWheel.png'

const StoreModal = ({ showModal, setShowModal }) => {
    const [totalSum, setTotalSum] = useState(0);
    const [orderMessage, setOrderMessage] = useState('');
    
    const handleAddToCart = () => {
        setTotalSum(prev => prev + 10); // כל מוצר עולה 10$
        setOrderMessage(''); // מנקה הודעה קודמת
    };

    const handlePlaceOrder = () => {
        if (totalSum === 0) {
            setOrderMessage('No order placed');
            setTimeout(() => setOrderMessage(''), 3000);
            return;
        }
        setTotalSum(0);
        setOrderMessage('Order Accepted');
        setTimeout(() => setOrderMessage(''), 3000);
    };

    return (
        showModal && (
            <div className="modal-overlay">
                <div className="modal-content">
                    <button className="close-button" onClick={() => setShowModal(false)}>✕</button>
                    <h2 className="modal-title">Store Management</h2>
                    <div className="store-grid">
                        <div className="store-product">
                            <img src={fuelIcon} alt="fuel" className='store-product-icon'/>
                            <h3>Fuel 10$ per gallon</h3>
                            <div className='add-to-cart-button' onClick={handleAddToCart}>Add to cart</div>
                        </div>
                        <div className="store-product">
                            <img src={wingIcon} alt="wing" className='store-product-icon'/>
                            <h3>Wing 10$ per piece</h3>
                            <div className='add-to-cart-button' onClick={handleAddToCart}>Add to cart</div>
                        </div>
                        <div className="store-product">
                            <img src={wrenchIcon} alt="wrench" className='store-product-icon'/>
                            <h3>Wrench 10$ per piece</h3>
                            <div className='add-to-cart-button' onClick={handleAddToCart}>Add to cart</div>
                        </div>
                        <div className="store-product">
                            <img src={WheelIcon} alt="wheel" className='store-product-icon'/>
                            <h3>Wheel 10$ per piece</h3>
                            <div className='add-to-cart-button' onClick={handleAddToCart}>Add to cart</div>
                        </div>
                    </div>
                    <div className='sum-of-products-container'>
                        The sum of all the products: <span>{ totalSum }$</span>
                        {orderMessage && (
                            <div className={`order-message ${orderMessage === 'No order placed' ? 'error' : 'success'}`}>
                                {orderMessage}
                            </div>
                        )}
                    </div>
                    <div className="order-button" onClick={handlePlaceOrder}>place the order</div>
                </div>
            </div>
        )
    );
};

export default StoreModal;
