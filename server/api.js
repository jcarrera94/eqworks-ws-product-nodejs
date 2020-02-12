const express = require('express');
const pg = require('pg');
const rateLimit = require('./rateLimit');

const router = express.Router();

const pool = new pg.Pool();

const limiter = rateLimit({
  timeLimit: 60 * 1000,
  max: 10,
});

router.use(limiter)

const routes = () => {

  const queryHandler = (req, res, next) => {
    pool.query(req.sqlQuery).then((r) => {
      return res.json(r.rows || [])
    }).catch(next)
  }
  
  router.get('/events/hourly', (req, res, next) => {
    req.sqlQuery = `
      SELECT date, hour, events
      FROM public.hourly_events
      ORDER BY date, hour
      LIMIT 168;
    `
    return next()
  }, queryHandler)
  
  router.get('/events/daily', (req, res, next) => {
    req.sqlQuery = `
      SELECT date, SUM(events) AS events
      FROM public.hourly_events
      GROUP BY date
      ORDER BY date
      LIMIT 7;
    `
    return next()
  }, queryHandler)
  
  router.get('/stats/hourly', (req, res, next) => {
    req.sqlQuery = `
      SELECT date, hour, impressions, clicks, revenue
      FROM public.hourly_stats
      ORDER BY date, hour
      LIMIT 168;
    `
    return next()
  }, queryHandler)
  
  router.get('/stats/daily', (req, res, next) => {
    req.sqlQuery = `
      SELECT date,
          SUM(impressions) AS impressions,
          SUM(clicks) AS clicks,
          SUM(revenue) AS revenue
      FROM public.hourly_stats
      GROUP BY date
      ORDER BY date
      LIMIT 7;
    `
    return next()
  }, queryHandler)
  
  router.get('/poi', (req, res, next) => {
    req.sqlQuery = `
      SELECT *
      FROM public.poi;
    `
    return next()
  }, queryHandler)

  return router
}

module.exports = routes;


