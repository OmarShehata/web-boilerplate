import 'phaser';
import Loading from './scenes/Loading';
import Game from './scenes/Game';

var game = new Phaser.Game({
    type: Phaser.AUTO, // Choose WebGL or Canvas automatically
    parent: 'game', // The ID of the div in index.html
    width: 1120,
    height: 630,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    scene: [Loading, Game]
});