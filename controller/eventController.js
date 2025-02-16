const event = require('../db/models/event');
const user = require('../db/models/user');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const createEvent = catchAsync(async (req, res, next) => {
    const body = req.body;
    const userId = req.user.id;
    
    const newEvent = await event.create({
        title: body.title,
        eventImage: body.eventImage,
        eventPrice: body.eventPrice,
        shortDesc: body.shortDesc,
        description: body.description,
        price: body.price,
        venue: body.venue,
        category: body.category,
        startDate: body.startDate,
        endDate: body.endDate,
        createdBy: userId,
    });

    return res.status(201).json({
        status: 'success',
        data: newEvent,
    });
});

const getAllEvents = catchAsync(async (req, res, next) => {
    const userId = req.user.id;

    if (req.user.role !== 'Admin') {
        return next(new AppError('Permission denied', 401))
    }
    console.log('here')
    const result = await event.findAll({
        include: user,
    });

    return res.json({
        status: 'success',
        data: result,
    });
});

const getCreatedEvents = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const result = await event.findAll({
        include: user,
        where: { createdBy: userId },
    });

    return res.json({
        status: 'success',
        data: result,
    });
});

const getEventById = catchAsync(async (req, res, next) => {
    const eventId = req.params.id;
    const result = await event.findByPk(eventId, { include: user });
    if (!result) {
        return next(new AppError('Invalid event id', 400));
    }
    return res.json({
        status: 'success',
        data: result,
    });
});

const updateEvent = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const eventId = req.params.id;
    const body = req.body;

    const result = await event.findOne({
        where: { id: eventId, createdBy: userId },
    });

    if (!result) {
        return next(new AppError('Invalid event id', 400));
    }

    result.title = body.title;
    result.eventImage = body.eventImage;
    result.eventPrice = body.eventPrice;
    result.shortDesc = body.shortDesc;
    result.description = body.description;
    result.category = body.category;

    
    const updatedResult = await result.save();

    return res.json({
        status: 'success',
        data: updatedResult,
    });
});

const deleteEvent = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const eventId = req.params.id;
    const body = req.body;

    const result = await event.findOne({
        where: { id: eventId, createdBy: userId },
    });

    if (!result) {
        return next(new AppError('Invalid event id', 400));
    }

    await result.destroy();

    return res.json({
        status: 'success',
        message: 'Record deleted successfully',
    });
});

module.exports = {
    createEvent,
    getAllEvents,
    getCreatedEvents,
    getEventById,
    updateEvent,
    deleteEvent,
};