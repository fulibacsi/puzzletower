class MainMenu extends Phaser.Scene {
    constructor() {
        super({key: "MainMenu"});
    }

    preload() {
        for (var key in assets.images) {
            this.load.image(key, assets.images[key]);
        }

        for (var key in assets.anims) {
            this.load.spritesheet(key, assets.anims[key]['src'], assets.anims[key]['params']);
        }

        for (var key in assets.sounds) {
            this.load.audio(key, assets.sounds[key]);
        }
    }

    create() {
        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.add.image(100, 100, 'logo').setOrigin(0, 0);

        var players = 4;
        var rounds = 5;
        var timer = 30;

        // START
        this.start_button = this.add.text(350, 300, 'START', assets.texts['menu'])
                                    .setInteractive({ useHandCursor: true })
                                    .on('pointerdown', function (event) {
                                        this.scene.start("PuzzleTower", {'players': players,
                                                                         'rounds': rounds,
                                                                         'round_time': timer});
                                    }, this);

        // PLAYER SETUP
        this.add.text(330, 335, 'PLAYERS', assets.texts['menu']);
        this.player_display = this.add.text(392, 365, players, assets.texts['menu']);
        this.remove_player_button = this.add.image(360, 370, 'icon_right')
                                            .setOrigin(0, 0)
                                            .setInteractive({ useHandCursor: true })
                                            .on('pointerdown', function (event) {
                                                console.log('REMOVE PLYAER', players);
                                                players = Math.max(1, players - 1);
                                                this.player_display.setText(players);
                                                console.log(players);
                                            }, this);
        this.add_player_button = this.add.image(420, 370, 'icon_left')
                                         .setOrigin(0, 0)
                                         .setInteractive({ useHandCursor: true })
                                         .on('pointerdown', function (event) {
                                             console.log('ADD PLYAER', players);
                                             players = Math.min(4, players + 1);
                                             this.player_display.setText(players);
                                             console.log(players);
                                         }, this);

        // ROUND SETUP
        this.add.text(340, 405, 'ROUNDS', assets.texts['menu']);
        this.round_display = this.add.text(392, 435, rounds, assets.texts['menu']);
        this.remove_round_button = this.add.image(360, 440, 'icon_right')
                                           .setOrigin(0, 0)
                                           .setInteractive({ useHandCursor: true })
                                           .on('pointerdown', function (event) {
                                             rounds = Math.max(1, rounds - 1);
                                             this.round_display.setText(rounds);
                                           }, this);
        this.add_round_button = this.add.image(420, 440, 'icon_left')
                                        .setOrigin(0, 0)
                                        .setInteractive({ useHandCursor: true })
                                        .on('pointerdown', function (event) {
                                            rounds = Math.min(10, rounds + 1);
                                            this.round_display.setText(rounds);
                                        }, this);

        // TIMER SETUP
        this.add.text(350, 475, 'TIMER', assets.texts['menu']);
        this.timer_display = this.add.text(392, 505, timer, assets.texts['menu']);
        this.remove_timer_button = this.add.image(360, 510, 'icon_right')
                                           .setOrigin(0, 0)
                                           .setInteractive({ useHandCursor: true })
                                           .on('pointerdown', function (event) {
                                               timer = Math.max(10, timer - 5);
                                               this.timer_display.setText(timer);
                                           }, this);
        this.add_timer_button = this.add.image(435, 510, 'icon_left')
                                        .setOrigin(0, 0)
                                        .setInteractive({ useHandCursor: true })
                                           .on('pointerdown', function (event) {
                                               timer = Math.min(50, timer + 5);
                                               this.timer_display.setText(timer);
                                           }, this);
    }
}


class RoundUp extends Phaser.Scene {
    constructor() {
        super({key: "RoundUp"});
    }

    create(data) {
        this.add.image(0, 0, 'background').setOrigin(0, 0);

        // ROUND REPORT POPUP
        this.add.image(100, 100, 'round_modal').setOrigin(0, 0);
        this.add.text(250, 120,
                      'ROUND ' + data.round_number.toString() + ' WINNERS:',
                      assets.texts['menu']).setOrigin(0, 0);

        for (var i=0; i < data.winners.length; i++) {
            this.add.text(380, 150 + 30 * (i + 1), data.winners[i], assets.texts['menu'])
                     .setOrigin(0, 0);
        }
        this.add.text
        this.round_countdown = 3;
        this.round_countdown_display = this.add.text(380, 320,
                                                     this.round_countdown.toString(),
                                                     assets.texts['menu']).setOrigin(0, 0);

        this.time.addEvent({
            'delay': 1500,
            'repeat': 3,
            'startAt': 0,
            'callback': function(scene) {
                scene.round_countdown--;
                scene.round_countdown_display.setText(scene.round_countdown.toString());

                if (scene.round_countdown <= 0) {
                    scene.scene.resume('PuzzleTower');
                    scene.scene.stop();
                }
            },
            'args': [this]
        });
    }
}



class ResultScene extends Phaser.Scene {
    constructor() {
        super({key: "Results"});
    }

    create(data) {
        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.add.image(100, 100, 'round_modal').setOrigin(0, 0);

        this.add.text(300, 120, 'RESULTS:', assets.texts['menu']).setOrigin(0, 0);

        var winners = utils.get_winners(data.players, 'wins');
        var i = 0;
        for (var name in data.players) {
            var result_text = name + ' won ' + data.players[name].wins.toString() + ' times.'
            var display = this.add.text(280, 200 + 30 * i++, result_text, assets.texts['menu']);
            if (winners.includes(name)) {
                display.setColor('#f00');
            }
        }

        this.input.once('pointerdown', function (event) {
            this.scene.start("MainMenu");
        }, this);
    }
}
