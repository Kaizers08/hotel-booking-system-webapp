import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import DashboardHeader from '../components/DashboardHeader';
import './Dashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('rooms');
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEmails, setAdminEmails] = useState([]);


  // Form states
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [roomForm, setRoomForm] = useState({
    name: '',
    price: '',
    image: '',
    category: '',
    details: '',
    available: ''
  });
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  const checkAdminStatus = async () => {
    if (!user) {
      navigate('/');
      return;
    }

    try {
      const adminDoc = await getDocs(collection(db, 'admins'));
      const adminEmailsList = adminDoc.docs.map(doc => doc.data().email);
      const userIsAdmin = adminEmailsList.includes(user.email);

      if (userIsAdmin) {
        setIsAdmin(true);
        setAdminEmails(adminEmailsList);
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      navigate('/');
    }
  };

  const loadData = async () => {
    const maxRetries = 3;
    let retryCount = 0;

    const loadWithRetry = async () => {
      try {
        // Load rooms
        console.log('Loading rooms...');
        const roomsSnapshot = await getDocs(collection(db, 'rooms'));
        const roomsData = roomsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setRooms(roomsData);
        console.log('Rooms loaded:', roomsData.length);

        // Load bookings
        console.log('Loading bookings...');
        const bookingsSnapshot = await getDocs(collection(db, 'bookings'));
        const bookingsData = bookingsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBookings(bookingsData);
        console.log('Bookings loaded:', bookingsData.length);

        // Load users and create user map for bookings
        console.log('Loading users from Firestore...');
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('Users loaded:', usersData.length, 'users');
        console.log('User data sample:', usersData.slice(0, 3)); // Log first 3 users
        setUsers(usersData);

        // Create user map for quick lookup by UID
        const userLookupMap = {};
        usersData.forEach(user => {
          userLookupMap[user.uid] = user;
        });
        setUserMap(userLookupMap);

        console.log('All data loaded successfully');

      } catch (error) {
        console.error(`Error loading data (attempt ${retryCount + 1}/${maxRetries}):`, error);

        if (retryCount < maxRetries - 1) {
          retryCount++;
          console.log(`Retrying in 2 seconds... (${retryCount}/${maxRetries})`);
          setTimeout(loadWithRetry, 2000);
        } else {
          console.error('Max retries reached. Some data may not be loaded.');
          showNotification('⚠️ Some data could not be loaded due to network issues. Please refresh the page.', 'warning');
        }
      }
    };

    await loadWithRetry();
    setLoading(false);
  };

  const handleRoomSubmit = async (e) => {
    e.preventDefault();

    // Prevent submission if image is still uploading
    if (uploadingImage) {
      showNotification('Please wait for the image to finish uploading.', 'warning');
      return;
    }

    // Check if image is provided for new rooms
    if (!editingRoom && !roomForm.image) {
      showNotification('Please select and upload an image for the room.', 'warning');
      return;
    }

    try {
      const roomData = {
        ...roomForm,
        price: parseInt(roomForm.price),
        available: parseInt(roomForm.available)
      };

      if (editingRoom) {
        // Update existing room
        await updateDoc(doc(db, 'rooms', editingRoom.id), roomData);
        setRooms(rooms.map(room =>
          room.id === editingRoom.id ? { ...room, ...roomData } : room
        ));
        showNotification('✅ Room has been successfully updated!');
      } else {
        // Add new room
        const newRoomRef = doc(collection(db, 'rooms'));
        await setDoc(newRoomRef, roomData);
        setRooms([...rooms, { id: newRoomRef.id, ...roomData }]);
        showNotification('✅ New room has been successfully added!');
      }

      // Reset form
      setRoomForm({
        name: '',
        price: '',
        image: '',
        category: '',
        details: '',
        available: ''
      });
      setImagePreview('');
      setShowAddRoom(false);
      setEditingRoom(null);

    } catch (error) {
      console.error('Error saving room:', error);
      showNotification(`❌ Error saving room: ${error.message}`, 'error');
    }
  };

  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setRoomForm({
      name: room.name,
      price: room.price.toString(),
      image: room.image,
      category: room.category,
      details: room.details,
      available: room.available.toString()
    });
    setShowAddRoom(true);
  };

  const handleDeleteRoom = async (roomId) => {
    if (window.confirm('⚠️ Are you sure you want to delete this room? This action cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'rooms', roomId));
        setRooms(rooms.filter(room => room.id !== roomId));
        showNotification('✅ Room has been successfully deleted!');
      } catch (error) {
        console.error('Error deleting room:', error);
        showNotification('❌ Error: Failed to delete room. Please try again.', 'error');
      }
    }
  };

  const handleCancelEdit = () => {
    setShowAddRoom(false);
    setEditingRoom(null);
    setRoomForm({
      name: '',
      price: '',
      image: '',
      category: '',
      details: '',
      available: ''
    });
    setImagePreview('');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        showNotification('File size too large. Please select an image under 10MB.', 'warning');
        return;
      }

      setUploadingImage(true);
      try {
        console.log('Starting upload for file:', file.name, 'Size:', (file.size / 1024 / 1024).toFixed(2), 'MB');

        // For now, use local preview only - Firebase Storage needs billing setup
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target.result);
          setRoomForm({...roomForm, image: e.target.result});
          showNotification('Image selected! (Note: Firebase Storage requires billing setup to save permanently)', 'info');
        };
        reader.readAsDataURL(file);

        console.log('Using local preview - Firebase Storage not configured yet');

      } catch (error) {
        console.error('Error processing image:', error);
        showNotification(`Error: ${error.message}`, 'error');
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const handleViewReceipt = (imageData) => {
    setModalImage(imageData);
    setShowImageModal(true);
  };

  const handleCloseImageModal = () => {
    setShowImageModal(false);
    setModalImage('');
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000); // Auto-hide after 4 seconds
  };

  const hideNotification = () => {
    setNotification(null);
  };

  const handleMarkBookingDone = async (bookingId) => {
    if (window.confirm('Are you sure you want to mark this booking as completed?')) {
      try {
        await updateDoc(doc(db, 'bookings', bookingId), {
          action: 'completed',
          completedAt: new Date()
        });
        // Update local state
        setBookings(bookings.map(booking =>
          booking.id === bookingId
            ? { ...booking, action: 'completed', completedAt: new Date() }
            : booking
        ));
        showNotification('✅ Booking has been successfully marked as completed!');
      } catch (error) {
        console.error('Error updating booking:', error);
        showNotification('❌ Error: Failed to update booking status. Please try again.', 'error');
      }
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm('⚠️ Are you sure you want to delete this booking? This action cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'bookings', bookingId));
        setBookings(bookings.filter(booking => booking.id !== bookingId));
        showNotification('✅ Booking has been successfully deleted!');
      } catch (error) {
        console.error('Error deleting booking:', error);
        showNotification('❌ Error: Failed to delete booking. Please try again.', 'error');
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('⚠️ Are you sure you want to delete this user? This action cannot be undone and will also delete all their bookings.')) {
      try {
        console.log('Starting user deletion for userId:', userId);

        // Find the user to get their Firebase Auth UID
        const userToDelete = users.find(user => user.id === userId);
        console.log('User to delete:', userToDelete);

        if (!userToDelete) {
          throw new Error('User not found in local state');
        }

        const firebaseUid = userToDelete.uid;
        console.log('Firebase UID:', firebaseUid);

        // Delete user document from Firestore
        console.log('Deleting user document:', userId);
        await deleteDoc(doc(db, 'users', userId));
        console.log('User document deleted successfully');

        // Also delete all bookings associated with this user (using Firebase Auth UID)
        const userBookings = bookings.filter(booking => booking.userId === firebaseUid);
        console.log('Found', userBookings.length, 'bookings to delete');

        for (const booking of userBookings) {
          console.log('Deleting booking:', booking.id);
          await deleteDoc(doc(db, 'bookings', booking.id));
        }
        console.log('All bookings deleted successfully');

        // Update local state
        setUsers(users.filter(user => user.id !== userId));
        setBookings(bookings.filter(booking => booking.userId !== firebaseUid));

        showNotification('✅ User and their bookings have been successfully deleted!');
      } catch (error) {
        console.error('Error deleting user:', error);
        console.error('Error details:', error.message, error.code, error);
        showNotification(`❌ Error: ${error.message}`, 'error');
      }
    }
  };

  // Function to format time from 24-hour to 12-hour format
  const formatTime12Hour = (timeString) => {
    if (!timeString) return 'N/A';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };







  if (!isAdmin) {
    return <div>Checking permissions...</div>;
  }

  if (loading) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h2>Loading admin dashboard...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <DashboardHeader />
      <div className="dashboard-body">
        {/* Custom Notification */}
        {notification && (
          <div
            style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              backgroundColor: notification.type === 'success' ? '#28a745' :
                              notification.type === 'error' ? '#dc3545' :
                              notification.type === 'warning' ? '#ffc107' : '#17a2b8',
              color: notification.type === 'warning' ? '#000' : '#fff',
              padding: '15px 20px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              zIndex: 1000,
              maxWidth: '400px',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              animation: 'slideInRight 0.3s ease-out'
            }}
          >
            <span>{notification.message}</span>
            <button
              onClick={hideNotification}
              style={{
                background: 'none',
                border: 'none',
                color: notification.type === 'warning' ? '#000' : '#fff',
                fontSize: '18px',
                cursor: 'pointer',
                marginLeft: '10px',
                padding: '0',
                lineHeight: '1'
              }}
            >
              ×
            </button>
          </div>
        )}

        <div style={{ flex: 1, overflowY: 'auto', padding: '15px' }}>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          marginBottom: '30px',
          borderBottom: '1px solid #e9ecef',
          paddingBottom: '20px'
        }}>
          <button
            className={`filter-btn ${activeTab === 'rooms' ? 'active' : ''}`}
            onClick={() => setActiveTab('rooms')}
          >
            Room Management
          </button>

          <button
            className={`filter-btn ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            Bookings ({bookings.length})
          </button>
          <button
            className={`filter-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users ({users.length})
          </button>
        </div>



        {/* Room Management Tab */}
        {activeTab === 'rooms' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3>Room Management</h3>
              <button
                className="payment-continue-btn"
                onClick={() => setShowAddRoom(true)}
                style={{ padding: '10px 20px' }}
              >
                + Add Room
              </button>
            </div>

            {/* Add/Edit Room Form */}
            {showAddRoom && (
              <div style={{
                background: '#f8f9fa',
                padding: '20px',
                borderRadius: '10px',
                marginBottom: '20px'
              }}>
                <h4>{editingRoom ? 'Edit Room' : 'Add New Room'}</h4>
                <form onSubmit={handleRoomSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontFamily: 'Montserrat, sans-serif !important', fontSize: '14px', fontWeight: '500', color: '#333' }}>Room Name</label>
                      <input
                        type="text"
                        value={roomForm.name}
                        onChange={(e) => setRoomForm({...roomForm, name: e.target.value})}
                        required
                        style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', fontFamily: 'Montserrat, sans-serif !important', fontSize: '14px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontFamily: 'Montserrat, sans-serif !important', fontSize: '14px', fontWeight: '500', color: '#333' }}>Price (₱)</label>
                      <input
                        type="number"
                        value={roomForm.price}
                        onChange={(e) => setRoomForm({...roomForm, price: e.target.value})}
                        required
                        style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', fontFamily: 'Montserrat, sans-serif !important', fontSize: '14px' }}
                      />
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontFamily: 'Montserrat, sans-serif !important', fontSize: '14px', fontWeight: '500', color: '#333' }}>
                        Room Image {uploadingImage && <span style={{ color: '#007bff', fontSize: '12px' }}>(Uploading...)</span>}
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        style={{
                          width: '100%',
                          padding: '8px',
                          borderRadius: '5px',
                          border: '1px solid #ccc',
                          fontFamily: 'Montserrat, sans-serif !important',
                          fontSize: '14px',
                          opacity: uploadingImage ? 0.6 : 1
                        }}
                      />
                      {uploadingImage && (
                        <div style={{ marginTop: '10px', textAlign: 'center', color: '#007bff' }}>
                          <div>Uploading image...</div>
                          <div style={{ fontSize: '12px', color: '#666' }}>Please wait</div>
                        </div>
                      )}
                      {imagePreview && !uploadingImage && (
                        <div style={{ marginTop: '10px', textAlign: 'center' }}>
                          <img
                            src={imagePreview}
                            alt="Room preview"
                            style={{
                              maxWidth: '200px',
                              maxHeight: '150px',
                              border: '1px solid #ddd',
                              borderRadius: '5px',
                              objectFit: 'cover'
                            }}
                          />
                        </div>
                      )}
                      {editingRoom && roomForm.image && !imagePreview && !uploadingImage && (
                        <div style={{ marginTop: '10px', textAlign: 'center' }}>
                          <img
                            src={roomForm.image}
                            alt="Current room image"
                            style={{
                              maxWidth: '200px',
                              maxHeight: '150px',
                              border: '1px solid #ddd',
                              borderRadius: '5px',
                              objectFit: 'cover'
                            }}
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontFamily: 'Montserrat, sans-serif !important', fontSize: '14px', fontWeight: '500', color: '#333' }}>Category</label>
                      <select
                        value={roomForm.category}
                        onChange={(e) => setRoomForm({...roomForm, category: e.target.value})}
                        required
                        style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', fontFamily: 'Montserrat, sans-serif !important', fontSize: '14px' }}
                      >
                        <option value="">Select Category</option>
                        <option value="Silver Tier">Silver Tier</option>
                        <option value="Gold Tier">Gold Tier</option>
                        <option value="Penthouse">Penthouse</option>
                        <option value="Beach">Beach</option>
                        <option value="Romance">Romance</option>
                        <option value="Family">Family</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontFamily: 'Montserrat, sans-serif !important', fontSize: '14px', fontWeight: '500', color: '#333' }}>Available Rooms</label>
                      <input
                        type="number"
                        value={roomForm.available}
                        onChange={(e) => setRoomForm({...roomForm, available: e.target.value})}
                        required
                        style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', fontFamily: 'Montserrat, sans-serif !important', fontSize: '14px' }}
                      />
                    </div>
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontFamily: 'Montserrat, sans-serif !important', fontSize: '14px', fontWeight: '500', color: '#333' }}>Description</label>
                    <textarea
                      value={roomForm.details}
                      onChange={(e) => setRoomForm({...roomForm, details: e.target.value})}
                      required
                      rows="3"
                      style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', fontFamily: 'Montserrat, sans-serif !important', fontSize: '14px' }}
                    />
                  </div>
                  <div>
                    <button type="submit" className="payment-continue-btn" style={{ marginRight: '10px' }}>
                      {editingRoom ? 'Update Room' : 'Add Room'}
                    </button>
                    <button type="button" className="payment-cancel-btn" onClick={handleCancelEdit}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Rooms Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                background: 'white',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}>
                <thead>
                  <tr style={{ background: 'linear-gradient(90deg, #FFCA1A 13.45%, #B3941E 52.7%, #907904 90.08%)', color: 'black' }}>
                    <th style={{
                      padding: '15px',
                      textAlign: 'left',
                      fontFamily: 'Montserrat, sans-serif',
                      fontSize: '16px',
                      fontWeight: '700',
                      color: 'black !important'
                    }}>Name</th>
                    <th style={{
                      padding: '15px',
                      textAlign: 'left',
                      fontFamily: 'Montserrat, sans-serif',
                      fontSize: '16px',
                      fontWeight: '700',
                      color: 'black !important'
                    }}>Category</th>
                    <th style={{
                      padding: '15px',
                      textAlign: 'left',
                      fontFamily: 'Montserrat, sans-serif',
                      fontSize: '16px',
                      fontWeight: '700',
                      color: 'black !important'
                    }}>Price</th>
                    <th style={{
                      padding: '15px',
                      textAlign: 'left',
                      fontFamily: 'Montserrat, sans-serif',
                      fontSize: '16px',
                      fontWeight: '700',
                      color: 'black !important'
                    }}>Available</th>
                    <th style={{
                      padding: '15px',
                      textAlign: 'center',
                      fontFamily: 'Montserrat, sans-serif',
                      fontSize: '16px',
                      fontWeight: '700',
                      color: 'black !important'
                    }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room) => (
                    <tr key={room.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                      <td style={{
                        padding: '15px',
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: '14px',
                        color: '#333'
                      }}>{room.name}</td>
                      <td style={{
                        padding: '15px',
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: '14px',
                        color: '#333'
                      }}>{room.category}</td>
                      <td style={{
                        padding: '15px',
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: '14px',
                        color: '#333'
                      }}>₱{room.price.toLocaleString()}</td>
                      <td style={{
                        padding: '15px',
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: '14px',
                        color: '#333'
                      }}>{room.available}</td>
                      <td style={{ padding: '15px', textAlign: 'center' }}>
                        <button
                          onClick={() => handleEditRoom(room)}
                          style={{
                            background: '#FFCA1A',
                            color: 'black',
                            border: 'none',
                            padding: '5px 10px',
                            borderRadius: '5px',
                            marginRight: '5px',
                            cursor: 'pointer',
                            fontFamily: 'Montserrat, sans-serif',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteRoom(room.id)}
                          style={{
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            padding: '5px 10px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontFamily: 'Montserrat, sans-serif',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div>
            <h3>Booking Management</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                background: 'white',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}>
                <thead>
                  <tr style={{ background: 'linear-gradient(90deg, #FFCA1A 13.45%, #B3941E 52.7%, #907904 90.08%)', color: 'black' }}>
                    <th style={{ padding: '15px', textAlign: 'left', fontFamily: 'Montserrat, sans-serif !important', fontSize: '16px', fontWeight: '700' }}>Room</th>
                    <th style={{ padding: '15px', textAlign: 'left', fontFamily: 'Montserrat, sans-serif !important', fontSize: '16px', fontWeight: '700' }}>User</th>
                    <th style={{ padding: '15px', textAlign: 'left', fontFamily: 'Montserrat, sans-serif !important', fontSize: '16px', fontWeight: '700' }}>Sender Name</th>
                    <th style={{ padding: '15px', textAlign: 'left', fontFamily: 'Montserrat, sans-serif !important', fontSize: '16px', fontWeight: '700' }}>Check-in</th>
                    <th style={{ padding: '15px', textAlign: 'left', fontFamily: 'Montserrat, sans-serif !important', fontSize: '16px', fontWeight: '700' }}>Status</th>
                    <th style={{ padding: '15px', textAlign: 'left', fontFamily: 'Montserrat, sans-serif !important', fontSize: '16px', fontWeight: '700' }}>Total</th>
                    <th style={{ padding: '15px', textAlign: 'left', fontFamily: 'Montserrat, sans-serif !important', fontSize: '16px', fontWeight: '700' }}>Receipt</th>
                    <th style={{ padding: '15px', textAlign: 'center', fontFamily: 'Montserrat, sans-serif !important', fontSize: '16px', fontWeight: '700' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                      <td style={{
                        padding: '15px',
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: '14px',
                        color: '#333'
                      }}>{booking.room?.name || 'N/A'}</td>
                      <td style={{
                        padding: '15px',
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: '14px',
                        color: '#333'
                      }}>{booking.userEmail || userMap[booking.userId]?.email || 'Unknown User'}</td>
                      <td style={{
                        padding: '15px',
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: '14px',
                        color: '#333'
                      }}>{booking.senderName || 'N/A'}</td>
                      <td style={{
                        padding: '15px',
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: '14px',
                        color: '#333'
                      }}>
                        {booking.checkInDate ? (
                          <div>
                            <div>{booking.checkInDate}</div>
                            <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                              {formatTime12Hour(booking.checkInTime)}
                            </div>
                          </div>
                        ) : 'N/A'}
                      </td>
                      <td style={{
                        padding: '15px',
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: '14px',
                        color: '#333'
                      }}>{booking.action || 'booked'}</td>
                      <td style={{
                        padding: '15px',
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: '14px',
                        color: '#333'
                      }}>₱{booking.total?.toLocaleString() || 'N/A'}</td>
                      <td style={{
                        padding: '15px',
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: '14px',
                        color: '#333'
                      }}>
                        {booking.transferProof ? (
                          <div>
                            <div style={{ fontWeight: '600', marginBottom: '5px' }}>
                              {booking.transferProof.name}
                            </div>
                            <div style={{ fontSize: '12px', color: '#666' }}>
                              {(booking.transferProof.size / 1024).toFixed(1)} KB
                            </div>
                            {booking.transferProof.data && (
                              <img
                                src={booking.transferProof.data}
                                alt="Receipt"
                                style={{
                                  maxWidth: '100px',
                                  maxHeight: '60px',
                                  marginTop: '5px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  cursor: 'pointer'
                                }}
                                onClick={() => handleViewReceipt(booking.transferProof.data)}
                                title="Click to view full size"
                              />
                            )}
                          </div>
                        ) : (
                          <span style={{ color: '#999', fontStyle: 'italic' }}>No receipt</span>
                        )}
                      </td>
                      <td style={{ padding: '15px', textAlign: 'center' }}>
                        <button
                          onClick={() => handleMarkBookingDone(booking.id)}
                          style={{
                            background: '#28a745',
                            color: 'white',
                            border: 'none',
                            padding: '5px 10px',
                            borderRadius: '5px',
                            marginRight: '5px',
                            cursor: 'pointer',
                            fontFamily: 'Montserrat, sans-serif',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}
                        >
                          Done
                        </button>
                        <button
                          onClick={() => handleDeleteBooking(booking.id)}
                          style={{
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            padding: '5px 10px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontFamily: 'Montserrat, sans-serif',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <h3>User Management</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                background: 'white',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}>
                <thead>
                  <tr style={{ background: 'linear-gradient(90deg, #FFCA1A 13.45%, #B3941E 52.7%, #907904 90.08%)', color: 'black' }}>
                    <th style={{ padding: '15px', textAlign: 'left', fontFamily: 'Montserrat, sans-serif !important', fontSize: '16px', fontWeight: '700' }}>Email</th>
                    <th style={{ padding: '15px', textAlign: 'left', fontFamily: 'Montserrat, sans-serif !important', fontSize: '16px', fontWeight: '700' }}>Name</th>
                    <th style={{ padding: '15px', textAlign: 'left', fontFamily: 'Montserrat, sans-serif !important', fontSize: '16px', fontWeight: '700' }}>Registration Date</th>
                    <th style={{ padding: '15px', textAlign: 'center', fontFamily: 'Montserrat, sans-serif !important', fontSize: '16px', fontWeight: '700' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                      <td style={{
                        padding: '15px',
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: '14px',
                        color: '#333'
                      }}>{user.email}</td>
                      <td style={{
                        padding: '15px',
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: '14px',
                        color: '#333'
                      }}>{user.displayName || 'N/A'}</td>
                      <td style={{
                        padding: '15px',
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: '14px',
                        color: '#333'
                      }}>{user.createdAt?.toDate()?.toLocaleDateString() || 'N/A'}</td>
                      <td style={{ padding: '15px', textAlign: 'center' }}>
                        {adminEmails.includes(user.email) ? (
                          <span style={{
                            color: '#666',
                            fontFamily: 'Montserrat, sans-serif',
                            fontSize: '12px',
                            fontStyle: 'italic'
                          }}>
                            Admin
                          </span>
                        ) : (
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            style={{
                              background: '#dc3545',
                              color: 'white',
                              border: 'none',
                              padding: '5px 10px',
                              borderRadius: '5px',
                              cursor: 'pointer',
                              fontFamily: 'Montserrat, sans-serif',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Image Modal */}
        {showImageModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              paddingTop: '50px',
              zIndex: 1000,
              cursor: 'pointer'
            }}
            //payment
            onClick={handleCloseImageModal}
          >
            <div
              style={{
                maxWidth: '20%',
                maxHeight: '20%',
                position: 'relative'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={modalImage}
                alt="Receipt"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                  objectFit: 'contain'
                }}
              />
              <button
                onClick={handleCloseImageModal}
                style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '-10px',
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
