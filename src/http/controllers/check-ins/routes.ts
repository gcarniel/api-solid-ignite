import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { history } from './history'
import { metrics } from './metrics'
import { create } from './create'
import { validate } from './validate'

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/check-ins/history', history)
  app.get('/check-ins/metrics', metrics)

  app.post('/check-ins/:gymId/check-ins', create)

  app.put('/check-ins/:checkInId/validate', validate)
}
