// Import net module.
var net = require('net');

let people=[];

class Server {
    

    constructor(dbUrl) {
        this.dbUrl = dbUrl;
    }

    setShitUp() {
        console.log("inside of the setup function")
        // Create and return a net.Server object, the function will be invoked when client connect to this server.
        var server = net.createServer(function(client) {

            console.log('Client connect. Client local address : ' + client.localAddress + ':' + client.localPort + '. client remote address : ' + client.remoteAddress + ':' + client.remotePort);

            client.setEncoding('utf-8');

            client.setTimeout(1000);


            // When receive client data.
            client.on('data', function(data) {

                // Print received client data and length.
                console.log('Receive client send data : ' + data + ', data size : ' + client.bytesRead);

                // Server send data back to client use client net.Socket object.
                client.end('Server received data : ' + data + ', send back to client data size : ' + client.bytesWritten);

                var there=false;

                for(var i =0;i<people.length;i++)
                {
                    var comma =0;
                    var is_it_there=true;
                    while(people[i][comma]!=",")
                    {
                        if(people[i][comma]!=data[comma])
                        {
                            is_it_there=false;
                        }
                        comma++;
                        if(people[i][comma]==",")
                        {
                            if(is_it_there==true)
                            {
                                there=true;
                            }
                        }
                    }
                }
                if(there==false)
                {
                    people.push(data);
                }
            });

            // When client send data complete.
            client.on('end', function() {
                console.log('Client disconnect.');

                // Get current connections count.
                server.getConnections(function(err, count) {
                    if (!err) {
                        // Print current connection count in server console.
                        console.log("There are %d connections now. ", count);
                    } else {
                        console.error(JSON.stringify(err));
                    }

                });
            });

            // When client timeout.
            client.on('timeout', function() {
                console.log('Client request time out. ');
            })
        });



        // Make the server a TCP server listening on port 8080.
        server.listen(8080, '127.0.0.1', function() {

            // Get server address info.
            var serverInfo = server.address();

            var serverInfoJson = JSON.stringify(serverInfo);

            console.log('TCP server listen on address : ' + serverInfoJson);

            server.on('close', function() {
                console.log('TCP server socket is closed.');
            });

            server.on('error', function(error) {
                console.error(JSON.stringify(error));
            });

        });
    }

    retrieve(){
        console.log("Inside of the retrieve function")
        var now=people;
        people=[];
        return now;
    }
}
module.exports = Server;