var config = {
    title: 'Puzzle Tower',
    autoFocus: true,
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: 'rgba(200, 200, 200, 0.5)',
    scale : {
        autoCenter: Phaser.Scale.Center.CENTER_BOTH,
        mode: Phaser.Scale.ScaleModes.FIT
    }
}

var game = new Phaser.Game(config);

game.scene.add('MainMenu', MainMenu, true);
game.scene.add('PuzzleTower', PuzzleTower, false);
game.scene.add('Results', ResultScene, false);
game.scene.add('RoundUp', RoundUp, false);
