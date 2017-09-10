import Pusher from 'pusher-js/react-native';

Pusher.logToConsole = true;

var pusher = new Pusher('2912f2814f5e00f8b82d', {
    cluster: 'ap1',
    encrypted: true
});

var channel = pusher.subscribe('publicStock');
channel.bind('publicStockEvent', function(data) {
    console.log(data.message);
});

export default pusher;