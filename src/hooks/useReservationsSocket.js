import { useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WS_URL = 'http://localhost:8081/ws';

export function useReservationsSocket(onReservationUpdated, onReservationDeleted) {
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 3000
    });

    client.onConnect = () => {
      client.subscribe('/topic/reservations', (message) => {
        const data = JSON.parse(message.body);
        console.log('Received reservation update:', data);
        onReservationUpdated(data);
      });

      client.subscribe('/topic/reservations/deleted', (message) => {
        const deletedId = Number(message.body);
        console.log('Received reservation deletion:', deletedId);
        onReservationDeleted(deletedId);
      });
    };

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [onReservationUpdated, onReservationDeleted]);
}
