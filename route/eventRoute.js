const { 
  createEvent,
  getAllEvents,
  getCreatedEvents,
  getEventById,
  updateEvent,
  deleteEvent, } = require('../controller/eventController');


const { authentication, restrictTo } = require('../controller/authController');

const router = require('express').Router();

router.route('/')
  .post(authentication, restrictTo(['Admin', 'Organizer']), createEvent)
  .get(authentication, restrictTo('Admin'), getAllEvents)
  .get(authentication, restrictTo(['Admin', 'Organizer']), getCreatedEvents);

router.route('/:id')
  .get(authentication, restrictTo(['Admin', 'Organizer']), getEventById)
  .patch(authentication, restrictTo(['Admin', 'Organizer']), updateEvent)
  .delete(authentication, restrictTo(['Admin', 'Organizer']), deleteEvent);

module.exports = router;