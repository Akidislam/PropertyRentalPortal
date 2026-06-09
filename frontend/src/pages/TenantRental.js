import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/api';
import { FaMapMarkerAlt, FaMoneyBillWave, FaUser, FaEnvelope, FaPhone, FaSearch, FaLock, FaBed, FaBath, FaRulerCombined } from 'react-icons/fa';
import '../styles/tenantrental.css';
import { useToast } from '../context/ToastContext';

const TenantRental = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('title'); // 'title' or 'owner'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const { showToast } = useToast();

  const fetchProperties = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/properties/approved`);
      setProperties(response.data);
      setFilteredProperties(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch properties');
      showToast('error', 'Failed to fetch properties');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const filtered = properties.filter(property => {
      const searchLower = searchTerm.toLowerCase();
      if (searchBy === 'title') {
        return property.title.toLowerCase().includes(searchLower);
      } else {
        return property.uploaderName.toLowerCase().includes(searchLower);
      }
    });
    setFilteredProperties(filtered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, searchBy, properties]);

  const handleRequestRent = (property) => {
    setSelectedProperty(property);
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phoneNumber || ''
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        throw new Error('Please login first');
      }

      const requestData = {
        propertyId: selectedProperty._id,
        propertyTitle: selectedProperty.title,
        propertyLocation: selectedProperty.location,
        propertyPrice: selectedProperty.price,
        propertyRentType: selectedProperty.rentType,
        propertyArea: selectedProperty.area,
        propertyRooms: selectedProperty.rooms,
        propertyBathrooms: selectedProperty.bathrooms,
        propertyType: selectedProperty.type,
        propertyAdvance: selectedProperty.advance,
        propertyDescription: selectedProperty.description,
        propertyAddress: selectedProperty.address,
        propertyPhone: selectedProperty.phone,
        propertyImages: selectedProperty.images,
        landlordEmail: selectedProperty.uploaderEmail,
        landlordName: selectedProperty.uploaderName,
        tenantName: formData.name,
        tenantEmail: formData.email,
        tenantPhone: formData.phone
      };

      await axios.post(`${BASE_URL}/api/rentalrequests/create`, requestData);

      showToast('success', 'Rental request submitted successfully!');
      setShowModal(false);
      setFormData({ name: '', email: '', phone: '' });
    } catch (err) {
      console.error('Error submitting rental request:', err);
      showToast('error', err.response?.data?.message || 'Failed to submit rental request');
    }
  };

  if (loading) return <div className="loading">Loading properties...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="tenant-rental-container">
      <h2>Available Properties</h2>

      <div className="search-section">
        <div className="search-container">
          <div className="search-type">
            <button
              className={`search-type-btn ${searchBy === 'title' ? 'active' : ''}`}
              onClick={() => setSearchBy('title')}
            >
              Search by Title
            </button>
            <button
              className={`search-type-btn ${searchBy === 'owner' ? 'active' : ''}`}
              onClick={() => setSearchBy('owner')}
            >
              Search by Owner
            </button>
          </div>
          <div className="search-input-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder={`Search by ${searchBy === 'title' ? 'property title' : 'owner name'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      <div className="properties-grid">
        {filteredProperties.map((property) => (
          <div key={property._id} className="property-card">
            <div className="property-image">
              {property.images && property.images.length > 0 ? (
                <img
                  src={`${BASE_URL}${property.images[0]}`}
                  alt={property.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                  }}
                />
              ) : (
                <img
                  src="https://via.placeholder.com/300x200?text=No+Image"
                  alt="No preview available"
                />
              )}
              {property.isRented && (
                <div className="rented-overlay">
                  <FaLock className="lock-icon" />
                  <span>Rented</span>
                </div>
              )}
            </div>

            <div className="property-content">
              <h3>{property.title}</h3>

              <div className="property-details">
                <div className="detail-item">
                  <FaMoneyBillWave className="icon" />
                  <span>৳{property.price}/month</span>
                </div>
                <div className="detail-item">
                  <FaMoneyBillWave className="icon" />
                  <span>Advance: ৳{property.advance}</span>
                </div>
                <div className="detail-item">
                  <FaMapMarkerAlt className="icon" />
                  <span>{property.location}</span>
                </div>
                <div className="detail-item">
                  <FaBed className="icon" />
                  <span>{property.rooms} Beds</span>
                </div>
                <div className="detail-item">
                  <FaBath className="icon" />
                  <span>{property.bathrooms} Baths</span>
                </div>
                <div className="detail-item">
                  <FaRulerCombined className="icon" />
                  <span>{property.area} sqft</span>
                </div>
              </div>

              <div className="landlord-details">
                <h4>Landlord Information</h4>
                <div className="detail-item">
                  <FaUser className="icon" />
                  <span>{property.uploaderName}</span>
                </div>
                <div className="detail-item">
                  <FaEnvelope className="icon" />
                  <span>{property.uploaderEmail}</span>
                </div>
                <div className="detail-item">
                  <FaPhone className="icon" />
                  <span>{property.phone}</span>
                </div>
              </div>

              {!property.isRented ? (
                <button
                  className="request-rent-btn"
                  onClick={() => handleRequestRent(property)}
                >
                  Request to Rent
                </button>
              ) : (
                <button
                  className="request-rent-btn disabled"
                  disabled
                >
                  Property Rented
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && selectedProperty && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Request to Rent</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="rental-form">
              <div className="form-group">
                <label>Your Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Your Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Your Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="submit-btn">Submit Request</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantRental;
