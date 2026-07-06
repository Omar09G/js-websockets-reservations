# Frontend React - Reservas de Estacionamiento

## Stack
- React 18 + Vite
- Axios
- JWT decode
- STOMP + SockJS

## Ejecutar frontend
```bash
npm install
npm run dev
```

## Flujo
1. Login con JWT
2. CRUD de reservaciones
3. Actualizacion en tiempo real por WebSocket
4. Permisos por rol (ADMIN/USER)

## Notas
- API backend esperada en `http://localhost:8080`
- Zona horaria mostrada: `America/Mexico_City`
