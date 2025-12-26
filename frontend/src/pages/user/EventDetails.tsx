import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Share2,
  Heart,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Smartphone,
  Wallet
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalFooter } from '@/components/ui/Modal';
import eventsService, { Event } from '@/services/events.service';
import paymentService from '@/services/payment.service';
import { formatDate, formatCurrency } from '@/utils/format';
import { useAuth } from '@/hooks/useAuth';

export const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [tickets, setTickets] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'wallet'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      fetchEvent(id);
    }
  }, [id]);

  const fetchEvent = async (eventId: string) => {
    try {
      setLoading(true);
      const data = await eventsService.getEvent(eventId);
      setEvent(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = () => {
    if (!isAuthenticated) {
      navigate('/auth/login', { state: { from: `/events/${id}` } });
      return;
    }
    setBookingModalOpen(true);
  };

  const handlePayment = async () => {
    if (!event) return;
    
    setProcessingPayment(true);
    try {
      const totalAmount = (event.price || 0) * tickets;
      
      // 1. Create Payment Intent
      const intent = await paymentService.createPaymentIntent(totalAmount);
      
      // 2. Confirm Payment (Simulated)
      await paymentService.confirmPayment(intent.id);
      
      // 3. Create Booking
      await eventsService.bookEvent(event._id, tickets);
      
      setBookingSuccess(true);
      setBookingModalOpen(false);
      
      // Reset after showing success message
      setTimeout(() => {
        setBookingSuccess(false);
        navigate('/user/bookings');
      }, 3000);
      
    } catch (err: any) {
      alert('Payment failed: ' + err.message);
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Event not found</h2>
        <Button variant="ghost" onClick={() => navigate('/user/events')} className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Events
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate('/user/events')} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Events
      </Button>

      {/* Hero Section */}
      <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
        <img
          src={event.image || `https://via.placeholder.com/1200x600?text=${encodeURIComponent(event.title)}`}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <Badge className="bg-primary-500 hover:bg-primary-600 border-none text-white">
              {event.category}
            </Badge>
            <Badge variant={event.status === 'Scheduled' ? 'success' : 'secondary'}>
              {event.status}
            </Badge>
          </div>
          <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
          <div className="flex flex-wrap gap-6 text-gray-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {formatDate(event.date)}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {event.time}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              {event.location}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">About this Event</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            </CardContent>
          </Card>

          {/* Organizer Info (Mock) */}
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-500">
                {event.createdByName?.charAt(0) || 'O'}
              </div>
              <div>
                <p className="text-sm text-gray-500">Organized by</p>
                <p className="font-semibold text-gray-900">{event.createdByName || 'Event Organizer'}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="sticky top-24">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Price per ticket</span>
                <span className="text-2xl font-bold text-primary-600">
                  {event.price ? formatCurrency(event.price) : 'Free'}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Capacity</span>
                  </div>
                  <span>{event.capacity || 'Unlimited'} seats</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Available</span>
                  </div>
                  <span>{((event.capacity || 100) - (event.attendees || 0))} spots left</span>
                </div>
              </div>

              <Button 
                className="w-full" 
                size="lg"
                onClick={handleBookClick}
                disabled={event.status !== 'Scheduled'}
              >
                {event.status === 'Scheduled' ? 'Book Now' : 'Event Unavailable'}
              </Button>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Share2 className="w-4 h-4 mr-2" /> Share
                </Button>
                <Button variant="outline" className="flex-1">
                  <Heart className="w-4 h-4 mr-2" /> Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Booking Modal */}
      <Modal open={bookingModalOpen} onOpenChange={setBookingModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Book Tickets</ModalTitle>
          </ModalHeader>
          <div className="py-6 space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900">{event.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{formatDate(event.date)} • {event.time}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Tickets
              </label>
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setTickets(Math.max(1, tickets - 1))}
                  disabled={tickets <= 1}
                >
                  -
                </Button>
                <span className="text-xl font-semibold w-8 text-center">{tickets}</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setTickets(Math.min(10, tickets + 1))}
                  disabled={tickets >= 10}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 border-2 rounded-lg transition-all ${
                    paymentMethod === 'card'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs font-medium">Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 border-2 rounded-lg transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Smartphone className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs font-medium">UPI</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('wallet')}
                  className={`p-3 border-2 rounded-lg transition-all ${
                    paymentMethod === 'wallet'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Wallet className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs font-medium">Wallet</span>
                </button>
              </div>

              {/* Card Payment Form */}
              {paymentMethod === 'card' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                      maxLength={19}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, '');
                          if (value.length >= 2) {
                            value = value.slice(0, 2) + '/' + value.slice(2, 4);
                          }
                          setCardExpiry(value);
                        }}
                        maxLength={5}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                        maxLength={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* UPI Payment Form */}
              {paymentMethod === 'upi' && (
                <div>
                  <label className="block text-sm text-gray-600 mb-1">UPI ID</label>
                  <input
                    type="text"
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              )}

              {/* Wallet Payment */}
              {paymentMethod === 'wallet' && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    You will be redirected to your wallet provider to complete the payment.
                  </p>
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatCurrency((event.price || 0) * tickets)}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Service Fee</span>
                <span>{formatCurrency(0)}</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span className="text-primary-600">{formatCurrency((event.price || 0) * tickets)}</span>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 shrink-0" />
              <p className="text-sm text-blue-800">
                This is a secure payment simulation. No actual money will be deducted.
              </p>
            </div>
          </div>
          <ModalFooter>
            <Button variant="outline" onClick={() => setBookingModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handlePayment} 
              disabled={processingPayment}
              loading={processingPayment}
            >
              {processingPayment ? 'Processing...' : `Pay ${formatCurrency((event.price || 0) * tickets)}`}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Success Modal */}
      <Modal open={bookingSuccess} onOpenChange={setBookingSuccess}>
        <ModalContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-600">
              Your tickets for {event.title} have been booked successfully.
            </p>
            <p className="text-sm text-gray-500 mt-4">Redirecting to your bookings...</p>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
};
