import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Grid,
  List,
  Calendar,
  MapPin,
  Ticket,
  Star,
  Users,
  Clock,
  TrendingUp,
  Heart,
  Share2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton';
import { ShareButton } from '@/components/ui/ShareButton';
import eventsService, { Event } from '@/services/events.service';
import { formatDate, formatCurrency } from '@/utils/format';
import { cn } from '@/utils/cn';

const categories = [
  'All',
  'Technology',
  'Business',
  'Music',
  'Sports',
  'Arts',
  'Education',
  'Health',
  'Food',
];

export const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'popular'>('date');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [comparison, setComparison] = useState<Set<string>>(new Set());
  const [aiRecommendations, setAiRecommendations] = useState<Event[]>([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterAndSortEvents();
  }, [events, searchQuery, selectedCategory, sortBy]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await eventsService.getEvents({ status: 'Scheduled' });
      setEvents(data);
      // AI recommendations - mock for now, top 3 featured
      setAiRecommendations(data.filter(e => e.isFeatured).slice(0, 3));
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortEvents = () => {
    let filtered = events;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (e) =>
          e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((e) => e.category === selectedCategory);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortBy === 'price') {
        return (a.price || 0) - (b.price || 0);
      } else if (sortBy === 'popular') {
        return b.attendees - a.attendees;
      }
      return 0;
    });

    setFilteredEvents(filtered);
  };

  const toggleFavorite = (eventId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(eventId)) {
      newFavorites.delete(eventId);
    } else {
      newFavorites.add(eventId);
    }
    setFavorites(newFavorites);
  };

  const toggleComparison = (eventId: string) => {
    const newComparison = new Set(comparison);
    if (newComparison.has(eventId)) {
      newComparison.delete(eventId);
    } else if (newComparison.size < 3) {
      newComparison.add(eventId);
    } else {
      alert('You can compare up to 3 events at a time');
    }
    setComparison(newComparison);
  };

  const EventCard: React.FC<{ event: Event; index: number }> = ({ event, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
        <div className="relative h-48 bg-gradient-to-br from-primary-100 to-secondary-100">
          {event.image ? (
            <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Calendar className="w-16 h-16 text-primary-600 opacity-50" />
            </div>
          )}
          {event.isFeatured && (
            <div className="absolute top-3 left-3">
              <Badge variant="default" className="bg-yellow-500 text-white">
                <Star className="w-3 h-3 mr-1 fill-white" />
                Featured
              </Badge>
            </div>
          )}
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={() => toggleFavorite(event._id)}
              className="p-2 bg-white/90 backdrop-blur rounded-full hover:bg-white transition-colors"
            >
              <Heart
                className={cn(
                  'w-4 h-4',
                  favorites.has(event._id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
                )}
              />
            </button>
            <ShareButton
              url={`${window.location.origin}/user/events/${event._id}`}
              title={event.title}
              description={event.description}
              variant="icon"
              className="bg-white/90 backdrop-blur hover:bg-white"
            />
          </div>
        </div>
        <CardContent className="p-6">
          <div className="mb-4">
            <Badge variant="outline" className="mb-3">
              {event.category}
            </Badge>
            <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
              {event.title}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2">{event.description}</p>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              {formatDate(event.date)} • {event.time}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              {event.location}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              {event.attendees} / {event.capacity || 'Unlimited'} attendees
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-600">Starting from</p>
              <p className="text-2xl font-bold text-gray-900">
                {event.price ? formatCurrency(event.price) : 'Free'}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleComparison(event._id)}
                className={cn(comparison.has(event._id) && 'border-primary-600 text-primary-600')}
              >
                Compare
              </Button>
              <Link to={`/user/events/${event._id}`}>
                <Button size="sm">
                  Details
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const EventListItem: React.FC<{ event: Event; index: number }> = ({ event, index }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex gap-6">
            <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-primary-100 to-secondary-100">
              {event.image ? (
                <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Calendar className="w-12 h-12 text-primary-600 opacity-50" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{event.category}</Badge>
                    {event.isFeatured && (
                      <Badge variant="default" className="bg-yellow-500">
                        <Star className="w-3 h-3 mr-1 fill-white" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{event.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleFavorite(event._id)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <Heart
                      className={cn(
                        'w-5 h-5',
                        favorites.has(event._id) ? 'fill-red-500 text-red-500' : 'text-gray-400'
                      )}
                    />
                  </button>
                  <ShareButton
                    url={`${window.location.origin}/user/events/${event._id}`}
                    title={event.title}
                    description={event.description}
                    variant="icon"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  {formatDate(event.date)}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  {event.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  {event.attendees} attendees
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-600">Price</p>
                  <p className="text-xl font-bold text-gray-900">
                    {event.price ? formatCurrency(event.price) : 'Free'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleComparison(event._id)}
                    className={cn(comparison.has(event._id) && 'border-primary-600 text-primary-600')}
                  >
                    Compare
                  </Button>
                  <Link to={`/user/events/${event._id}`}>
                    <Button size="sm">
                      View Details
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-8 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">Discover Events</h1>
        <p className="text-white/90">Find and book amazing events near you</p>
      </motion.div>

      {/* AI Recommendations */}
      {aiRecommendations.length > 0 && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              AI Recommended For You
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {aiRecommendations.map((event, index) => (
                <Link key={event._id} to={`/user/events/${event._id}`}>
                  <div className="p-4 bg-white rounded-lg hover:shadow-md transition-shadow">
                    <h4 className="font-semibold text-gray-900 mb-2">{event.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{event.category}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{formatDate(event.date)}</span>
                      <span className="font-bold text-primary-600">
                        {event.price ? formatCurrency(event.price) : 'Free'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Tabs */}
      <div className="overflow-x-auto">
        <div className="flex gap-2 pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                'px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap',
                selectedCategory === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events by name, description, or location..."
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="date">Sort by Date</option>
                <option value="price">Sort by Price</option>
                <option value="popular">Most Popular</option>
              </select>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'px-3 py-2 transition-colors',
                    viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                  )}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'px-3 py-2 transition-colors',
                    viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                  )}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Bar */}
      {comparison.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40"
        >
          <Card className="shadow-2xl">
            <CardContent className="p-4 flex items-center gap-4">
              <span className="font-medium">
                Comparing {comparison.size} event{comparison.size > 1 ? 's' : ''}
              </span>
              <Button size="sm" onClick={() => alert('Comparison feature - coming soon!')}>
                View Comparison
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setComparison(new Set())}>
                Clear
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Events Grid/List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || selectedCategory !== 'All'
                ? 'Try adjusting your search or filters'
                : 'No events available at the moment'}
            </p>
            <Button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event, index) => (
            <EventCard key={event._id} event={event} index={index} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEvents.map((event, index) => (
            <EventListItem key={event._id} event={event} index={index} />
          ))}
        </div>
      )}

      {/* Load More */}
      {!loading && filteredEvents.length > 0 && filteredEvents.length % 9 === 0 && (
        <div className="flex justify-center">
          <Button variant="outline" size="lg">
            Load More Events
          </Button>
        </div>
      )}
    </div>
  );
};
