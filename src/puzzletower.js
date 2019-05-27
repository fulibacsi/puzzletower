class PuzzleTower extends Phaser.Scene {

    constructor() {
        super({key: "PuzzleTower"});
    }

    create(data) {
        this.number_of_players = data.players;
        this.number_of_rounds = data.rounds;
        this.round_number = 1;
        this.round_time = data.round_time;

        console.log(this.number_of_players, 'players are playing for', this.number_of_rounds, 'rounds.');

        this.players = {}
        for (var i=0; i < this.number_of_players; i++) {
            var name = 'p' + (i + 1).toString();
            // player offset * 100 + player_pos * 200 + offset
            var offsetX = (4 - this.number_of_players) * 100 + (i * 200) + 75;
            this.players[name] = new Player(name=name, offsetX, 50);
        }

        // new shape containers
        this.next_shapes = {};
        this.nexts = {};

        // lands + sky
        this.lands = {};

        // input key container
        this.cursors = {};

        // score displays
        this.score_popups = {};
        this.scoreboards = {};

        // countdown
        this.remaining_time = this.round_time;
        this.timer_display = this.add.text(350, 500, '00:' + this.remaining_time.toString(), assets.texts['timer']).setDepth(1);
        this.timer = this.time.addEvent({
            'delay': 1000, // every second
            'repeat': this.round_time + 1,
            'startAt': 0,
            'callback': function(scene) {
                if (scene.remaining_time < 0) {
                    scene.decide_winners();
                }

                var sectext = scene.remaining_time > 9 ? scene.remaining_time.toString() : '0' + scene.remaining_time.toString();
                scene.timer_display.setText('00:' + sectext);
                scene.remaining_time--;
            },
            'args': [this]
        });

        // Init game board
        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.esckey = this.input.keyboard.addKey('ESC');

        for (var name in this.players) {
            // shapes + images
            var base_shape = shape.generate();
            var next_shape = shape.generate();

            var base = this.add.image(this.players[name].offsetX, this.players[name].offsetY + 32 * 7, base_shape).setOrigin(0, 0);
            this.nexts[name] = this.add.image(this.players[name].offsetX, this.players[name].offsetY + 32 * 0, next_shape).setOrigin(0, 0);

            this.players[name].add_shape(base_shape, base, this);
            this.next_shapes[name] = next_shape;

            // controls
            this.cursors[name] = this.input.keyboard.addKeys(assets.controls[name]);

            // PLAYER FRAME
            this.add.image(this.players[name].offsetX - 50,
                           this.players[name].offsetY - 40,
                           'frame_' + name).setOrigin(0, 0);

            // land
            this.lands[name] = this.add.image(this.players[name].offsetX - 50,
                                              this.players[name].offsetY - 40,
                                              'land_0').setOrigin(0, 0).setDepth(1);

            // name
            this.add.text(this.players[name].offsetX + 10,
                          this.players[name].offsetY - 40,
                          name,
                          assets.texts[name]['board']).setOrigin(0, 0);

            // control
            var drop_text = name != 'p1' ? assets.controls[name]['skip'] : '<'
            var add_text = name != 'p1' ? assets.controls[name]['drop'] : '>'
            this.add.text(this.players[name].offsetX - 13,
                          this.players[name].offsetY + 373,
                          drop_text,
                          assets.texts[name]['controls']).setOrigin(0, 0);
            this.add.text(this.players[name].offsetX + 54,
                          this.players[name].offsetY + 373,
                          add_text,
                          assets.texts[name]['controls']).setOrigin(0, 0);

            // score board
            this.score_popups[name] = this.add.text(this.players[name].offsetX,
                                                    this.players[name].offsetY + 32 * 4.5,
                                                    '',
                                                    assets.texts[name]['popup']);
            this.scoreboards[name] = this.add.text(this.players[name].offsetX + 5,
                                                   this.players[name].offsetY + 32 * 9,
                                                   'score: 0\n wins: 0',
                                                   assets.texts[name]['board']).setOrigin(0.25, 0);
        }

        // display countdown scene
        this.countdown();
    }


    update() {
        if (Phaser.Input.Keyboard.JustDown(this.esckey)) {
            this.scene.start('MainMenu');
        }


        for (var name in this.players) {
            // get player stuff
            var cursor = this.cursors[name];

            // drop command
            if (Phaser.Input.Keyboard.JustDown(cursor.drop)) {
                var score_diff = 0;

                // match!
                if (shape.check_compatibility(this.players[name].base_shape(), this.next_shapes[name])) {
                    // shape movement
                    score_diff = this.players[name].add_shape(this.next_shapes[name], this.nexts[name], this);

                    // next shape generation
                    this.next_shapes[name] = shape.generate();
                    this.nexts[name] = this.add.image(this.players[name].offsetX,
                                                      this.players[name].offsetY + 32 * 0,
                                                      this.next_shapes[name]).setOrigin(0, 0);

                    // sound
                    this.sound.play('ok1');

                    // land
                    if (this.players[name].tower.length > 15) {
                        this.lands[name].destroy();
                        this.lands[name] = this.add.image(this.players[name].offsetX - 50,
                                                          this.players[name].offsetY - 40,
                                                          'land_2').setOrigin(0, 0);
                    }
                    else if (this.players[name].tower.length > 5) {
                        this.lands[name].destroy();
                        this.lands[name] = this.add.image(this.players[name].offsetX - 50,
                                                          this.players[name].offsetY - 40,
                                                          'land_1').setOrigin(0, 0);
                    }
                }

                // mismatch!
                else {
                    console.log(name, ' MISS!');
                    // remove dropped shape
                    this.nexts[name].destroy();
                    score_diff = this.players[name].collapse(this);

                    // next shape generation
                    this.next_shapes[name] = shape.generate();
                    this.nexts[name] = this.add.image(this.players[name].offsetX,
                                                      this.players[name].offsetY + 32 * 0,
                                                      this.next_shapes[name]).setOrigin(0, 0);

                    // sound
                    this.sound.play('explosion');
                }

                // score update
                if (score_diff != 0) {
                    console.log(name, 'SCOREBOARD UPDATE!');
                    // scoreboard update
                    this.scoreboards[name].setText('score: ' + this.players[name].score + '\n wins: ' + this.players[name].wins);

                    // score popup
                    var scr_txt = score_diff.toString();
                    var score_popup_text = score_diff > 0 ? '+' + scr_txt : scr_txt;
                    this.score_popups[name].setText(score_popup_text).setDepth(1);
                    this.time.delayedCall(500, function(name) { this.score_popups[name].setText(); }, [name], this);

                }
            }

            // skip command
            else if (Phaser.Input.Keyboard.JustDown(cursor.skip)) {
                // visual feedback
                utils.moveTo(this,
                             this.nexts[name],
                             this.nexts[name].x - 128,
                             this.nexts[name].y,
                             100,
                             utils.destroy,
                             [this.nexts[name]]
                             );

                // sound
                if (shape.check_compatibility(this.players[name].base_shape(), this.next_shapes[name], true)) {
                    console.log(name, ' MISS COMP!');
                    this.sound.play('error');
                } else {
                    console.log(name, ' GOOD CALL!');
                    this.sound.play('ok2');
                }

                // next shape generation
                this.next_shapes[name] = shape.generate();
                this.nexts[name] = this.add.image(this.players[name].offsetX,
                                                  this.players[name].offsetY + 32 * 0,
                                                  this.next_shapes[name]).setOrigin(0, 0);
            }
        }
    }


    decide_winners() {
        console.log('DECIDING WINNERS');
        this.scene.pause();
        // winner computation
        var winners = utils.get_winners(this.players);
        for (var winner of winners) {
            this.players[winner].wins++;
        }
        if (this.round_number >= this.number_of_rounds) {
            this.scene.start("Results", {'players': this.players});
        }
        else {
            this.scene.launch('RoundUp', {'round_number': this.round_number,
                                        'winners': winners});
        }
        this.round_number++;
        this.reset(this);
    }

    countdown() {
        this.scene.setVisible(true, 'countdown');
        this.scene.run('countdown', {'countdown': 3, 'anims': this.scene.anims});
        this.scene.pause();

    }

    reset(scene) {
        console.log('RESET!');

        // countdown
        scene.remaining_time = scene.round_time;
        scene.timer_display.setText('00:' + scene.remaining_time.toString());
        scene.timer.remove()
        scene.timer = scene.time.addEvent({
            'delay': 1000, // every second
            'repeat': 31,
            'startAt': 0,
            'callback': function(scene) {
                if (scene.remaining_time < 0) {
                    scene.decide_winners();
                }

                var sectext = scene.remaining_time > 9 ? scene.remaining_time.toString() : '0' + scene.remaining_time.toString();
                scene.timer_display.setText('00:' + sectext);
                scene.remaining_time--;
            },
            'args': [scene]
        })

        // clear nexts
        for (var name in scene.players) {
            scene.nexts[name].destroy();
        }
        scene.nexts = {};

        // reset game board
        for (var name in scene.players) {
            // reset players
            scene.players[name].reset();

            // shapes + images
            var base_shape = shape.generate();
            var next_shape = shape.generate();

            var base = scene.add.image(scene.players[name].offsetX,
                                       scene.players[name].offsetY + 32 * 7,
                                       base_shape).setOrigin(0, 0);
            scene.nexts[name] = scene.add.image(scene.players[name].offsetX,
                                                scene.players[name].offsetY + 32 * 0,
                                                next_shape).setOrigin(0, 0);

            scene.players[name].add_shape(base_shape, base, scene);
            scene.next_shapes[name] = next_shape;

            // land
            scene.lands[name].destroy();
            scene.lands[name] = scene.add.image(scene.players[name].offsetX - 50,
                                                scene.players[name].offsetY - 40,
                                                'land_0').setOrigin(0, 0);

            // score board
            scene.scoreboards[name].setText('score: 0\n wins: ' + scene.players[name].wins);
        }
    }
}
