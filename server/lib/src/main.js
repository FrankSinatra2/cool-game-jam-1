
import * as http from 'http';
import * as SocketIo from 'socket.io';

const startingPositions = [
  [0, 0],
  [0, 50],
  [-50, 50],
  [-50, 0]
];

const startingColors = [
  'yellow',
  'green',
  'black',
  'white',
  'purple',
  'cyan'
];

const clients = [];

const generateId = () => {
  return Math.floor(Math.random() * 10000);
};

const main = () => {

  const port = process.env.PORT || 3030;

  const server = http.createServer();
  const io = new SocketIo.Server(server, {
    cors: {
      origin: '*'
    }
  });


  server.listen(port, () => {
    console.log(`hello, listening on port ${port}`);
  });

  io.on('connection', (socket) => {

    socket.on('disconnect', () => {
      const toRemove = clients.find(x => x.socket.id === socket.id);
      clients.splice(clients.indexOf(toRemove), 1);
    
      for (const client of clients) {
        client.socket.emit('player.disconnected', { id: client.id });
      }
    });

    socket.on('player.fire', (data) => {
      for (const client of clients) {
        if (client.id === data.id) {
          continue;
        }

        client.socket.emit('player.fire', data); // { position: data.position, direction: data.direction, id: data.id });
      }
    });

    socket.on('entity.died', (data) => {
      for (const client of clients) {
        client.socket.emit('player.disconnected', { id: data.id });
      }
    });

    socket.on('player.position', (data) => {
      for (const client of clients) {
        if (client.id === data.id) {
          continue;
        }

        client.socket.emit('player.position', { position: data.position, id: data.id});
      }
    });

    socket.on('player.stats', (data) => {
      for (const client of clients) {
        if (client.id === data.id) {
          continue;
        }

        client.socket.emit('player.stats', data);
      }
    });

    if (startingPositions.length) {
      const id = generateId();
      const color = startingColors[Math.floor(Math.random() * (startingColors.length-1))];
      const client = createClient(socket, startingPositions[Math.floor(Math.random() * 3)], color, id);
      socket.emit('spawn.player', { position:  client.position, id: id, color: client.color });
      
      for (const other of clients) {
        other.socket.emit('player.spawned', { position: client.position, id: client.id, color: client.color });
        client.socket.emit('player.spawned', { position: other.position, id: other.id, color: other.color });
      }

      clients.push(client);
    }
  });

};

const createClient = (socket, position, color, id) => {
  return {
    socket: socket,
    position: position,
    color: color,
    id: id
  };
};



main();
