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
        this.add.image(100, 280, 'round_modal').setOrigin(0, 0);

        var players = 4;
        var rounds = 5;
        var timer = 30;

        // START
        // either use the mounse
        this.start_button = this.add.text(350, 300, 'START', assets.texts['menu'])
                                    .setInteractive({ useHandCursor: true })
                                    .on('pointerover', function (event) {
                                        this.setColor('#f00');
                                    })
                                    .on('pointerout', function (event) {
                                        this.setColor('#fff');
                                    })
                                    .on('pointerdown', function (event) {
                                        // analytics
                                        gtag('event', 'start', {
                                            'event_category': 'GAME',
                                            'event_label': players.toString() + ' player'
                                        });

                                        this.scene.start("PuzzleTower", {'players': players,
                                                                         'rounds': rounds,
                                                                         'round_time': timer});
                                    }, this);

        // or press space
        this.input.keyboard.on('keydown-SPACE', function (event) {
            this.scene.start("PuzzleTower", {'players': players, 'rounds': rounds, 'round_time': timer});
        }, this);

        // PLAYER SETUP
        this.add.text(330, 335, 'PLAYERS', assets.texts['menu']);
        this.player_display = this.add.text(392, 365, players, assets.texts['menu']);
        this.remove_player_button = this.add.image(360, 370, 'icon_left')
                                            .setOrigin(0, 0)
                                            .setInteractive({ useHandCursor: true })
                                            .on('pointerdown', function (event) {
                                                if (players > 1) {
                                                    players--;
                                                    this.player_display.setText(players);
                                                    this.sound.play('ok1');
                                                } else {
                                                    this.sound.play('error');
                                                }
                                            }, this);
        this.add_player_button = this.add.image(420, 370, 'icon_right')
                                         .setOrigin(0, 0)
                                         .setInteractive({ useHandCursor: true })
                                         .on('pointerdown', function (event) {
                                            if (players < 4) {
                                                players++;
                                                this.player_display.setText(players);
                                                this.sound.play('ok1');
                                            } else {
                                                this.sound.play('error');
                                            }
                                         }, this);

        // ROUND SETUP
        this.add.text(340, 405, 'ROUNDS', assets.texts['menu']);
        this.round_display = this.add.text(392, 435, rounds, assets.texts['menu']);
        this.remove_round_button = this.add.image(360, 440, 'icon_left')
                                           .setOrigin(0, 0)
                                           .setInteractive({ useHandCursor: true })
                                           .on('pointerdown', function (event) {
                                              if (rounds > 1) {
                                                  rounds--;
                                                  this.round_display.setText(rounds);
                                                  this.sound.play('ok1');
                                              } else {
                                                  this.sound.play('error');
                                              }
                                           }, this);
        this.add_round_button = this.add.image(420, 440, 'icon_right')
                                        .setOrigin(0, 0)
                                        .setInteractive({ useHandCursor: true })
                                        .on('pointerdown', function (event) {
                                            if (rounds < 10) {
                                                rounds++;
                                                this.round_display.setText(rounds);
                                                this.sound.play('ok1');
                                            } else {
                                                this.sound.play('error');
                                            }
                                        }, this);

        // TIMER SETUP
        this.add.text(350, 475, 'TIMER', assets.texts['menu']);
        this.timer_display = this.add.text(392, 505, timer, assets.texts['menu']);
        this.remove_timer_button = this.add.image(360, 510, 'icon_left')
                                           .setOrigin(0, 0)
                                           .setInteractive({ useHandCursor: true })
                                           .on('pointerdown', function (event) {
                                               if (timer > 10) {
                                                   timer -= 5;
                                                   this.timer_display.setText(timer);
                                                   this.sound.play('ok1');
                                               } else {
                                                   this.sound.play('error');
                                               }
                                           }, this);
        this.add_timer_button = this.add.image(435, 510, 'icon_right')
                                        .setOrigin(0, 0)
                                        .setInteractive({ useHandCursor: true })
                                           .on('pointerdown', function (event) {
                                               if (timer < 50) {
                                                   timer += 5;
                                                   this.timer_display.setText(timer);
                                                   this.sound.play('ok1');
                                               } else {
                                                   this.sound.play('error');
                                               }
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

        // WINNER LIST
        for (var i=0; i < data.winners.length; i++) {
            this.add.text(380, 150 + 30 * (i + 1), data.winners[i], assets.texts['menu'])
                     .setOrigin(0, 0);
        }

        // PRESS SPACE TO CONTINUE...
        this.add.text(140, 330, 'PRESS SPACE TO CONTINUE...', assets.texts['menu']).setOrigin(0, 0);

        // SPACE PRESS EVENT
        this.input.keyboard.on('keydown-SPACE', function (event) {
            this.scene.resume('PuzzleTower');
            this.scene.get('PuzzleTower').countdown();
            this.scene.stop();
        }, this);

        // CLICK EVENT
        this.input.on('pointerdown', function (event) {
            this.scene.resume('PuzzleTower');
            this.scene.get('PuzzleTower').countdown();
            this.scene.stop();
        }, this);

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
            var display = this.add.text(260, 180 + 30 * i++, result_text, assets.texts['menu']);
            if (winners.includes(name)) {
                display.setColor('#f00');
            }
        }

        // PRESS SPACE TO CONTINUE...
        this.add.text(140, 330, 'PRESS SPACE TO CONTIUE...', assets.texts['menu']).setOrigin(0, 0);

        // SPACE PRESS EVENT
        this.input.keyboard.on('keydown-SPACE', function (event) {
            this.scene.start("MainMenu");
        }, this);

        // SPACE PRESS EVENT
        this.input.on('pointerdown', function (event) {
            this.scene.start("MainMenu");
        }, this);
    }
}


class CountDownScene extends Phaser.Scene {
    constructor() {
        super({key: "countdown"});
    }

    create(data) {
        this.countdown = data.countdown;

        // add countdown
        this.display = this.add.text(400, 200, this.countdown, assets.texts['countdown'])
                               .setOrigin(0, 0)
                               .setDepth(1);
        this.sound.play('beep1');

        // update countdown
        this.time.addEvent({
            'delay': 1000,
            'repeat': 3,
            'startAt': 0,
            'callback': function(scene) {
                scene.countdown--;
                scene.display.setText(scene.countdown.toString());
                scene.sound.play('beep1');

                if (scene.countdown <= 0) {
                    scene.sound.play('beep2')
                    scene.scene.resume('PuzzleTower');
                    scene.scene.stop();
                }
            },
            'args': [this]
        });

    }
}
