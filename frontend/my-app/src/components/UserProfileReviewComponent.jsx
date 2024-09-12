import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate ,useParams} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaStar } from 'react-icons/fa';

const BASE_URL = process.env.REACT_APP_BASE_URL;

function UserProfileReviewComponent ()  {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReviewSubmitted, setIsReviewSubmitted] = useState(false);
  const userToken = useSelector((state) => state.user.token.access);

  const handleReviewChange = (e) => {
    setNewReview(e.target.value);
  };

  const handleRatingChange = (rating) => {
    setNewRating(rating);
  };

  const handleSubmitReview = async () => {
    if (newReview.trim() === '') {
      setError('Review cannot be empty.');
      return;
    }

    if (newRating === 0) {
      setError('Rating cannot be zero.');
      return;
    }
    
    if (userToken) {
        setIsSubmitting(true);
      try {
        const response = await axios.post(
          `${BASE_URL}payments/add-review/${serviceId}/`, // Adjust API endpoint as needed
          { review: newReview, stars: newRating },
          {
            headers: {
              'Authorization': `Bearer ${userToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
        console.log('Review submitted:', response.data);
        setIsReviewSubmitted(true);
       setShowReviewForm(false); 
        setShowModal(false);
        navigate(`/userservicedetail/${serviceId}`);// Navigate to the service detail page or wherever needed
      } catch (error) {
        console.error('Error submitting review:', error);
        setError('Failed to submit review.');
      }finally {
        setIsSubmitting(false);
      }
    } else {
      navigate('/login'); // Redirect to login if not authenticated
    }
  };
  useEffect(() => {
    // Redirect to service detail after review submission
    if (isReviewSubmitted) {
      //navigate(`/userservicedetail/${serviceId}`);
    }
  }, [isReviewSubmitted, navigate, serviceId]);

  const handleBackToServiceDetails = () => {
    console.log('Attempting to navigate to service details');
    try {
      navigate(`/userservicedetail/${serviceId}`);
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback navigation method
      window.location.href = `/userservicedetail/${serviceId}`;
    }
  };

  if (!showReviewForm) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Thank you for your review!</h2>
        <p>Your feedback has been successfully submitted.</p>
        
      </div>
    );
  }
  return (
    <div className='flex mt-3 h-full'>
         {!isReviewSubmitted && showReviewForm && (
       <div className="w-full md:w-full p-8 bg-white shadow-md mt-10 mx-5">
    <h2 className="text-2xl bg-gradient-to-r from-fuchsia-800 via-blue-500 to-blue-500 bg-clip-text text-transparent font-bold mb-4 text-center">
      Add a Review
    </h2>
    <textarea
      value={newReview}
      onChange={handleReviewChange}
      rows="4"
      className="w-full p-2 border rounded"
      placeholder="Write your review here..."
    />
    <div className="mt-2">
      <label className="font-semibold">Rating:</label>
      <div className="ml-2 flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`cursor-pointer ${star <= newRating ? 'text-yellow-400' : 'text-gray-400'}`}
            onClick={() => handleRatingChange(star)}
            size={24}
          />
        ))}
      </div>
    </div>
    <button
      onClick={() => {
        setShowModal(true);
      }}
      className="mt-2 text-md font-bold text-white bg-green-800 rounded-full px-5 py-2 hover:bg-gray-800"
      type="button"
    >
      Submit Review
    </button>
    {error && <p className="text-red-500 mt-2">{error}</p>}
    
    {showModal && (
      <div className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="p-4 md:p-5 text-center">
              <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
              </svg>
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to submit this review?</h3>
              <button
                onClick={handleSubmitReview} disabled={isSubmitting}
                type="button"
                className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
              >
                  {isSubmitting ? 'Submitting...' : 'Yes, Submit'}
              </button>
              <button
                onClick={() => setShowModal(false)}
                type="button"
                className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                No, Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
  )}
  </div>
  )
}

export default UserProfileReviewComponent