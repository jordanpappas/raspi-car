# raspi-car
100% javascript Rasberry Pi / IoT control server with websockets. Wifi Car example included.

# About
A good example of how to properly use socket.io with node cluster and redis, as well as how to control an embedded project remotely. Mobile projects have changing ip's and its best to have some home base to phone. An example server is hosted at http://picontrol2.herokuapp.com

# Requirements
You need to use redis and the socket.io redis adapter in order to use the server with cluster.

You also must specify websockets only but passing in {transports:'websocket'} as a connection option on the server and all clients.
